import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
	name: string;
	email: string;
	password?: string;
	age: number;
	id: string;
	role: string;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
	posts: mongoose.Schema.Types.ObjectId[];
	savedPosts: mongoose.Schema.Types.ObjectId[];
	likedPosts: mongoose.Schema.Types.ObjectId[];
	followers: mongoose.Schema.Types.ObjectId[];
	following: mongoose.Schema.Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			required: true,
		},
		role: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: false,
		},
		posts: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
			default: [],
		},
		savedPosts: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
			default: [],
		},
		likedPosts: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
			default: [],
		},
		followers: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
			default: [],
		},
		following: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
