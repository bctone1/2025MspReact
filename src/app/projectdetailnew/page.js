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

const ProjectDetailDashboard = () => {
  const [selectedPhase, setSelectedPhase] = useState('setup');
  const [showNewChangeDialog, setShowNewChangeDialog] = useState(false);

  // 프로젝트 정보
  const project = {
    name: "LLM MSP 시스템 개발",
    description: "다중 LLM 통합 관리 시스템",
    status: "active",
    startDate: "2024-03-20",
    endDate: "2024-06-20"
  };

  // 주요 단계 정보
  const phases = [
    {
      id: 'setup',
      title: '1. 초기 설정',
      items: [
        {
          id: 'project-setup',
          title: '프로젝트 생성',
          status: 'completed',
          // progress: 100,
          // component: 'new-project-dialog.tsx'
        },
        {
          id: 'team-setup',
          title: '팀 구성',
          status: 'completed',
          // progress: 100,
          // component: 'team-management.tsx'
        },
        {
          id: 'llm-setup',
          title: 'LLM 선택 및 설정',
          status: 'completed',
          // progress: 100,
          // component: 'llm-settings.tsx'
        }
      ]
    },
    {
      id: 'design',
      title: '2. 분석/설계',
      items: [
        {
          id: 'requirements',
          title: '요구사항 분석',
          status: 'in_progress',
          // progress: 65,
          // component: 'mvp-requirements-session.tsx'
        },
        {
          id: 'architecture',
          title: '시스템 설계',
          status: 'in_progress',
          // progress: 40,
          // component: 'enhanced-design-document-manager.tsx'
        },
        {
          id: 'database',
          title: 'DB 스키마 설계',
          status: 'in_progress',
          // progress: 30,
          // component: 'schema-designer.tsx'
        },
        {
          id: 'api',
          title: 'API 스펙 정의',
          status: 'pending',
          // progress: 0,
          // component: 'api-spec-manager.tsx'
        },
        {
          id: 'guide',
          title: '구현 가이드 작성',
          status: 'pending',
          // progress: 0,
          // component: 'implementation-guide-manager.tsx'
        }
      ]
    },
    {
      id: 'cording',
      title: '3. 코드생성',
      items: [
        {
          id: 'requirements',
          title: '헤더 생성',
          status: 'in_progress',
          // progress: 65,
          // component: 'mvp-requirements-session.tsx'
        },
      ]
    },
    {
      id: 'management',
      title: '3. 프로젝트 관리',
      items: [
        {
          id: 'sessions',
          title: '세션 관리',
          description: 'LLM 대화 세션 기록 및 관리',
          status: 'in_progress',
          // progress: 45,
          // component: 'session-archive.tsx',
          // stats: {
          //   total: 85,
          //   active: 12,
          //   archived: 73
          // }
        },
        {
          id: 'knowledge',
          title: '지식 관리',
          description: '설계 문서 및 의사결정 사항 관리',
          status: 'in_progress',
          // progress: 40,
          // component: 'knowledge-base-manager.tsx',
          // stats: {
          //   documents: 34,
          //   decisions: 28
          // }
        },
        {
          id: 'changes',
          title: '변경 사항 추적 관리',
          description: '변경 요청 및 이력 관리',
          status: 'in_progress',
          // progress: 35,
          // component: 'mvp-enhanced-change-tracker.tsx',
          // stats: {
          //   total: 19,
          //   pending: 6,
          //   approved: 13
          // }
        }
      ]
    }
  ];

  // 변경 사항 목록
  const changes = [
    {
      id: 1,
      phase: '요구사항',
      title: '사용자 인증 방식 변경',
      description: 'OAuth2.0 기반 인증 시스템으로 변경',
      status: 'pending',
      date: '2024-03-28'
    },
    {
      id: 2,
      phase: 'DB 스키마',
      title: '사용자 테이블 수정',
      description: 'last_login 필드 추가',
      status: 'approved',
      date: '2024-03-27'
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
            <Badge className="bg-green-100 text-green-700">진행중</Badge>
          </div>

          <div className="text-sm text-gray-500">
            {project.startDate} - {project.endDate}
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
                {selectedPhase === 'management' && (
                  <button
                    onClick={() => setShowNewChangeDialog(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    변경 사항 등록
                  </button>
                )}
              </div>

              {/* Phase Items */}
              {phases
                .find(p => p.id === selectedPhase)
                ?.items.map(item => (
                  <Card key={item.id} className="hover:border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.title}</h3>
                          <Badge className={
                            item.status === 'completed' ? 'bg-green-100 text-green-700' :
                              item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                          }>
                            {item.status === 'completed' ? '완료' :
                              item.status === 'in_progress' ? '진행중' : '예정'}
                          </Badge>
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                      )}

                      {item.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">진행률</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      )}

                      {item.stats && (
                        <div className="pt-3 border-t mb-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {item.id === 'sessions' && (
                              <>
                                <div className="text-gray-500">전체 세션: {item.stats.total}개</div>
                                <div className="text-gray-500">활성 세션: {item.stats.active}개</div>
                              </>
                            )}
                            {item.id === 'knowledge' && (
                              <>
                                <div className="text-gray-500">문서: {item.stats.documents}개</div>
                                <div className="text-gray-500">의사결정: {item.stats.decisions}개</div>
                              </>
                            )}
                            {item.id === 'changes' && (
                              <>
                                <div className="text-gray-500">전체: {item.stats.total}개</div>
                                <div className="text-gray-500">대기중: {item.stats.pending}개</div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {item.component && (
                        <div className="mt-3 pt-3 border-t">
                          <button className="w-full text-left text-sm text-blue-500 hover:text-blue-600 flex items-center gap-2">
                            이동: {item.component}
                            <span className="text-gray-400 text-xs">(클릭하여 이동)</span>
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              }

              {/* Change List */}
              {selectedPhase === 'management' && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold">변경 사항 목록</h3>
                  {changes.map((change) => (
                    <Card key={change.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{change.title}</h4>
                            <Badge variant="outline">{change.phase}</Badge>
                          </div>
                          <Badge className={
                            change.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }>
                            {change.status === 'approved' ? '승인됨' : '대기중'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{change.description}</p>
                        <div className="text-sm text-gray-500">{change.date}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Right Summary */}
            <div className="space-y-6">
              {/* Overall Progress */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">전체 진행 현황</h3>
                  <div className="space-y-4">
                    {phases.map(phase => {
                      const completedItems = phase.items.filter(item => item.status === 'completed').length;
                      const progress = Math.round((completedItems / phase.items.length) * 100);

                      return (
                        <div key={phase.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">{phase.title}</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

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

        {/* New Change Dialog */}
        <Dialog open={showNewChangeDialog} onOpenChange={setShowNewChangeDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>새 변경 사항 등록</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">제목</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="변경 사항 제목"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">설명</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg h-24"
                  placeholder="변경 사항에 대해 설명해주세요"
                />
              </div>
            </div>
            <DialogFooter>
              <button
                onClick={() => setShowNewChangeDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                등록
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

  );
};

export default ProjectDetailDashboard;