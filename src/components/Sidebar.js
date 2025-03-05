"use client";

import React, { useEffect } from "react";
import {
  HomeIcon,
  UsersIcon,
  CogIcon,
  ClipboardIcon,
  ServerIcon,
  BriefcaseIcon,
  DocumentIcon,
  ChartBarIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* 로고 영역 */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold">Meta MSP PRJ</h1>
      </div>

      {/* 메뉴 리스트 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {/* 일반 사용자 메뉴 */}
          {session?.user?.role !== "admin" && (
            <>
              <li>
                <a href="/dashboard/user" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <HomeIcon className="h-6 w-6 mr-2" />
                  <span>대시보드</span>
                </a>
              </li>
              <li>
                <a href="/project" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <BriefcaseIcon className="h-6 w-6 mr-2" />
                  <span>프로젝트 관리</span>
                </a>
              </li>
              <li>
                <a href="/account/user" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <CogIcon className="h-6 w-6 mr-2" />
                  <span>계정 관리</span>
                </a>
              </li>
              <li>
                <a href="/conversation" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <PaperAirplaneIcon className="h-6 w-6 mr-2" />
                  <span>대화 시작하기</span>
                </a>
              </li>
            </>
          )}

          {/* 관리자 메뉴 */}
          {session?.user?.role === "admin" && (
            <>
              <li>
                <a href="/dashboard/admin" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <HomeIcon className="h-6 w-6 mr-2" />
                  <span>대시보드</span>
                </a>
              </li>
              <li>
                <a href="/model_setting" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <CogIcon className="h-6 w-6 mr-2" />
                  <span>언어모델 관리</span>
                </a>
              </li>
              <li>
                <a href="/account/admin" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <UsersIcon className="h-6 w-6 mr-2" />
                  <span>사용자/조직 관리</span>
                </a>
              </li>
              <li>
                <a href="/const" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <ChartBarIcon className="h-6 w-6 mr-2" />
                  <span>비용 통계</span>
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* 하단 로그인/로그아웃 영역 */}
      <div className="border-t border-gray-700 p-4">
        {session ? (
          <>
            <p className="text-sm">{session.user.name || "이름 없음"}</p>
            <p className="text-sm">{session.user.email || "이메일 없음"}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <p className="text-sm">로그인된 사용자 없음</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              로그인
            </button>
          </>
        )}
      </div>
    </div>
  );
}
