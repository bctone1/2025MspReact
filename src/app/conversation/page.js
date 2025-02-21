"use client";
import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import { useSession } from "next-auth/react";

export default function Dashboard() {
    const [selectedProject, setSelectedProject] = useState("");
    const [inputText, setInputText] = useState("");
    const [isChatActive, setIsChatActive] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [projects, setProjects] = useState([]); // 프로젝트 목록 상태 추가

    const messagesEndRef = useRef(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== "authenticated") return;
        if (session?.user?.email) {
            fetchProjects(session.user.email,session.user.role);
        }
    }, [session, status]);

    const fetchProjects = async (email,role) => {
        const response = await fetch("http://localhost:5000/projectsList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, role:role }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            setProjects(data);
        } else {
            alert("오류발생");
        }


    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
    };

    const handleSubmit = async () => {
        if (!inputText.trim()) return;
        const newMessage = { sender: "user", text: inputText };
        setMessages((prev) => [...prev, newMessage]);
        setInputText("");

        // 채팅창 애니메이션
        if (!isChatActive) {
            setIsChatActive(true);
            setTimeout(() => setShowChat(true), 300);
        }

        const response = await fetch("http://localhost:5000/getconversation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...newMessage, project: selectedProject }),

        });
        const data = await response.json();
        const botMessage = { sender: "bot", text: data};
        setMessages((prev) => [...prev, botMessage]);
    };

    // 메시지가 추가될 때마다 스크롤을 제일 아래로 이동
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-6">
                <header className="mb-6">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                </header>

                <div className="flex flex-col items-center justify-center flex-grow w-full">
                    {!isChatActive ? (
                        <motion.div
                            initial={{ opacity: 1, scale: 1 }}
                            animate={isChatActive ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center w-full"
                        >
                            <h2 className="text-2xl font-semibold mb-4">프로젝트를 선택하세요.</h2>

                            {/* 프로젝트 선택 드롭다운 */}
                            <select
                                value={selectedProject}
                                onChange={handleProjectChange}
                                className="mb-4 p-3 border rounded-lg w-80 text-lg"
                            >
                                <option value="">프로젝트 선택</option>
                                {projects.map((project) => (
                                    <option key={project.project_id} value={project.project_name}>
                                        {project.project_name}
                                    </option>
                                ))}
                            </select>

                            {/* 질문 입력창 */}
                            <motion.div
                                initial={{ height: 200, opacity: 1 }}
                                animate={isChatActive ? { height: 0, opacity: 0 } : { height: 200, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-full max-w-4xl"
                            >
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="질문을 입력하세요."
                                    className="p-4 border rounded-xl w-full h-24 text-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                <button
                                    onClick={handleSubmit}
                                    className="absolute bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition"
                                >
                                    <PaperAirplaneIcon className="w-7 h-7" />
                                </button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        showChat && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full flex flex-col bg-white shadow-lg rounded-lg p-6"
                            >
                                {/* 채팅 메시지 표시 영역 */}
                                <div className="flex-grow overflow-y-auto border-b pb-4 max-h-[650px]">
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className={`mb-2 p-4 rounded-lg w-fit max-w-2xl ${msg.sender === "user"
                                                ? "ml-auto bg-blue-500 text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {msg.text}
                                        </motion.div>
                                    ))}
                                    {/* 마지막 메시지로 스크롤 */}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="relative w-full mt-4">
                                    {/* 입력창 */}
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="메시지를 입력하세요."
                                        className="p-4 pr-14 border rounded-xl w-full h-24 text-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                    {/* 전송 버튼 */}
                                    <button
                                        onClick={handleSubmit}
                                        className="absolute right-6 bottom-6 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition"
                                    >
                                        <PaperAirplaneIcon className="w-7 h-7" />
                                    </button>
                                </div>
                            </motion.div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
