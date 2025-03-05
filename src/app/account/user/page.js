"use client";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const AccountSession = () => {
  const [user, setUser] = useState({
    id: "user123",
    name: "홍길동",
    email: "user@example.com",
    password: "12345",
    role: "user", // "admin"일 경우 관리자 요청 버튼 X
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(formData);
    setEditMode(false);
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* 사이드바 */}
      <Sidebar />

      {/* 계정 정보 섹션 */}
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">계정 정보</h2>

          {/* ID 필드 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">ID</label>
            <p className="text-gray-800">{user.id}</p>
          </div>

          {/* 이름 필드 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">이름</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="text-gray-800">{user.name}</p>
            )}
          </div>

          {/* 이메일 필드 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">이메일</label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="text-gray-800">{user.email}</p>
            )}
          </div>

          {/* 비밀번호 필드 */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호</label>
            {editMode ? (
              <input
                // type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <div className="flex items-center">
                <p className="text-gray-800 mr-2">{showPassword ? user.password : "*****"}</p>
                <button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 역할 필드 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">역할</label>
            <p className="text-gray-800">{user.role}</p>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-between items-center">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  저장
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
              >
                수정
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSession;
