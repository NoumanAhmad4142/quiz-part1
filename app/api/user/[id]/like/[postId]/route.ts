import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/post";
import User from "@/models/user";

export const POST = async (
	req: Request,
	context: { params: { id: string; postId: string } }
) => {
	try {
		await connectToDatabase();
		const { id: userId, postId } = context.params;

		console.log(userId, postId, context.params);

		const user: any = await User.findOne({ _id: userId }).populate(
			"posts savedPosts likedPosts followers following"
		);
		const postToLike: any = await Post.findById(postId).populate("likes");

		if (!user || !postToLike) {
			return new Response("User or Post not found", { status: 404 });
		}

		const isLiked = postToLike.likes.find(
			(item: any) => item._id.toString() === userId
		);

		if (isLiked) {
			user.likedPosts = user.likedPosts.filter(
				(item: any) => item._id.toString() !== postId
			);
			postToLike.likes = postToLike.likes.filter(
				(item: any) => item._id.toString() !== userId.toString()
			);
		} else {
			if (
				!user.likedPosts.some(
					(item: any) => item._id.toString() === postId
				)
			) {
				user.likedPosts.push(postToLike._id);
			}
			if (
				!postToLike.likes.some(
					(item: any) => item._id.toString() === user._id.toString()
				)
			) {
				postToLike.likes.push(user._id);
			}
		}

		await user.save();
		await postToLike.save();

		return new Response(JSON.stringify(user), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response("Failed to like/unlike post", { status: 500 });
	}
};
