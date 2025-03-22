import mongoose, { Document, Model, Schema } from "mongoose";

interface IPost extends Document {
	creator: mongoose.Schema.Types.ObjectId;
	caption: string;
	postPhoto: string;
	tag: string;
	likes: mongoose.Schema.Types.ObjectId[];
	comments: {
		comment: string;
		user: mongoose.Schema.Types.ObjectId;
		name: string;
		username: string;
		profileImg: string;
		createdAt: Date;
	}[];
	createdAt: Date;
	updatedAt: Date;
}

const PostSchema: Schema<IPost> = new mongoose.Schema({
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	caption: {
		type: String,
		required: true,
	},
	postPhoto: {
		type: String,
		required: true,
	},
	tag: {
		type: String,
		required: true,
	},
	likes: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		default: [],
	},
	comments: {
		type: [
			{
				comment: String,
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				username: String,
				useremail: String,
				profileImg: String,
				createdAt: { type: Date, default: Date.now },
			},
		],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const Post: Model<IPost> =
	mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
