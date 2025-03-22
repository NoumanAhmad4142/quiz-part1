"use client";
import { useState, useEffect } from "react";
import { useWindowSize } from "react-use";
import { Button } from "./ui/button";
import { Question } from "./Question";
import ReactConfetti from "react-confetti";

export const Quiz = () => {
	const [quizStarted, setQuizStarted] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [quizCompleted, setQuizCompleted] = useState(false);
	const [answeredQuestions, setAnsweredQuestions] = useState(0);
	const [questions, setQuestions] = useState<
		{
			question: string;
			options: string[];
			correctAnswer: string;
			timeLimit: number;
		}[]
	>([]);
	const { width, height } = useWindowSize();

	useEffect(() => {
		const getQuestions = async () => {
			const response = await fetch(
				`/api/quizzes/67dbe2c88466a121b5317b65`
			);
			const data = await response.json();
			console.log(data);

			const mappedQuestions = data.questions.map((question: any) => ({
				question: question.question,
				options: question.options.map((option: any) => option.text),
				correctAnswer: question.options.find(
					(option: any) => option.isCorrect
				).text,
				timeLimit: 15,
			}));

			setQuestions(mappedQuestions);
		};

		getQuestions();
	}, []);

	const startQuiz = () => {
		setQuizStarted(true);
		setCurrentQuestionIndex(0);
		setScore(0);
		setAnsweredQuestions(0);
		setQuizCompleted(false);
	};

	const handleAnswer = (answer: string) => {
		setAnsweredQuestions(answeredQuestions + 1);
		if (answer === questions[currentQuestionIndex].correctAnswer) {
			setScore(score + 1);
		}
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setQuizCompleted(true);
		}
	};

	const handleTimeout = () => {
		setAnsweredQuestions(answeredQuestions + 1);

		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setQuizCompleted(true);
		}
	};

	if (!quizStarted) {
		return (
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-6">Quiz App</h1>
				<Button
					onClick={startQuiz}
					className="bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
				>
					Start Quiz
				</Button>
			</div>
		);
	}

	if (quizCompleted) {
		const isPerfectScore = score === questions.length;

		return (
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-6">Quiz App</h1>
				<h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
				{isPerfectScore && (
					<ReactConfetti width={width} height={height} />
				)}
				<p
					className={`text-xl ${
						isPerfectScore ? "text-green-600 font-bold" : ""
					}`}
				>
					Your score: {score} out of {questions.length}
				</p>
				<button
					onClick={startQuiz}
					className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition"
				>
					Restart Quiz
				</button>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md mx-auto text-center">
			<h1 className="text-3xl font-bold mb-6">Quiz App</h1>
			{questions.length > 0 && (
				<Question
					question={questions[currentQuestionIndex]}
					onAnswer={handleAnswer}
					onTimeout={handleTimeout}
				/>
			)}
			<p className="mt-4 text-center">
				Question {currentQuestionIndex + 1} of {questions.length}
			</p>
		</div>
	);
};

export default Quiz;
