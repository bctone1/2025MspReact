"use client";
import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect  } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageSquare, Save, Edit2, Trash2, FileText, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";



const AccountSession = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((user) => user['name'].includes(search) || user['email'].includes(search));

  

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/getmembers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUsers(data);
      } else {
        console.error("사용자 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("서버와의 통신에 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  

  // 수정 버튼 클릭 시 실행 (모달 열기)
  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  // 수정된 데이터 저장
  const handleSave = () => {
    setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
    setSelectedUser(null);
  };

  // 삭제 버튼 클릭 시 실행
  const handleDelete = (userId) => {
    setUsers(users.filter((user) => user['id'] !== userId));
  };

  return (
    <div className="h-screen flex">
      {/* 사이드바 */}
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">회원 관리</h1>

        {/* 검색 입력창 */}
        <input
          type="text"
          placeholder="회원 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* 회원 목록 테이블 */}
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">이름</th>
                <th className="p-2">이메일</th>
                <th className="p-2">소속</th>
                <th className="p-2">역할</th>
                <th className="p-2">상태</th>
                <th className="p-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user['id']} className="border-b">
                  <td className="p-2">{user['name']}</td>
                  <td className="p-2">{user['email']}</td>
                  <td className="p-2">{user['group']}</td>
                  <td className="p-2">
                    <Badge className="bg-blue-500 text-white">{user['role']}</Badge>
                  </td>
                  <td className="p-2">
                    <Badge className={user['status'] === "승인" ? "bg-green-500" : "bg-red-500"}>
                      {user['status']}
                    </Badge>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="p-2 bg-yellow-500 text-white rounded"
                      onClick={() => handleEditClick(user)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(user['id'])}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 수정 모달 */}
        {selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">회원 수정</h2>

              <label className="block mb-2">이름</label>
              <input
                type="text"
                name="name"
                value={selectedUser['name']}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
              />

              <label className="block mb-2">이메일</label>
              <input
                type="text"
                name="email"
                value={selectedUser['email']}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
              />

              <label className="block mb-2">소속</label>
              <input
                type="text"
                name="email"
                value={selectedUser['group']}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
              />

              <label className="block mb-2">역할</label>
              <select
                name="role"
                value={selectedUser['role']}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="admin">관리자</option>
                <option value="user">일반 사용자</option>
              </select>

              <label className="block mb-2">상태</label>
              <select
                name="status"
                value={selectedUser['status']}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="승인">승인</option>
                <option value="대기">대기</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => setSelectedUser(null)}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleSave}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSession;
