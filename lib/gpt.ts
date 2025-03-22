import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export class GptService {
	public openAi: OpenAI;
	private records: ChatCompletionMessageParam[] = [];

	constructor() {
		this.openAi = new OpenAI({
			baseURL: process.env["BASE_URL"] || "https://api.gpt.tecky.ai/v1",
			apiKey: "78177aa4-46e6-4535-97db-ec9631299dfa", // This is the default and can be omitted
		});
	}
}

interface OutputFormat {
	[key: string]: string | string[] | OutputFormat;
}

const openai = new GptService();

export async function strict_output(
	system_prompt: string,
	user_prompt: string | string[],
	output_format: OutputFormat,
	default_category: string = "",
	output_value_only: boolean = false,
	model: string = "gpt-3.5-turbo",
	temperature: number = 1,
	num_tries: number = 3,
	verbose: boolean = false
): Promise<
	{
		question: string;
		answer: string;
		option1?: string;
		option2?: string;
		option3?: string;
		option4?: string;
		option5?: string;
		correctOption?: string;
	}[]
> {
	const gptService = new GptService();

	const list_input: boolean = Array.isArray(user_prompt);
	const dynamic_elements: boolean = /<.*?>/.test(
		JSON.stringify(output_format)
	);
	const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

	let error_msg: string = "";

	for (let i = 0; i < num_tries; i++) {
		let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
			output_format
		)}. \nDo not put quotation marks or escape character \\ in the output fields.`;

		if (list_output) {
			output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
		}

		if (dynamic_elements) {
			output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
		}

		if (list_input) {
			output_format_prompt += `\nGenerate a list of json, one json for each input element.`;
		}

		const messages: ChatCompletionMessageParam[] = [
			{
				role: "system",
				content: system_prompt + output_format_prompt + error_msg,
			},
			{ role: "user", content: user_prompt.toString() },
		];

		const response = await gptService.openAi.chat.completions.create({
			messages,
			model,
			temperature,
		});

		let res: string =
			response.choices[0].message?.content?.replace(/'/g, '"') ?? "";

		res = res.replace(/(\w)"(\w)/g, "$1'$2");

		if (verbose) {
			console.log(
				"System prompt:",
				system_prompt + output_format_prompt + error_msg
			);
			console.log("\nUser prompt:", user_prompt);
			console.log("\nGPT response:", res);
		}

		try {
			let output: any = JSON.parse(res);

			if (list_input) {
				if (!Array.isArray(output)) {
					throw new Error("Output format not in a list of json");
				}
			} else {
				output = [output];
			}

			for (let index = 0; index < output.length; index++) {
				for (const key in output_format) {
					if (/<.*?>/.test(key)) {
						continue;
					}

					if (!(key in output[index])) {
						throw new Error(`${key} not in json output`);
					}

					if (Array.isArray(output_format[key])) {
						const choices = output_format[key] as string[];
						if (Array.isArray(output[index][key])) {
							output[index][key] = output[index][key][0];
						}
						if (
							!choices.includes(output[index][key]) &&
							default_category
						) {
							output[index][key] = default_category;
						}
						if (output[index][key].includes(":")) {
							output[index][key] =
								output[index][key].split(":")[0];
						}
					}
				}

				if (output_value_only) {
					output[index] = Object.values(output[index]);
					if (output[index].length === 1) {
						output[index] = output[index][0];
					}
				}

				// Ensure the correct answer is included in the options and mark it
				if (output[index].answer) {
					const optionKeys = Object.keys(output[index]).filter(
						(key) => key.startsWith("option")
					);
					if (!optionKeys.includes(output[index].answer)) {
						const emptyOptionKey = optionKeys.find(
							(key) => !output[index][key]
						);
						if (emptyOptionKey) {
							output[index][emptyOptionKey] =
								output[index].answer;
						} else {
							output[index][optionKeys[0]] = output[index].answer;
						}
					}
					output[index].correctOption = output[index].answer;
				}
			}

			return list_input ? output : output[0];
		} catch (e) {
			error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
			console.log("An exception occurred:", e);
			console.log("Current invalid json format:", res);
		}
	}

	return [];
}
