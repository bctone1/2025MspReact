"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";

const AccountSession = () => {
  const [user, setUser] = useState({
    id: "user123",
    name: "홍길동",
    email: "user@example.com",
    password: "12345",
    role: "user",
    skill: "React,Node.js,MongoDB",
    group: "개발팀",
  });

  const [apiKey, setApiKey] = useState({
    googleApiKey: "",
    claudeApiKey: "",
    openaiApiKey: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleApiChange = (e) => {
    const { name, value } = e.target;
    setApiKey((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>사용자 정보 수정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>이름</Label>
              <Input name="name" value={user.name} onChange={handleChange} />
            </div>
            <div>
              <Label>이메일</Label>
              <Input name="email" type="email" value={user.email} onChange={handleChange} />
            </div>
            <div className="relative">
              <Label>비밀번호</Label>
              <Input name="password" type={showPassword ? "text" : "password"} value={user.password} onChange={handleChange} />
              <button
                type="button"
                className="absolute right-2 top-10 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            <div>
              <Label>스킬</Label>
              <Input name="skill" value={user.skill} onChange={handleChange} />
            </div>
            <div>
              <Label>그룹</Label>
              <Input name="group" value={user.group} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API 키 관리</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Google API Key</Label>
              <Input name="googleApiKey" value={apiKey.googleApiKey} onChange={handleApiChange} />
            </div>
            <div>
              <Label>Claude API Key</Label>
              <Input name="claudeApiKey" value={apiKey.claudeApiKey} onChange={handleApiChange} />
            </div>
            <div>
              <Label>OpenAI API Key</Label>
              <Input name="openaiApiKey" value={apiKey.openaiApiKey} onChange={handleApiChange} />
            </div>
          </CardContent>
        </Card>

        <Button className="mt-6 w-full">저장</Button>
      </div>
    </div>
  );
};

export default AccountSession;