"use client";

import axios from 'axios';
import Sidebar from "@/components/Sidebar"; // Header 임포트
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Project = () => {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.email) {
      fetchProjects(session.user.email);
    }
  }, [session, status]); // session과 status가 변경될 때 실행

  const fetchProjects = async (email) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projectsList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    // console.log(response);
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      setProjects(data);
    } else {
      console.log(data);
      // alert("오류발생");
    }
  };


  // 상태 관리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const projectsPerPage = 4; // 한 페이지에 표시할 프로젝트 개수

  // 검색 필터링된 프로젝트
  const filteredProjects = projects.filter((project) =>
    project['project_name'].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션 계산
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-6">프로젝트</h1>

          {/* 프로젝트 생성 버튼 */}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => {
              window.location.href = "/createproject"
              // setShowModal(true);
              // setCurrentStep(1);
            }}>
            프로젝트 생성
          </button>

        </div>



        {/* Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">전체 프로젝트</h2>
            <p className="text-2xl font-bold">{projects.length}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">진행 중</h2>
            <p className="text-2xl font-bold">
              {projects.filter((project) => project.status === "진행 중").length}
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">완료</h2>
            <p className="text-2xl font-bold">
              {projects.filter((project) => project.status === "완료").length}
            </p>
          </div>
          {/* <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">팀 규모</h2>
            <p className="text-2xl font-bold">
              {projects.reduce((total, project) => total + project.teamSize, 0)}
            </p>
          </div> */}
        </div>

        {/* 검색창 */}
        <div className="mb-6 flex">
          <input
            type="text"
            placeholder="프로젝트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Project List */}
        <div className="grid grid-cols-2 gap-6">
          {currentProjects.map((project, index) => (
            <div key={index} className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-xl font-bold">{project['project_name']}</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
              <div className="mt-4">
                {/* <p>
                  <span className="font-semibold">진행률:</span> {project.progress}%
                </p> */}
                <p>
                  <span className="font-semibold">시작일:</span> {project['start_date']}
                </p>
                {/* <p>
                  <span className="font-semibold">종료일:</span> {project['end_date']}
                </p> */}
                <p>
                  <span className="font-semibold">팀원:</span> {project['num_of_member_']}명
                </p>
                <p>
                  <span className="font-semibold">도구:</span> {project['requirements']}
                </p>
                <p>
                  <span className="font-semibold">LLM:</span> {String(project['model_setting']).replace(/[{}]/g, '')}
                </p>

              </div>
              <button onClick={() => window.location.href = '/projectdetailnew?project_id=' + project['project_id'] + '&user_email=' + session.user.email} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                자세히 보기
              </button>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-6 flex justify-center items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-lg ${page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              {page}
            </button>
          ))}
        </div>

      </div>
    </div>



  );
};

export default Project;
