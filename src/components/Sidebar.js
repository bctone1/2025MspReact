"use client";

import React, { useEffect } from "react";
import {
  HomeIcon,
  UsersIcon,
  CogIcon,
  ClipboardIcon,
  ServerIcon,
  BriefcaseIcon,
  DocumentIcon
} from "@heroicons/react/24/outline";
import { useSession, signOut, signIn } from "next-auth/react";  // signIn 함수 추가 임포트

export default function Sidebar() {
  const { data: session } = useSession();

  // useEffect(() => {
  //   if (session) {
  //     console.log(session.user)
  //   } else {
  //     console.log("No session found");
  //   }
  // }, [session]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });  // 로그아웃 후 리디렉션할 URL 설정
  };

  // 로그인 핸들러
  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col fixed">
      {/* 로고 영역 */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold">Meta MSP PRJ</h1>
      </div>

      {/* 메뉴 리스트 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a
              href="/dashboard/user"
              className="flex items-center p-2 rounded-lg hover:bg-gray-800"
            >
              <HomeIcon className="h-6 w-6 mr-2" />
              <span>대시보드</span>
            </a>
          </li>
          <li>
            <a
              href="/project/user"
              className="flex items-center p-2 rounded-lg hover:bg-gray-800"
            >
              <BriefcaseIcon className="h-6 w-6 mr-2" />
              <span>프로젝트 관리</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 rounded-lg hover:bg-gray-800"
            >
              <DocumentIcon className="h-6 w-6 mr-2" />
              <span>기록</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 rounded-lg hover:bg-gray-800"
            >
              <UsersIcon className="h-6 w-6 mr-2" />
              <span>사용자/조직 관리</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 rounded-lg hover:bg-gray-800"
            >
              <CogIcon className="h-6 w-6 mr-2" />
              <span>시스템 설정</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* 하단 관리자 정보 및 로그인/로그아웃 버튼 */}
      <div className="border-t border-gray-700 p-4">
        {/* 세션 정보가 있으면 해당 정보 출력 */}
        {session ? (
          <>
            <p className="text-sm">{session.user.name || "이름 없음"}</p> {/* 이름 출력 */}
            <p className="text-sm">{session.user.email || "이메일 없음"}</p> {/* 이메일 출력 */}
            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <p className="text-sm">로그인된 사용자 없음</p>
            {/* 로그인 버튼 */}
            <button
              onClick={handleLogin}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              로그인
            </button>
          </>
        )}
      </div>
    </div>
  );
};
