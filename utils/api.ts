export interface Quiz {
  _id: string;
  title: string;
  description: string;
  subject: string;
  classId: string;
  dueDate: string;
  questions: Array<{
    question: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
    marks: number;
    timeLimit: number;
  }>;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export async function createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
  const response = await fetch("/api/quizzes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create quiz");
  }
  return response.json();
}
