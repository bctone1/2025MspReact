"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/Carousel";

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "AI 프로젝트 생성",
      description: "인공지능을 활용한 프로젝트 생성과 관리를 도와드립니다.",
    },
    {
      title: "효율적인 개발 환경",
      description: "다양한 인공지능 도구를 통해 더욱 효율적인 개발 환경을 제공합니다.",
    },
    {
      title: "자동화된 분석",
      description: "자동화된 데이터 분석 기능으로 프로젝트의 진행 상황을 실시간으로 파악합니다.",
    },
    {
      title: "결과물 시각화",
      description: "AI 모델의 결과를 쉽게 시각화하여 직관적으로 이해할 수 있게 돕습니다.",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* 슬라이드 섹션 */}
      <div className="flex-1 flex justify-center items-center bg-white text-black p-5 flex-col text-center">
        <h1 className="text-4xl font-extrabold mb-5 text-black">BEGIN</h1>
        
      </div>

      {/* 버튼 섹션 */}
      <div className="flex-1 flex flex-col justify-center items-center bg-black text-white p-10">
        <Button
          onClick={() => window.location.href = "/login"}
          className="bg-white text-black py-3 px-10 text-lg border-2 border-white mb-5 cursor-pointer transition-all duration-300 rounded-lg"
        >
          Login
        </Button>
        <Button
          onClick={() => window.location.href = "/docs"}
          className="bg-white text-black py-3 px-10 text-lg border-2 border-white mb-5 cursor-pointer transition-all duration-300 rounded-lg"
        >
          Docs
        </Button>
        <Button
          onClick={() => window.location.href = "/contact"}
          className="bg-white text-black py-3 px-10 text-lg border-2 border-white cursor-pointer transition-all duration-300 rounded-lg"
        >
          Contact us
        </Button>
      </div>
    </div>
  );
}
