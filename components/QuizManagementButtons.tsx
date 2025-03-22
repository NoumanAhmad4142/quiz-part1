"use client";

import React, { useEffect } from "react";
import { FiEdit3, FiCheckCircle, FiPlusCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { QuizButton } from "./quiz-button";

const QuizManagementButtons = () => {
  const router = useRouter();

  useEffect(() => {}, []);

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
         評估管理
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuizButton 
            color="blue"
            icon={<FiPlusCircle className="w-6 h-6 text-blue-600" />}
            title="製作新評估"
            subtitle="製作全新評估"
            hint="按此開始製作"
            href="/create-new-quiz"
          />

          <QuizButton 
            color="yellow"
            icon={<FiEdit3 className="w-6 h-6 text-yellow-600" />}
            title="編輯評估草稿"
            subtitle="繼續編輯已保存的評估草稿"
            hint="按此繼續編輯"
            href="/draft-quizzes"
          />

          <QuizButton 
            color="green"
            icon={<FiCheckCircle className="w-6 h-6 text-green-600" />}
            title="查看已發佈的測驗"
            subtitle="查看已發佈評估"
            hint="按此查看已發佈評估"
            href="/published-quizzes"
          />
        </div>
      </div>
    </div>
  );
};

export default QuizManagementButtons;
