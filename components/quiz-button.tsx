import { useRouter } from "next/navigation";
import { ReactElement, useEffect } from "react";

interface QuizButtonProps {
    color: string;
    icon: ReactElement;
    title: string;
    subtitle: string;
    hint: string;
    href: string;
}

export const QuizButton = (props: QuizButtonProps) => {
    const router = useRouter();
    
    useEffect(() => {}, []);

    const handleCardClick = (route: string) => {
        router.push(route);
    };
      
    return (
        <div
            onClick={() => handleCardClick(props.href)} // /create-new-quiz, /draft-quizzes, /published-quizzes
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
            >
            <div className="p-6">
                <div className={`w-12 h-12 bg-${props.color}-100 rounded-full flex items-center justify-center mb-4`}>
                    {props.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {props.title}
                </h2>
                <p className="text-gray-600">
                {props.subtitle}
                </p>
                <div className="mt-4">
                <span className={`inline-flex items-center text-${props.color}-600 hover:text-${props.color}-700 font-medium`}>
                {props.hint}
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
    )
}