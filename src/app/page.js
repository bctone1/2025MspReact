"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/Carousel";

export default function LandingPage() {

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* 슬라이드 섹션 */}
      <div className="flex-1 flex justify-center items-center bg-white text-black p-5 flex-col text-center">
        <h1 className="text-4xl font-extrabold mb-5 text-black">BCTONE</h1>
        
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
