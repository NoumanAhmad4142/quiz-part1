import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/post";

export const GET = async (
	request: Request,
	{ params }: { params: { query: string } }
) => {
	const { query } = params;
	try {
		await connectToDatabase();

		const searchedPosts = await Post.find({
			$or: [
				{ caption: { $regex: query, $options: "i" } },
				{ tag: { $regex: query, $options: "i" } },
			],
		})
			.populate("creator likes")
			.exec();

		return new Response(JSON.stringify(searchedPosts), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error(error);
		return new Response("Failed to get posts by search", { status: 500 });
	}
};
