/**
 * Interface representing a Quiz entity with all its properties
 */
export interface Quiz {
  _id: string; // Unique identifier for the quiz
  title: string; // Title of the quiz
  description: string; // Description/summary of the quiz
  subject: string; // Subject of the quiz
  classId: string; // Class ID for the quiz
  dueDate: string; // Due date for the quiz
  questions: Array<{
    // Array of questions in the quiz
    question: string; // The question text
    options: Array<{
      // Array of possible answers
      text: string; // The answer text
      isCorrect: boolean; // Whether this option is the correct answer
    }>;
    marks: number; // Marks for this question
    timeLimit: number; // Time limit in minutes for this question
  }>;
  status: "draft" | "published"; // Current status of the quiz
  createdAt: string; // Timestamp when the quiz was created
  updatedAt: string; // Timestamp when the quiz was last updated
}

/**
 * Interface for creating or updating a quiz
 * Omits system-generated fields like _id, createdAt, and updatedAt
 */
export interface QuizData {
  title: string; // Title of the quiz
  description: string; // Description/summary of the quiz
  subject: string; // Subject of the quiz
  classId: string; // Class ID for the quiz
  dueDate: string; // Due date for the quiz
  questions: Array<{
    // Array of questions in the quiz
    question: string; // The question text
    options: Array<{
      // Array of possible answers
      text: string; // The answer text
      isCorrect: boolean; // Whether this option is the correct answer
    }>;
    marks: number; // Marks for this question
    timeLimit: number; // Time limit in minutes for this question
  }>;
  status: "draft" | "published"; // Status of the quiz
}

/**
 * Fetches all quizzes from the API
 * @param status Optional parameter to filter quizzes by status (draft/published)
 * @returns Promise resolving to an array of Quiz objects
 * @throws Error if the API request fails
 */
export const fetchQuizzes = async (status?: string): Promise<Quiz[]> => {
  const url = status ? `/api/quizzes?status=${status}` : "/api/quizzes";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch quizzes");
  }
  return response.json();
};

/**
 * Fetches a specific quiz by its ID
 * @param id The unique identifier of the quiz to fetch
 * @returns Promise resolving to a Quiz object
 * @throws Error if the API request fails
 */
export const fetchQuizById = async (id: string): Promise<Quiz> => {
  const response = await fetch(`/api/quizzes/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch quiz");
  }
  return response.json();
};

/**
 * Creates a new quiz
 * @param data The quiz data to create
 * @returns Promise resolving to the created Quiz object
 * @throws Error if the API request fails
 */
export const createQuiz = async (data: QuizData): Promise<Quiz> => {
  console.log("API: Creating quiz with data:", JSON.stringify(data, null, 2));

  const response = await fetch("/api/quizzes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API: Failed to create quiz:", errorData);
    throw new Error(errorData.error || "Failed to create quiz");
  }

  const result = await response.json();
  console.log(
    "API: Quiz created successfully:",
    JSON.stringify(result, null, 2)
  );
  return result;
};

/**
 * Updates an existing quiz
 * @param id The unique identifier of the quiz to update
 * @param data The new quiz data
 * @returns Promise resolving to the updated Quiz object
 * @throws Error if the API request fails
 */
export const updateQuiz = async (id: string, data: QuizData): Promise<Quiz> => {
  const response = await fetch(`/api/quizzes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update quiz");
  }
  return response.json();
};

/**
 * Deletes a quiz
 * @param id The unique identifier of the quiz to delete
 * @returns Promise resolving to void
 * @throws Error if the API request fails
 */
export const deleteQuiz = async (id: string): Promise<void> => {
  const response = await fetch(`/api/quizzes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete quiz");
  }
};
