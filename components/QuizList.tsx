/**
 * QuizList Component
 * Displays a list of quizzes (either draft or published) with options to view, edit, and delete them.
 * Includes loading states, error handling, and empty state handling.
 */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit3, FiTrash2, FiEye, FiClock, FiBook } from "react-icons/fi";
import { Quiz, fetchQuizzes, deleteQuiz } from "@/app/utils/api";

// Props interface defining the component's props
interface QuizListProps {
  status: "draft" | "published"; // Determines whether to show draft or published quizzes
}

const QuizList: React.FC<QuizListProps> = ({ status }) => {
  const router = useRouter();
  // State management for quizzes, loading state, and error handling
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quizzes when component mounts or status changes
  useEffect(() => {
    loadQuizzes();
  }, [status]);

  /**
   * Loads quizzes from the API based on the current status
   * Updates the quizzes state and handles loading/error states
   */
  const loadQuizzes = async () => {
    try {
      const data = await fetchQuizzes(status);
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles quiz deletion with confirmation
   * @param id - The ID of the quiz to delete
   */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quiz");
    }
  };

  /**
   * Navigates to the quiz edit page
   * @param id - The ID of the quiz to edit
   */
  const handleEdit = (id: string) => {
    router.push(`/create-new-quiz?id=${id}`);
  };

  /**
   * Navigates to the quiz view page
   * @param id - The ID of the quiz to view
   */
  const handleView = (id: string) => {
    router.push(`/quiz/${id}`);
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header section with title and create button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {status === "draft" ? "Draft Quizzes" : "Published Quizzes"}
          </h1>
          <button
            onClick={() => router.push("/create-new-quiz")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Quiz
          </button>
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty state handling */}
        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No {status} quizzes found.</p>
            <button
              onClick={() => router.push("/create-new-quiz")}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Create your first quiz →
            </button>
          </div>
        ) : (
          // Grid layout for quiz cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              // Individual quiz card
              <div
                key={quiz._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Quiz title and status badge */}
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {quiz.title}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Quiz description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {quiz.description}
                  </p>

                  {/* Quiz metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiBook className="w-4 h-4 mr-2" />
                      <span>{quiz.subject}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span>
                        Due: {new Date(quiz.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">Questions:</span>
                      <span>{quiz.questions.length}</span>
                    </div>
                  </div>

                  {/* Action buttons and creation date */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(quiz._id)}
                        className="p-2 text-blue-600 hover:text-blue-700"
                        title="View Quiz"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      {status === "draft" && (
                        <button
                          onClick={() => handleEdit(quiz._id)}
                          className="p-2 text-yellow-600 hover:text-yellow-700"
                          title="Edit Quiz"
                        >
                          <FiEdit3 className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(quiz._id)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title="Delete Quiz"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Created: {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
