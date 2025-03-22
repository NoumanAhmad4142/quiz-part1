import { useState } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description: string;
    subject: string;
    classId: string;
    dueDate: string;
    totalMarks: number;
    questions: Array<{
      question: string;
      options: Array<{ text: string; isCorrect: boolean }>;
      marks: number;
      timeLimit: number;
    }>;
    status: "draft" | "published";
  };
  onDelete: (id: string) => void;
}

export default function QuizCard({ quiz, onDelete }: QuizCardProps) {
  const router = useRouter();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/quiz/edit/${quiz.id}`);
  };

  const handleDelete = () => {
    onDelete(quiz.id);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up
    setIsViewModalOpen(true);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
          <span className="px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            {quiz.status}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{quiz.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Subject: {quiz.subject}</span>
            <span>Class: {quiz.classId}</span>
            <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
            <span>Total Marks: {quiz.totalMarks}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleView}
              className="p-1 text-gray-600 hover:text-blue-600"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={handleEdit}
              className="p-1 text-gray-600 hover:text-blue-600"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-600 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{quiz.title}</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{quiz.description}</p>
              </div>

              {/* Details */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Subject:</span>{" "}
                      {quiz.subject}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Class:</span>{" "}
                      {quiz.classId}
                    </p>
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
              <div>
                <h3 className="text-lg font-semibold mb-4">Questions</h3>
                <div className="space-y-6">
                  {quiz.questions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <div className="text-sm text-gray-500">
                          <span className="mr-4">Marks: {question.marks}</span>
                          <span>Time: {question.timeLimit} min</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              option.isCorrect
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100"
                            }`}
                          >
                            {option.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
