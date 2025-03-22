"use client";

import React, { useEffect, useState } from "react";
import { FiEdit3, FiCheckCircle, FiPlusCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Quiz, fetchQuizzes } from "@/app/utils/api";

const CreateQuiz = () => {
  const router = useRouter();
  const [draftQuizzes, setDraftQuizzes] = useState<Quiz[]>([]);
  const [publishedQuizzes, setPublishedQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const [drafts, published] = await Promise.all([
          fetchQuizzes("draft"),
          fetchQuizzes("published"),
        ]);
        setDraftQuizzes(drafts);
        setPublishedQuizzes(published);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch quizzes"
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Quiz Management
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Quiz Card */}
          <div
            onClick={() => handleCardClick("/create-new-quiz")}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FiPlusCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Create New Quizssssss
              </h2>
              <p className="text-gray-600">
                Start creating a new quiz from scratch
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                  Create Quiz
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Draft Quizzes Card */}
          <div
            onClick={() => handleCardClick("/draft-quizzes")}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <FiEdit3 className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Draft Quizzes
              </h2>
              <p className="text-gray-600">
                Access and edit your saved quiz drafts
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium">
                  View Drafts
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {draftQuizzes.length}
                </span>
              </div>
            </div>
          </div>

          {/* Published Quizzes Card */}
          <div
            onClick={() => handleCardClick("/published-quizzes")}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Published Quizzes
              </h2>
              <p className="text-gray-600">
                View and manage your active quizzes
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
                  View Published
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {publishedQuizzes.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
