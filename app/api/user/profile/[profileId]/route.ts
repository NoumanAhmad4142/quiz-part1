import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import Post from "@/models/post";

export async function GET(
	req: NextRequest,
	{ params }: { params: { profileId: string } }
) {
	try {
		await connectToDatabase();
		const { profileId } = params; // Extract profileId from path parameters

		if (!profileId) {
			return NextResponse.json(
				{ message: "Profile ID is required" },
				{ status: 400 }
			);
		}

		const user = await User.findById(params.profileId)
			.populate({
				path: "posts savedPosts likedPosts",
				model: Post,
				populate: {
					path: "creator",
					model: User,
				},
			})
			.populate({
				path: "followers following",
				model: User,
				populate: {
					path: "posts savedPosts likedPosts",
					model: Post,
				},
			})
			.exec();

		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch user:", error);
		return NextResponse.json(
			{ message: "Failed to fetch user" },
			{ status: 500 }
		);
	}
}
