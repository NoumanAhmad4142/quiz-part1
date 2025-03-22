import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import mongoose from "mongoose";

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  options: QuestionOption[];
  marks: number;
  timeLimit: number;
}

interface QuizData {
  title: string;
  description: string;
  subject: string;
  classId: string;
  dueDate: string;
  questions: Question[];
  status?: "draft" | "published";
  totalMarks?: number;
}

interface QuestionResponse extends Question {
  _id: string;
  options: (QuestionOption & { _id: string })[];
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body: QuizData = await req.json();

    // Log the raw received data
    console.log("Raw received quiz data:", JSON.stringify(body, null, 2));

    // Validate required fields
    const requiredFields: (keyof QuizData)[] = [
      "title",
      "description",
      "subject",
      "classId",
      "dueDate",
      "questions",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate and parse due date
    const parsedDueDate = new Date(body.dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid due date format" },
        { status: 400 }
      );
    }

    // Ensure questions have required fields
    const invalidQuestions = body.questions.some(
      (q: Question) =>
        !q.question ||
        !q.options ||
        !Array.isArray(q.options) ||
        q.options.some(
          (opt: QuestionOption) =>
            !opt.text || typeof opt.isCorrect !== "boolean"
        ) ||
        typeof q.marks !== "number" ||
        typeof q.timeLimit !== "number"
    );

    if (invalidQuestions) {
      return NextResponse.json(
        { error: "Invalid question format" },
        { status: 400 }
      );
    }

    // Format the data with proper types
    const formattedQuestions = body.questions.map((q: Question) => ({
      question: q.question,
      options: q.options.map((opt: QuestionOption) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
      marks: Number(q.marks) || 1,
      timeLimit: Number(q.timeLimit) || 5,
    }));

    // Calculate total marks
    const totalMarks = formattedQuestions.reduce((sum, q) => sum + q.marks, 0);

    const quizData = {
      title: body.title,
      description: body.description,
      subject: body.subject,
      classId: body.classId,
      dueDate: parsedDueDate,
      questions: formattedQuestions,
      totalMarks,
      status: body.status || "draft",
      createdBy: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"), // Default user ID
    };

    // Create the quiz
    const quiz = await Quiz.create(quizData);
    console.log("Created quiz:", JSON.stringify(quiz, null, 2));

    // Transform the response to include all fields
    const response = quiz.toObject();
    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating quiz:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query = status ? { status } : {};
    console.log("Fetching quizzes with query:", query);

    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
    console.log("Found quizzes:", quizzes.length);

    // Format the response to ensure all fields are included
    const formattedQuizzes = quizzes.map((quiz) => {
      const response = quiz.toObject();
      return {
        ...response,
        questions: response.questions.map((q: QuestionResponse) => ({
          ...q,
          marks: Number(q.marks),
          timeLimit: Number(q.timeLimit),
        })),
      };
    });

    console.log(
      "Formatted quizzes:",
      JSON.stringify(formattedQuizzes, null, 2)
    );
    return NextResponse.json(formattedQuizzes);
  } catch (error: unknown) {
    console.error("Error fetching quizzes:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
