import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/post";

export const PUT = async (req: Request, params: { [key: string]: any }) => {
	try {
		await connectToDatabase();
		const data = await req.json();
		const post = await Post.findById(data.postId);
		if (!post) {
			return {
				status: 404,
				body: {
					message: "Post not found",
				},
			};
		}
		const updatePost = await Post.findByIdAndUpdate(
			data.postId,
			{
				$push: {
					comments: {
						comment: data.comment,
						user: data.user,
						username: data.username,
						useremail: data.useremail,
						profileImg: data.profileImg,
						createdAt: new Date(),
					},
				},
			},
			{ new: true }
		);
		return new Response(JSON.stringify(updatePost), {
			status: 200,
		});
	} catch (error) {
		console.error(error);
		return new Response("Failed to update post", { status: 500 });
	}
};
