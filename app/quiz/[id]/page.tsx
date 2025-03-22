import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/models/Quiz";

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

interface PageProps {
  params: {
    id: string;
  };
}

export default async function QuizPage({ params }: PageProps) {
  await connectToDatabase();

  const quiz = await Quiz.findById(params.id);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-gray-600">{quiz.description}</p>
        </div>

        {/* Quiz Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Subject:</span> {quiz.subject}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Class:</span> {quiz.classId}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Due Date:</span>{" "}
                {new Date(quiz.dueDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Status:</span>{" "}
                <span className="capitalize">{quiz.status}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Questions</h2>
          {quiz.questions.map((question: Question, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                <div className="text-sm text-gray-500">
                  <span className="mr-4">Marks: {question.marks}</span>
                  <span>Time: {question.timeLimit} min</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{question.question}</p>
              <div className="space-y-2">
                {question.options.map(
                  (option: QuestionOption, optIndex: number) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg ${
                        option.isCorrect
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {option.text}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
