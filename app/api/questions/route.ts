import { strict_output } from "../../../lib/gpt";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/models/Quiz"; // Ensure you have a Quiz model defined
import mongoose from "mongoose";

export const runtime = "nodejs";
export const maxDuration = 500;

export async function POST(req: Request) {
	try {
		await connectToDatabase(); // Connect to MongoDB

		const body = await req.json();
		const { amount, topic, type } = body;

		let questions: any;

		if (type === "open_ended") {
			questions = await strict_output(
				"You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
				new Array(amount).fill(
					`You are to generate a random hard open-ended questions about ${topic}`
				),
				{
					question: "question",
					answer: "answer with max length of 15 words",
				}
			);
		} else if (type === "mcq") {
			questions = await strict_output(
				"You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
				new Array(amount).fill(
					`You are to generate a random hard mcq question about ${topic}`
				),
				{
					question: "question",
					answer: "answer with max length of 15 words",
					option1: "option1 with max length of 15 words",
					option2: "option2 with max length of 15 words",
					option3: "option3 with max length of 15 words",
					option4: "option4 with max length of 15 words",
				}
			);
		}

		// Ensure the JSON string is properly formatted
		questions = questions.map((q: any) => ({
			question: q.question,
			options: [
				{ text: q.option1, isCorrect: q.option1 === q.answer },
				{ text: q.option2, isCorrect: q.option2 === q.answer },
				{ text: q.option3, isCorrect: q.option3 === q.answer },
				{ text: q.option4, isCorrect: q.option4 === q.answer },
			],
			explanation: "", // Add explanation if needed
		}));

		// Save the generated questions to the quiz collection in MongoDB
		const newQuiz = new Quiz({
			title: "Dummy",
			description: "Dummy",
			questions,
			status: "published",
			createdBy: new mongoose.Types.ObjectId(), // Use a valid ObjectId
		});

		await newQuiz.save();

		return NextResponse.json(
			{
				message: "Quiz created successfully",
				quiz: newQuiz,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ error: (error as ZodError).issues },
				{
					status: 400,
				}
			);
		} else {
			console.error("elle gpt error", error);
			return NextResponse.json(
				{ error: "An unexpected error occurred." },
				{
					status: 500,
				}
			);
		}
	}
}
