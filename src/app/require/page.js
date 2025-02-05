"use client";
import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Save,
  Plus,
  Bot,
  FileText,
  Tag,
  Clock,
  Settings,
  Filter,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  Edit,
  Trash,
  ArrowRight,
  Archive
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import Sidebar from "@/components/Sidebar"; // Header 임포트

const RequirementSession = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'system',
      content: '새로운 요구사항 분석 세션이 시작되었습니다. 프로젝트의 요구사항을 분석하고 정리하겠습니다.',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      role: 'assistant',
      content: '안녕하세요! LLM MSP 프로젝트의 요구사항 분석을 도와드리겠습니다. 어떤 부분부터 시작하면 좋을까요?',
      timestamp: new Date().toISOString()
    }
  ]);

  const [requirements, setRequirements] = useState([
    {
      id: 1,
      category: '기능적',
      title: '사용자 인증 시스템',
      description: 'OAuth2.0 기반의 사용자 인증 시스템 구현',
      priority: 'high',
      status: 'in_progress',
      tags: ['보안', '인증'],
      source: 'message_id_1'
    },
    {
      id: 2,
      category: '비기능적',
      title: '시스템 응답시간',
      description: '모든 API 응답은 500ms 이내 처리',
      priority: 'medium',
      status: 'draft',
      tags: ['성능', 'SLA'],
      source: 'message_id_2'
    }
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString()
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // console.log(newMessage);

    try {
        const response = await fetch("http://localhost:5000/clauderequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });

        const data = await response.json();

        if (response.ok) {
            const newLLMMessage = {
                id: messages.length + 2,
                role: 'assistant',
                content: data.message,
                timestamp: new Date().toISOString()
              };
              setMessages((prevMessages) => [...prevMessages, newLLMMessage]);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("문제가 발생했습니다.");
      }
    
    // 여기에 실제 LLM API 호출 및 응답 처리 로직이 들어갈 것입니다

    

    setMessageInput('');
  };

  return (
    <div className="h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white">
            <Sidebar />
        </div>

      {/* Left Panel - Chat Interface */}
      <div className="w-1/2 flex flex-col border-r bg-white">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">요구사항 분석 세션</h1>
              <p className="text-sm text-gray-500">LLM MSP 프로젝트</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Archive className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
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
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'assistant' && (
                    <Bot className="w-4 h-4" />
                  )}
                  {message.role === 'system' && (
                    <Info className="w-4 h-4" />
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              전송
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Requirements Management */}
      <div className="w-1/2 flex flex-col bg-gray-50">
        {/* Requirements Header */}
        <div className="px-6 py-4 bg-white border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">요구사항 목록</h2>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              새 요구사항
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button 
              className={`px-3 py-1.5 rounded-lg text-sm ${
                activeCategory === 'all' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('all')}
            >
              전체
            </button>
            <button 
              className={`px-3 py-1.5 rounded-lg text-sm ${
                activeCategory === 'functional' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('functional')}
            >
              기능적
            </button>
            <button 
              className={`px-3 py-1.5 rounded-lg text-sm ${
                activeCategory === 'non_functional' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('non_functional')}
            >
              비기능적
            </button>
          </div>
        </div>

        {/* Requirements List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {requirements.map((req) => (
              <Card key={req.id} className="hover:border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{req.category}</Badge>
                      <Badge 
                        className={
                          req.priority === 'high' 
                            ? 'bg-red-100 text-red-700'
                            : req.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }
                      >
                        {req.priority === 'high' ? '높음' : 
                         req.priority === 'medium' ? '중간' : '낮음'}
                      </Badge>
                      {req.status === 'in_progress' && (
                        <Badge className="bg-blue-100 text-blue-700">진행중</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-red-100 rounded">
                        <Trash className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-medium mb-2">{req.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{req.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {req.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      대화에서 추출됨
                    </div>
                    <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                      원본 보기
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 bg-white border-t">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>총 {requirements.length}개의 요구사항</span>
            <button className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
              요구사항 문서 생성
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementSession;
