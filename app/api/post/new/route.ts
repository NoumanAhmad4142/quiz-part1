import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/post";
import User from "@/models/user";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { Types } from "mongoose";

export const POST = async (req: NextRequest) => {
	const currentWorkingDirectory = process.cwd();

	try {
		await connectToDatabase();
		console.log("Connected to MongoDB");

		const data = await req.formData();
		console.log("Request data:", data);

		const creatorId = data.get("creatorId") as string;
		const caption = data.get("caption") as string;
		const tag = data.get("tag") as string;
		const postPhoto = data.get("postPhoto") as File;

		if (!creatorId || !Types.ObjectId.isValid(creatorId)) {
			throw new Error("Invalid creatorId");
		}

		const bytes = await postPhoto.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const postPhotoPath = path.join(
			currentWorkingDirectory,
			"public",
			"uploads",
			postPhoto.name
		);

		await writeFile(postPhotoPath, buffer);

		const newpostPhoto = `/uploads/${postPhoto.name}`;

		const newPost = await Post.create({
			creator: new Types.ObjectId(creatorId),
			caption,
			tag,
			postPhoto: newpostPhoto,
		});

		await newPost.save();

		// Update the user's posts array
		await User.findByIdAndUpdate(
			creatorId,
			{ $push: { posts: newPost._id } },
			{ new: true, useFindAndModify: false }
		);

		return new Response(JSON.stringify(newPost), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response("Failed to create a new post", { status: 500 });
	}
};
