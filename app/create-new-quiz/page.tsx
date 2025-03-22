"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import { createQuiz, updateQuiz, fetchQuizById } from "@/app/utils/api";

// Interface defining the structure of a quiz question
interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  marks: number;
  timeLimit: number; // Add time limit field to each question
}

// Main component for creating and editing quizzes
const CreateNewQuiz = () => {
  // Router hook for navigation
  const router = useRouter();
  // Get URL search parameters to check if we're in edit mode
  const searchParams = useSearchParams();
  const quizId = searchParams.get("id");
  const isEditMode = !!quizId;

  // State management for quiz data
  const [title, setTitle] = useState(""); // Quiz title
  const [description, setDescription] = useState(""); // Quiz description
  const [dueDate, setDueDate] = useState(""); // Due date for the quiz
  const [classId, setClassId] = useState(""); // Class ID for the quiz
  const [subject, setSubject] = useState(""); // Subject for the quiz
  // Initialize questions array with one empty question
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q-${Date.now()}`,
      question: "",
      options: Array(4)
        .fill("")
        .map((_, i) => ({
          id: `q-${Date.now()}-opt-${i}`,
          text: "",
          isCorrect: false,
        })),
      marks: 1, // Default marks per question
      timeLimit: 5, // Default time limit in minutes per question
    },
  ]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Effect hook to load existing quiz data when in edit mode
  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) {
        setLoading(false);
        return;
      }

      try {
        const quiz = await fetchQuizById(quizId);

        // Populate form with existing quiz data
        setTitle(quiz.title);
        setDescription(quiz.description);
        setDueDate(quiz.dueDate);
        setClassId(quiz.classId);
        setSubject(quiz.subject);
        setQuestions(
          quiz.questions.map((q) => ({
            id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            question: q.question,
            options: q.options.map((opt, i) => ({
              id: `q-${Date.now()}-opt-${i}-${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
            marks: q.marks,
            timeLimit: q.timeLimit,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // Function to add a new question to the quiz
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: "",
      options: Array(4)
        .fill("")
        .map((_, i) => ({
          id: `q-${Date.now()}-opt-${i}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          text: "",
          isCorrect: false,
        })),
      marks: 1, // Default marks per question
      timeLimit: 5, // Default time limit in minutes per question
    };
    setQuestions([...questions, newQuestion]);
  };

  // Function to remove a question from the quiz
  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  // Function to update question text
  const updateQuestion = (id: string, questionText: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question: questionText } : q))
    );
  };

  // Function to update option text for a question
  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? { ...opt, text: value } : opt
              ),
            }
          : q
      )
    );
  };

  // Function to set the correct option for a question
  const setCorrectOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) => ({
                ...opt,
                isCorrect: idx === optionIndex,
              })),
            }
          : q
      )
    );
  };

  // Function to update marks for a question
  const updateQuestionMarks = (questionId: string, marks: number) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, marks } : q))
    );
  };

  // Function to update time limit for a question
  const updateQuestionTimeLimit = (questionId: string, timeLimit: number) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, timeLimit } : q))
    );
  };

  // Function to handle form submission (both draft and publish)
  const handleSubmit = async (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format questions data for API submission
      const formattedQuestions = questions.map((q) => ({
        question: q.question,
        options: q.options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        marks: Number(q.marks),
        timeLimit: Number(q.timeLimit),
      }));

      const quizData = {
        title,
        description,
        subject,
        classId,
        dueDate,
        questions: formattedQuestions,
        status: (isDraft ? "draft" : "published") as "draft" | "published",
      };

      // Log the data being sent
      console.log("Sending quiz data:", JSON.stringify(quizData, null, 2));
      console.log("Due date type:", typeof quizData.dueDate);
      console.log("Due date value:", quizData.dueDate);
      console.log(
        "Sample question marks type:",
        typeof quizData.questions[0].marks
      );
      console.log("Sample question marks value:", quizData.questions[0].marks);
      console.log(
        "Sample question timeLimit type:",
        typeof quizData.questions[0].timeLimit
      );
      console.log(
        "Sample question timeLimit value:",
        quizData.questions[0].timeLimit
      );

      let response;
      // Call appropriate API based on mode (edit/create)
      if (isEditMode && quizId) {
        response = await updateQuiz(quizId, quizData);
      } else {
        response = await createQuiz(quizData);
      }

      if (!response) {
        throw new Error("Failed to save quiz");
      }

      // Log the response
      console.log("Quiz creation response:", JSON.stringify(response, null, 2));
      console.log("Response due date:", response.dueDate);
      console.log("Response due date type:", typeof response.dueDate);
      console.log(
        "Response sample question marks:",
        response.questions[0].marks
      );
      console.log(
        "Response sample question timeLimit:",
        response.questions[0].timeLimit
      );

      // Redirect to appropriate page based on quiz status
      router.push(isDraft ? "/draft-quizzes" : "/published-quizzes");
    } catch (err) {
      console.error("Error saving quiz:", err);
      setError(err instanceof Error ? err.message : "Failed to save quiz");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">
          {isEditMode ? "Loading quiz..." : "Saving quiz..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Edit Quiz" : "Create New Quiz"}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quiz Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="classId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Class ID
                </label>
                <input
                  type="text"
                  id="classId"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  placeholder="Enter class ID"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  placeholder="Enter quiz description"
                  required
                />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-800">Questions</h2>

              {questions.map((q, index) => (
                <div key={q.id} className="bg-gray-50 p-8 rounded-lg space-y-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Question {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={questions.length === 1}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(q.id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                      placeholder="Enter your question"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    <div className="space-y-4">
                      {q.options.map((option, optIndex) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-4"
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`question-${q.id}-option-${optIndex}`}
                              name={`question-${q.id}-correct`}
                              checked={option.isCorrect}
                              onChange={() => setCorrectOption(q.id, optIndex)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              required
                            />
                            <label
                              htmlFor={`question-${q.id}-option-${optIndex}`}
                              className="sr-only"
                            >
                              Option {optIndex + 1}
                            </label>
                          </div>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              updateOption(q.id, optIndex, e.target.value)
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                            placeholder={`Option ${optIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`marks-${q.id}`}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Marks
                      </label>
                      <input
                        type="number"
                        id={`marks-${q.id}`}
                        value={q.marks}
                        onChange={(e) =>
                          updateQuestionMarks(q.id, parseInt(e.target.value))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                        placeholder="Enter marks for this question"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`timeLimit-${q.id}`}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Time Limit (minutes)
                      </label>
                      <input
                        type="number"
                        id={`timeLimit-${q.id}`}
                        value={q.timeLimit}
                        onChange={(e) =>
                          updateQuestionTimeLimit(
                            q.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                        placeholder="Enter time limit for this question"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center px-6 py-3 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  <FiPlus className="mr-2" /> Add Question
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Publish Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewQuiz;
