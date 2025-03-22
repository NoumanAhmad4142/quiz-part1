import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/post";

export const GET = async (req: Request) => {
	try {
		await connectToDatabase();

		// Correctly chain the query methods
		const feedPosts = await Post.find()
			.populate("creator likes")
			.sort({ createdAt: -1 }) // Sort by createdAt in descending order
			.exec(); // Execute the query

		return new Response(JSON.stringify(feedPosts), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ message: "Failed to fetch posts" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
};
