"use client";
import Sidebar from "@/components/Sidebar"; // Header 임포트
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Users,
  Code,
  ArrowRight,
  Check,
  FileText,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useSession } from "next-auth/react";

const MVPProjectCreation = () => {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "프로젝트에 대해 설명해주세요. 프로젝트의 목적, 주요 기능, 대상 사용자 등을 자유롭게 말씀해주시면 도와드리겠습니다."
    }
  ]);

  const [projectInfo, setProjectInfo] = useState({
    name: "",
    description: "",
    purpose: "",
    language: "",
    framework: "",
    team: [],
    llm: [],
    useremail: ""
  });



  const techStacks = {
    JavaScript: ["React", "Vue.js", "Next.js"],
    Python: ["Django", "FastAPI", "Flask"],
    TypeScript: ["Next.js", "NestJS", "Express"],
    Java: ["Spring Boot", "Spring MVC"]
  };

  // const availableMembers = [
  //   { id: 1, name: "김영희", role: "프로젝트 매니저", skills: ["기획", "관리"] },
  //   { id: 2, name: "이철수", role: "시니어 개발자", skills: ["백엔드", "DevOps"] },
  //   { id: 3, name: "박지민", role: "개발자", skills: ["프론트엔드", "UI/UX"] },
  //   { id: 4, name: "정민수", role: "데이터 엔지니어", skills: ["AI/ML", "데이터"] }
  // ];

  

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

  const availableLLMs = [
    {
      id: "gpt4",
      name: "GPT-4",
      type: "상용",
      provider: "OpenAI",
      description: "가장 강력한 성능의 범용 LLM"
    },
    {
      id: "claude",
      name: "Claude",
      type: "상용",
      provider: "Anthropic",
      description: "긴 컨텍스트 처리에 최적화"
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      type: "자체호스팅",
      provider: "Local",
      description: "코드 생성에 특화된 오픈소스 모델"
    },
    {
      id: "llama",
      name: "Llama2",
      type: "자체호스팅",
      provider: "Local",
      description: "자체 서버에서 운영 가능한 고성능 모델"
    }
  ];

  const steps = [
    { id: 1, title: "기본 정보" },
    { id: 2, title: "기술 스택" },
    { id: 3, title: "팀 구성" },
    { id: 4, title: "LLM 선택" },
    { id: 5, title: "확인" }
  ];

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };
  const newproject = async () => {
    console.log(projectInfo);

    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 19).replace(/[-:T]/g, '');
    const indexName = `msp${formattedDateTime}`;

    const response = await fetch("http://localhost:5000/createproject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectInfo: projectInfo, useremail: session.user.email }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      window.location.href = "/projectdetailnew"
    } else {
      alert("프로젝트 생성 실패");
      console.error("프로젝트 생성 실패:", response.statusText);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };


  const handleSendMessage = async () => {
    // alert(messageInput);
    const response = await fetch("http://localhost:5000/setproject",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageInput),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data);

      // const aiResponse = {
      //   id: messages.length + 2,
      //   role: "assistant",
      //   content: "프로젝트 내용을 분석했습니다. 다음과 같이 정리해보았습니다:",
      //   suggestion: {
      //     name: data.projectname,
      //     description: data.description,
      //     purpose: data.purpose
      //   }
      // };
      // setMessages(prev => [...prev, aiResponse]);
      // alert(data.message);
    } else {
      alert(data.message);
    }



    if (!messageInput.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      role: "user",
      content: messageInput
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: "프로젝트 내용을 분석했습니다. 다음과 같이 정리해보았습니다:",
        suggestion: {
          name: data.projectname,
          description: data.description,
          purpose: data.purpose
        }
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleTeamMemberToggle = (member) => {
    setProjectInfo(prev => {
      const isSelected = prev.team.some(m => m.id === member.id);
      const newTeam = isSelected
        ? prev.team.filter(m => m.id !== member.id)
        : [...prev.team, member];
      return { ...prev, team: newTeam };
    });
  };

  const [availableMembers, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const filteredUsers = availableMembers.filter((user) => user['name'].includes(search) || user['email'].includes(search));
  

  const renderBasicInfo = () => (
    <div className="grid grid-cols-2 gap-6 h-[600px]">

      <div className="flex flex-col border rounded-lg max-h-[650px]">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <span className="font-medium">AI 어시스턴트</span>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}>
                <p className="mb-1">{message.content}</p>
                {message.suggestion && (
                  <div className="mt-3 space-y-2">
                    <div
                      className="bg-white text-gray-800 p-3 rounded cursor-pointer hover:bg-blue-50"
                      onClick={() => setProjectInfo({
                        ...projectInfo,
                        ...message.suggestion
                      })}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">AI 제안 내용</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">프로젝트명:</span> {message.suggestion.name}</p>
                        <p><span className="font-medium">설명:</span> {message.suggestion.description}</p>
                        <p><span className="font-medium">목적:</span> {message.suggestion.purpose}</p>
                      </div>
                      <button className="mt-2 text-blue-500 text-sm hover:text-blue-600">
                        이 내용으로 적용하기
                      </button>
                    </div>
                  </div>
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
              placeholder="프로젝트에 대해 설명해주세요..."
              className="flex-1 px-4 py-2 border rounded-lg"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">프로젝트명</label>
          <input
            type="text"
            value={projectInfo.name}
            onChange={(e) => setProjectInfo({ ...projectInfo, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="프로젝트 이름을 입력하세요"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">프로젝트 설명</label>
          <textarea
            value={projectInfo.description}
            onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg h-32"
            placeholder="프로젝트에 대해 설명해주세요"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">프로젝트 목적</label>
          <textarea
            value={projectInfo.purpose}
            onChange={(e) => setProjectInfo({ ...projectInfo, purpose: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg h-32"
            placeholder="프로젝트의 목적을 입력하세요"
          />
        </div>
      </div>
    </div>
  );

  
  

  const renderTechStack = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">프로그래밍 언어 선택</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(techStacks).map(lang => (
            <div
              key={lang}
              onClick={() => setProjectInfo({ ...projectInfo, language: lang, framework: "" })}
              className={`p-4 border rounded-lg cursor-pointer ${projectInfo.language === lang ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
            >
              <span className="font-medium">{lang}</span>
            </div>
          ))}
        </div>
      </div>

      {projectInfo.language && (
        <div>
          <h3 className="font-medium mb-3">프레임워크 선택</h3>
          <div className="grid grid-cols-2 gap-3">
            {techStacks[projectInfo.language].map(framework => (
              <div
                key={framework}
                onClick={() => setProjectInfo({ ...projectInfo, framework })}
                className={`p-4 border rounded-lg cursor-pointer ${projectInfo.framework === framework ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
              >
                <span className="font-medium">{framework}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTeamSelection = () => (
    <div className="space-y-4">
      <h3 className="font-medium mb-3">팀원 구성</h3>
      <div className="mb-4">

        {/* 검색 입력창 */}
        <input
          type="text"
          placeholder="팀원 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

      </div>


      <div className="space-y-2">
        {filteredUsers.map(member => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => handleTeamMemberToggle(member)}
          >
            <div>
              <div className="font-medium">{member.name}</div>
              <div className="text-sm text-gray-500">{member.role}</div>
              <div className="flex gap-2 mt-1">
                {member.skills.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {projectInfo.team.some(m => m.id === member.id) ? (
                <Badge className="bg-blue-100 text-blue-700">선택됨</Badge>
              ) : (
                <button className="text-blue-500">추가</button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            setProjectInfo(prev => ({
              ...prev,
              team: []
            }));
            handleNext();
          }}
          className="w-full p-3 border rounded text-center hover:bg-gray-50"
        >
          단독 프로젝트로 진행하기
        </button>
      </div>
      {projectInfo.team.length > 0 && (
        <button
          onClick={handleNext}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          팀 구성 완료
        </button>
      )}
    </div>
  );

  const renderLLMSelection = () => (
    <div className="space-y-4">
      <h3 className="font-medium mb-3">사용할 LLM 선택</h3>
      <div className="grid grid-cols-2 gap-4">
        {availableLLMs.map(llm => (
          <div
            key={llm.id}
            onClick={() => {
              const newLLMs = projectInfo.llm.includes(llm.id)
                ? projectInfo.llm.filter(id => id !== llm.id)
                : [...projectInfo.llm, llm.id];
              setProjectInfo({ ...projectInfo, llm: newLLMs });
            }}
            className={`p-4 border rounded-lg cursor-pointer ${projectInfo.llm.includes(llm.id) ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{llm.name}</div>
                  <div className="text-sm text-gray-500">{llm.provider}</div>
                </div>
                <Badge variant={llm.type === "상용" ? "default" : "outline"}>
                  {llm.type}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{llm.description}</p>
              {projectInfo.llm.includes(llm.id) && (
                <Check className="w-5 h-5 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">

      <div>
        <h3 className="font-medium mb-2">프로젝트 정보</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-4">
            <div>
              <span className="text-gray-500">프로젝트명:</span>
              <span className="ml-2 font-medium">{projectInfo.name}</span>
            </div>
            <div>
              <span className="text-gray-500">설명:</span>
              <p className="mt-1 text-sm">{projectInfo.description}</p>
            </div>
            <div>
              <span className="text-gray-500">목적:</span>
              <p className="mt-1 text-sm">{projectInfo.purpose}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">기술 스택</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">언어:</span>
              <span className="ml-2">{projectInfo.language}</span>
            </div>
            <div>
              <span className="text-gray-500">프레임워크:</span>
              <span className="ml-2">{projectInfo.framework}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">팀 구성</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {projectInfo.team.length === 0 ? (
            <p className="text-sm text-gray-500">단독 프로젝트</p>
          ) : (
            <div className="space-y-2">
              {projectInfo.team.map(member => (
                <div key={member.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                  <div className="flex gap-2">
                    {member.skills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">선택된 LLM</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex gap-2">
            {projectInfo.llm.map(llmId => {
              const llm = availableLLMs.find(l => l.id === llmId);
              return (
                <Badge key={llmId} className={llm.type === "상용" ? "" : "border-blue-500"}>
                  {llm.name}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-64 bg-gray-900 text-white"><Sidebar /></div>
      <div className="flex-1 p-6">


        <div className="flex items-center justify-between mb-8">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className={`
              w-8 h-8 rounded-full border-2 flex items-center justify-center
              ${currentStep === step.id ? "border-blue-500 text-blue-500" :
                  currentStep > step.id ? "border-green-500 text-green-500" :
                    "border-gray-300 text-gray-300"}
            `}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span className="ml-2">{step.title}</span>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-16 mx-4 ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                  }`} />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && renderBasicInfo()}
            {currentStep === 2 && renderTechStack()}
            {currentStep === 3 && renderTeamSelection()}
            {currentStep === 4 && renderLLMSelection()}
            {currentStep === 5 && renderConfirmation()}

            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  이전
                </button>
              )}
              {currentStep < 5 && (
                <button
                  onClick={handleNext}
                  className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  다음
                </button>
              )}
              {currentStep === 5 && (
                <button
                  className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  onClick={newproject}
                >
                  프로젝트 생성
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MVPProjectCreation;