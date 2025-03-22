import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectToDatabase();
		const { id } = params; // Extract userId from path parameters

		if (!id) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 }
			);
		}

		const user = await User.findOne({ _id: id })
			.populate("followers following posts savedPosts likedPosts")
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
