"use client";
import Sidebar from "@/components/Sidebar"; // Header 임포트
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSearchParams } from 'next/navigation';

import axios from 'axios';
import { useEffect } from 'react';


const ProjectDetailDashboard = () => {

  const [selectedPhase, setSelectedPhase] = useState('setup');
  const [showNewChangeDialog, setShowNewChangeDialog] = useState(false);
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  const email = searchParams.get("user_email");
  // alert(project_id);

  // 프로젝트 정보
  const [project, setproject] = useState({
    name: '',
    description: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const handleprojects = async () => {
    const response = await fetch("http://localhost:5000/projectsList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_id: project_id, email: email }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data[0]);
      const newdata = data[0]
      setproject((prevProject) => ({
        ...prevProject,
        name: newdata['project_name'],
        description: newdata['description'],
        status: 'completed',
        startDate: newdata['start_date'],
        endDate: newdata['end_date'],
      }));
    } else {
      alert(data.message);
    }

  };
  useEffect(() => {
    handleprojects();
  }, []);



  // 주요 단계 정보
  const phases = [
    {
      id: 'setup',
      title: '초기 설정',
      items: [
        {
          id: 'project-setup',
          title: '프로젝트 정보',
          status: 'completed',
          location: '/projectInfo?project_id=' + project_id
        },
        {
          id: 'team-setup',
          title: '팀 구성',
          status: 'completed',
          location: '/projectTeam?project_id=' + project_id
        },
        {
          id: 'llm-setup',
          title: 'LLM 선택 및 설정',
          status: 'completed',
          location: '/projectLLM?project_id=' + project_id
        }
      ]
    },
    {
      id: 'design',
      title: '분석/설계',
      items: [
        {
          id: 'requirements',
          title: '요구사항 분석',
          status: 'in_progress',
          location: '/requirements?project_id=' + project_id
        },
        {
          id: 'architecture',
          title: '시스템 설계',
          status: 'in_progress',
          location: '/systemSetting?project_id=' + project_id
        },
        {
          id: 'database',
          title: 'DB 스키마 설계',
          status: 'in_progress',
          location: '/database?project_id=' + project_id
        },
        {
          id: 'apisetting',
          title: 'API 설계',
          status: 'in_progress',
          location: '/apisetting?project_id=' + project_id
        },

      ]
    },
    {
      id: 'cording',
      title: '대화기록',
      items: [

      ]
    }
  ];



  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-64 bg-gray-900 text-white"><Sidebar /></div>
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-semibold">{project.name}</h1>
              <p className="text-sm text-gray-500">{project.description}</p>
            </div>

          </div>

          <div className="text-sm text-gray-500">
            {project.startDate} ~ {project.endDate}
          </div>

          {/* Phase Navigation */}
          <div className="flex gap-4 mt-6">
            {phases.map(phase => (
              <button
                key={phase.id}
                className={`px-4 py-2 rounded-lg ${selectedPhase === phase.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
                onClick={() => setSelectedPhase(phase.id)}
              >
                {phase.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Content */}
            <div className="col-span-2 space-y-4">

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {phases.find(p => p.id === selectedPhase)?.title}
                </h2>
              </div>

              {/* Phase Items */}
              {phases
                .find(p => p.id === selectedPhase)
                ?.items.map(item => (
                  <Card key={item.id} className="hover:border-blue-200">
                    <CardContent className="p-4" onClick={() => window.location.href = item.location}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.title}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>

            {/* Right Summary */}
            <div className="space-y-6">

              {/* Phase Summary */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">단계별 현황</h3>
                  <div className="space-y-2 text-sm">
                    {phases.map(phase => {
                      const totalItems = phase.items.length;
                      const completedItems = phase.items.filter(item => item.status === 'completed').length;
                      const inProgressItems = phase.items.filter(item => item.status === 'in_progress').length;

                      return (
                        <div key={phase.id} className="pb-2 border-b last:border-0">
                          <div className="font-medium mb-1">{phase.title}</div>
                          <div className="text-gray-500">
                            전체: {totalItems}개 / 완료: {completedItems}개 / 진행중: {inProgressItems}개
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default ProjectDetailDashboard;