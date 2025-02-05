"use client";
import Sidebar from "@/components/Sidebar"; // Header 임포트
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, MessageSquare, Save, Edit2, Trash2,
  FileText, Plus
} from 'lucide-react';

const MVPRequirementSession = () => {
  // 요구사항 관리 상태
  const [requirements, setRequirements] = useState([]);
  
  // 대화 메시지 상태
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'system',
      content: '새로운 요구사항 분석을 시작합니다. 프로젝트의 목표와 필요한 기능들을 분석하겠습니다.'
    }
  ]);

  const [messageInput, setMessageInput] = useState('');

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      role: 'user',
      content: messageInput
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const suggestion = {
        id: requirements.length + 1,
        title: '프로젝트 생성 및 관리',
        description: '사용자가 새로운 프로젝트를 생성하고 관리할 수 있는 기능',
        category: '기능적',
        priority: 'high',
        status: 'draft',
        useCases: [
          '사용자는 새 프로젝트를 생성할 수 있다',
          '프로젝트의 기본 정보를 설정할 수 있다',
          '프로젝트 목록을 조회할 수 있다'
        ],
        constraints: [
          '프로젝트 이름은 중복될 수 없다',
          '프로젝트 설명은 최대 1000자까지 입력 가능'
        ]
      };

      const aiResponse = {
        id: messages.length + 2,
        role: 'assistant',
        content: '요구사항을 다음과 같이 정리했습니다.',
        suggestion
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <div className="w-64 bg-gray-900 text-white"><Sidebar /></div>
      {/* Left Panel - Chat Interface */}
      <div className="w-1/2 flex flex-col border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="font-medium">새 요구사항 분석</h2>
          <p className="text-sm text-gray-500">LLM과 대화하며 요구사항을 도출합니다.</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col h-[700px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg' 
                    : message.role === 'system'
                    ? 'bg-gray-100 text-gray-600 rounded-lg'
                    : 'bg-white border rounded-r-lg rounded-tl-lg'
                } p-4 shadow-sm`}>
                  <p className="text-sm mb-1">{message.content}</p>
                  {message.suggestion && (
                    <Card className="mt-3 bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <h3 className="font-medium">{message.suggestion.title}</h3>
                          </div>
                          <button 
                            onClick={() => setRequirements([...requirements, message.suggestion])}
                            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            저장
                          </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                          {message.suggestion.description}
                        </p>

                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-2">사용 사례:</div>
                            <div className="space-y-1">
                              {message.suggestion.useCases.map((useCase, idx) => (
                                <div key={idx} className="text-sm bg-white p-2 rounded">
                                  {useCase}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-2">제약사항:</div>
                            <div className="space-y-1">
                              {message.suggestion.constraints.map((constraint, idx) => (
                                <div key={idx} className="text-sm bg-white p-2 rounded">
                                  {constraint}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="요구사항에 대해 설명해주세요..."
                className="flex-1 px-4 py-2 border rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Requirements List */}
      <div className="w-1/2 flex flex-col bg-gray-50">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">요구사항 목록</h2>
              <p className="text-sm text-gray-500">총 {requirements.length}개의 요구사항</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {requirements.map((req) => (
              <Card key={req.id} className="hover:border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge>{req.category}</Badge>
                      <Badge className={
                        req.priority === 'high' ? 'bg-red-100 text-red-700' :
                        req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {req.priority}
                      </Badge>
                      <Badge variant="outline">{req.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded">
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => setRequirements(requirements.filter(r => r.id !== req.id))}
                        className="p-1.5 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-medium mb-2">{req.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{req.description}</p>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">사용 사례:</div>
                      <div className="space-y-1">
                        {req.useCases.map((useCase, idx) => (
                          <div key={idx} className="text-sm bg-white p-2 rounded border">
                            {useCase}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">제약사항:</div>
                      <div className="space-y-1">
                        {req.constraints.map((constraint, idx) => (
                          <div key={idx} className="text-sm bg-white p-2 rounded border">
                            {constraint}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPRequirementSession;