import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
	const currentWorkingDirectory = process.cwd();
	try {
		await connectToDatabase();
		console.log("Connected to MongoDB");

		const data = await req.formData();
		console.log("Request data:", data);

		const postPhoto = data.get("profileimage") as File; // Ensure the key matches

		if (!postPhoto) {
			return NextResponse.json(
				{ message: "Profile image is required" },
				{ status: 400 }
			);
		}

		const bytes = await postPhoto.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const fileExt = path.extname(postPhoto.name);
		const fileName = `${Date.now()}${fileExt}`;
		const postPhotoPath = path.join(
			currentWorkingDirectory,
			"public",
			"uploads",
			"profileImage",
			fileName
		);

		await writeFile(postPhotoPath, buffer);

		const name = data.get("name");
		const email = data.get("email");
		const password = data.get("password");
		const confirmPassword = data.get("confirmPassword");
		const role = data.get("role");
		const age = data.get("age");

		if (!name || !email || !password || !role || !age) {
			return NextResponse.json(
				{ message: "Please fill all fields" },
				{ status: 400 }
			);
		}
		if (confirmPassword !== password) {
			return NextResponse.json(
				{ message: "Passwords do not match" },
				{ status: 400 }
			);
		}
		if ((password as string).length < 6) {
			return NextResponse.json(
				{ message: "Password must be at least 6 characters" },
				{ status: 400 }
			);
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password as string, 10);

		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			role,
			age,
			image: fileName, // Store the file name instead of the file object
		});

		await newUser.save();

		return NextResponse.json(
			{ message: "User created successfully" },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}
