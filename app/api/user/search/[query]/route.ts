import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

export const GET = async (
	req: Request,
	{ params }: { params: { query: string } }
) => {
	const { query } = params;
	try {
		await connectToDatabase();

		const searchedUsers = await User.find({
			$or: [
				{ name: { $regex: query, $options: "i" } },
				{ email: { $regex: query, $options: "i" } },
			],
		})
			.populate("posts savedPosts likedPosts followers following")
			.exec();

		return new Response(JSON.stringify(searchedUsers), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error(error);
		return new Response("Failed to get users by search", { status: 500 });
	}
};
