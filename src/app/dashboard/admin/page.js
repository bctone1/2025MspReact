"use client";
import Sidebar from "@/components/Sidebar"; // Header 임포트
import React from "react";
import { Bar, BarChart } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
// import { useEffect } from "react";
// import { useSession } from "next-auth/react"; 


 
const chartData = [
  { month: "January", desktop: 186, mobile: 80,desktop2:50, mobile2:70},
  { month: "February", desktop: 305, mobile: 200, desktop2:60, mobile2:17},
  { month: "March", desktop: 237, mobile: 120, desktop2:100, mobile2:15},
  { month: "April", desktop: 73, mobile: 190, desktop2:60, mobile2:56},
  { month: "May", desktop: 209, mobile: 130, desktop2:10, mobile2:16},
  { month: "June", desktop: 214, mobile: 140, desktop2:300, mobile2:12},
]
 
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
  desktop2: {
    label: "Desktop2",
    color: "#932626",
  },
  mobile2: {
    label: "Mobile2",
    color: "#ad7a7a",
  },
};





export default function Dashboard (){
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white"><Sidebar /></div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>

        {/* System Alert */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-800">
            <strong>⚠️ 시스템 알림:</strong> 비용 사용량이 예산의 80%에 도달했습니다. 비용 절약을 고려해주세요.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">시스템 현황</h2>
            <p className="text-4xl font-bold text-green-600">98.5%</p>
            <ul className="mt-4 text-gray-600">
              <li>API 서버: <span className="text-green-500">정상</span></li>
              <li>DB 서버: <span className="text-green-500">정상</span></li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">사용량 통계</h2>
            <p className="text-4xl font-bold">125,430</p>
            <ul className="mt-4 text-gray-600">
              <li>성공률: <span className="text-green-500">99.2%</span></li>
              <li>평균 응답시간: <span className="text-gray-800">234ms</span></li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">비용 현황</h2>
            <p className="text-4xl font-bold text-red-600">₩4,567,890</p>
            <ul className="mt-4 text-gray-600">
              <li>예산 대비: <span className="text-red-500">80%</span></li>
              <li>전월 대비: <span className="text-red-500">+12%</span></li>
            </ul>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">시간대별 API 사용량</h3>
            <div className="w-full h-64 bg-gray-200 rounded-md">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={chartData} width={500} height={300}>
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">월별 비용 추이</h3>
            <div className="w-full h-64 bg-gray-200 rounded-md">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={chartData} width={500} height={300}>
                  <Bar dataKey="desktop2" fill="var(--color-desktop2)" radius={4} />
                  <Bar dataKey="mobile2" fill="var(--color-mobile2)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>  
        </div>

      </div>
    </div>
  );
};

// export default Dashboard;
