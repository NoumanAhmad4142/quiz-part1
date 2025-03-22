import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/post";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const GET = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		await connectToDatabase();

		const post = await Post.findById(params.id)
			.populate("creator likes")
			.exec();

		return new Response(JSON.stringify(post), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ message: "Failed to fetch post" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
};

export const POST = async (
	req: NextRequest,
	{ params }: { params: { id: string } }
) => {
	const currentWorkingDirectory = process.cwd();

	try {
		await connectToDatabase();
		console.log("Connected to MongoDB");

		const data = await req.formData();
		console.log("Request data:", data);

		let postPhoto = data.get("postPhoto");
		let newpostPhoto = "";

		if (postPhoto instanceof File) {
			const bytes = await postPhoto.arrayBuffer();
			const buffer = Buffer.from(bytes);

			const postPhotoPath = path.join(
				currentWorkingDirectory,
				"public",
				"uploads",
				postPhoto.name
			);

			await writeFile(postPhotoPath, buffer);
			newpostPhoto = `/uploads/${postPhoto.name}`;
		} else {
			// If postPhoto is not provided, use the existing postPhoto
			const existingPostPhoto = data.get("existingPostPhoto");
			if (existingPostPhoto) {
				newpostPhoto = existingPostPhoto.toString();
			} else {
				throw new Error("Post photo is required");
			}
		}

		const post = await Post.findByIdAndUpdate(
			params.id,
			{
				$set: {
					caption: data.get("caption"),
					tag: data.get("tag"),
					postPhoto: newpostPhoto,
				},
			},
			{ new: true, useFindAndModify: false }
		);

		if (post) {
			await post.save();
			return new Response(JSON.stringify(post), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			return new Response("Post not found", { status: 404 });
		}
	} catch (err) {
		console.error(err);
		return new Response("Failed to update the post", { status: 500 });
	}
};
