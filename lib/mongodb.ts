import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

async function connectToDatabase() {
	if (mongoose.connection.readyState === 1) {
		console.log("Already connected to MongoDB");
		return mongoose;
	}
	const opts = {
		bufferCommands: false,
	};
	try {
		await mongoose.connect(mongoUri!, opts);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		throw error;
	}
	return mongoose;
}

export default connectToDatabase;
