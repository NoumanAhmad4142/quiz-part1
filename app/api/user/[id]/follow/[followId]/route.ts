import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

export const POST = async (
	req: Request,
	context: { params: { id: string; followId: string } }
) => {
	try {
		await connectToDatabase();

		const { id: userId, followId } = context.params;

		const user: any = await User.findOne({ _id: userId }).populate(
			"posts savedPosts likedPosts followers following"
		);
		const personToFollow: any = await User.findById(followId).populate(
			"posts savedPosts likedPosts followers following"
		);

		if (!user || !personToFollow) {
			return new Response("User not found", { status: 404 });
		}

		const isFollowing = user.following.find(
			(item: any) => item._id.toString() === followId
		);

		if (isFollowing) {
			user.following = user.following.filter(
				(item: any) => item._id.toString() !== followId
			);
			personToFollow.followers = personToFollow.followers.filter(
				(item: any) => item._id.toString() !== user._id.toString()
			);
		} else {
			// Check if the user is already in the following array
			if (
				!user.following.some(
					(item: any) => item._id.toString() === followId
				)
			) {
				user.following.push(personToFollow._id);
			}
			// Check if the user is already in the followers array
			if (
				!personToFollow.followers.some(
					(item: any) => item._id.toString() === user._id.toString()
				)
			) {
				personToFollow.followers.push(user._id);
			}
		}

		await user.save();
		await personToFollow.save();

		return new Response(JSON.stringify(user), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response("Failed to follow/unfollow user", { status: 500 });
	}
};
