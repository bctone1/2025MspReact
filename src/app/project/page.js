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
    const response = await fetch("http://localhost:5000/projectsList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
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

  const [showModal, setShowModal] = useState(false); // 모달 상태 관리
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    team: "",
    llmSettings: "",
  });

  // 폼 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 단계 전환 핸들러
  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // 폼 제출 핸들러
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const response = await fetch("http://localhost:5000/makeproject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      setShowModal(false);
      alert(data.message);
      window.location.href = "/require"
    } else {
      alert(data.message);
    }
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


        {/* 모달 창 */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
              {/* 상단 오른쪽 X 버튼 */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                ✖
              </button>

              <h2 className="text-xl font-bold mb-4">새 프로젝트 설정</h2>

              {/* 단계별 UI */}
              {currentStep === 1 && (
                <div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">프로젝트 이름</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">설명</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">시작일</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">예상 종료일</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">팀 구성</label>
                    <input
                      type="text"
                      name="team"
                      value={formData.team}
                      onChange={handleInputChange}
                      placeholder="예: 5명"
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">LLM 설정</label>
                    <select
                      name="llmSettings"
                      value={formData.llmSettings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    >
                      <option value="" disabled>
                        선택해주세요
                      </option>
                      <option value="Claude">Claude</option>
                      <option value="OpenAI">OpenAI</option>
                    </select>

                  </div>
                </div>
              )}

              {/* 버튼 */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => {
                    if (currentStep === 1) setShowModal(false);
                    else handlePreviousStep();
                  }}
                >
                  {currentStep === 1 ? "취소" : "이전"}
                </button>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleNextStep}
                  >
                    다음
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleFormSubmit}
                  >
                    생성
                  </button>
                )}
              </div>
            </div>
          </div>
        )}





      </div>
    </div>



  );
};

export default Project;
