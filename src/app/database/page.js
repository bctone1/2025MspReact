"use client";
import Sidebar from "@/components/Sidebar"; // Header 임포트
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Bot, MessageSquare, Save, Edit2, Trash2,
    FileText, Plus
} from 'lucide-react';

import { useSearchParams } from 'next/navigation';

const MVPRequirementSession = () => {

    const [requirements, setRequirements] = useState([]);
    const [systemDefinition, setsystemDefinition] = useState([]);
    const [datatbales, setdatatbales] = useState([]);

    const searchParams = useSearchParams();
    const project_id = searchParams.get("project_id");

    const saveDatatable = async (req) => {
        console.log(req);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saveDatatable`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ project_id: project_id, req: req }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.error("Failed to fetch data");
        }
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requirementsList`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ project_id: project_id }),
                });
                if (response.ok) {
                    const data = await response.json();
                    // console.log(data);
                    const formattedRequirements = data.map((item, index) => {
                        return {
                            id: item.id,  // id
                            title: item.title,  // title
                            description: item.description,  // description
                            definition: item.definition
                        };
                    });
                    setRequirements(prevRequirements => [...prevRequirements, ...formattedRequirements]);
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };


        const fetchsystemData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SystemSettingList`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ project_id: project_id }),
                });
                if (response.ok) {
                    const data = await response.json();

                    const formattedSystem = data.map((item, index) => {
                        return {
                            index: index,
                            definition: item['definition'],
                            id: item['id'],
                            description: item['description'],
                            project_id: item['project_id'],
                            status: item['status'],
                            title: item['title'],
                        };
                    });
                    setsystemDefinition(prev => [...prev, ...formattedSystem]);
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchDatatables = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/datatables`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ project_id: project_id }),
                });
                if (response.ok) {
                    const data = await response.json();
                    const formattedTable = data.map((item, index) => {
                        return {
                            id: index,
                            index: item['id'],
                            project_id: item['project_id'],
                            table_name: item['table_name'],
                            columns: item['columns'].map(col => JSON.parse(col)),
                            description: item['description'],
                        };
                    });

                    setdatatbales(prev => [...prev, ...formattedTable]);
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchDatatables();
        fetchsystemData();
        fetchData();
    }, [project_id]);


    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'system',
            content: 'DB 스키마 설계를 시작하겠습니다. 참조할 요구사항을 선택하면 설계를 도와드리겠습니다.'
        }
    ]);
    const [messageInput, setMessageInput] = useState('');


    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedIdsSystem, setSelectedIdsSystem] = useState([]);

    const handleCardClick = (req) => {
        setSelectedIds((prevIds) =>
            prevIds.includes(req.id) ? prevIds.filter((item) => item !== req.id) : [...prevIds, req.id]
        );
    };

    const handleCardClickSystem = (req) => {
        setSelectedIdsSystem((prevIds) =>
            prevIds.includes(req.id) ? prevIds.filter((item) => item !== req.id) : [...prevIds, req.id]
        );
    };



    const handleSendMessage = async () => {
        const selectedDescriptions = requirements.filter(req => selectedIds.includes(req.id)).map(req => req.description);
        const selectedSystem = systemDefinition.filter(req => selectedIdsSystem.includes(req.id)).map(req => req.description);
        // console.log(selectedSystem);

        if (!messageInput.trim()) return;
        const newMessage = {
            id: messages.length + 1,
            role: 'user',
            content: messageInput
        };
        setMessageInput('');

        setMessages([...messages, newMessage]);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/RequestDBschema`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messageInput: messageInput, selectedDescriptions: selectedDescriptions, selectedSystem: selectedSystem }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data);
            console.log(data.columns);
        } else {
            alert("오류발생");
        }


        const suggestion = {
            id: datatbales.length,
            table_name: data.table_name,
            description: data.description,
            definition: data.definition,
            category: data.category,
            priority: data.priority,
            status: 'draft',
            useCases: data.useCases,
            constraints: data.constraints,
            columns: data.columns
        };

        const aiResponse = {
            id: messages.length + 2,
            role: 'assistant',
            content: 'DB설계를 다음과 같이 정리했습니다.',
            suggestion
        };
        setMessages(prev => [...prev, aiResponse]);
    };

    return (
        <div className="h-screen bg-gray-100 flex">
            <Sidebar />
            {/* Left Panel - Chat Interface */}
            <div className="flex-1 flex flex-col border-r bg-white">
                <div className="p-4 border-b">
                    <h2 className="font-medium">DB 스키마 설계</h2>
                    <p className="text-sm text-gray-500">LLM과 대화하며 DB를 설계합니다.</p>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 flex flex-col h-[700px]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] ${message.role === 'user'
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
                                                        {/* <FileText className="w-4 h-4" /> */}
                                                        {/* <h3 className="font-medium">{message.suggestion.title}</h3> */}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (datatbales.some(req => req.id === message.suggestion.id)) {
                                                                alert("이미 추가된 요청입니다.");
                                                                return;
                                                            }
                                                            setdatatbales([...datatbales, message.suggestion]);
                                                        }}
                                                        className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                                                    >
                                                        {message.suggestion.id}추가
                                                    </button>
                                                </div>

                                                <h2>{message.suggestion.title}</h2>
                                                <table className="border-collapse border w-full">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="border p-2">컬럼명</th>
                                                            <th className="border p-2">제약 조건</th>
                                                            <th className="border p-2">데이터 타입</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {message.suggestion.columns.map((col, index) => (
                                                            <tr key={index} className="border">
                                                                <td className="border p-2">{col.name}</td>
                                                                <td className="border p-2">{col.constraints}</td>
                                                                <td className="border p-2">{col.data_type}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>


                                                <p className="text-black-600 mb-4">
                                                    {message.suggestion.description}
                                                </p>
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
                                placeholder="시스템에 대해 설명해주세요..."
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
            <div className="flex-1 flex flex-col bg-gray-50">

                <div className="p-2 border-b bg-white">
                    <h2 className="font-semibold text-sm">참조가능한 요구사항</h2>
                </div>
                <div className="overflow-y-auto p-4 max-h-80">
                    <div className="space-y-2">
                        {requirements.map((req) => (
                            <Card
                                key={req.id}
                                onClick={() => handleCardClick(req)}
                                className={`hover:border-blue-200 cursor-pointer transition-all ${selectedIds.includes(req.id) ? "bg-black text-white" : ""}`}
                            >
                                <CardContent className="p-2">
                                    <div className="flex items-center space-x-1">
                                        <FileText className="w-3 h-3" />
                                        <h3 className="font-medium text-sm">{req.title} {req.id}</h3>
                                    </div>
                                    <p className={`text-xs text-gray-600 ${selectedIds.includes(req.id) ? "text-white" : ""}`}>
                                        {req.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="p-2 border-b bg-white">
                    <h2 className="font-semibold text-sm">참조가능한 시스템 설계</h2>
                </div>
                <div className="overflow-y-auto p-4 max-h-80">
                    <div className="space-y-2">
                        {systemDefinition.map((req) => (
                            <Card
                                key={req.id}
                                onClick={() => handleCardClickSystem(req)}
                                className={`hover:border-blue-200 cursor-pointer transition-all ${selectedIdsSystem.includes(req.id) ? "bg-black text-white" : ""}`}
                            >
                                <CardContent className="p-2">
                                    <div className="flex items-center space-x-1">
                                        <FileText className="w-3 h-3" />
                                        <h3 className="font-medium text-sm">{req.title} {req.id}</h3>
                                    </div>
                                    <p className={`text-xs text-gray-600 ${selectedIdsSystem.includes(req.id) ? "text-white" : ""}`}>{req.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-b bg-white">
                    <h2 className="text-lg font-semibold">DB 설계</h2>
                    <p className="text-sm text-gray-500">총 {datatbales.length}개의 요청사항</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        {datatbales.map((req) => (
                            <Card key={req.id} className="hover:border-blue-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{req.table_name}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 hover:bg-gray-100 rounded" onClick={() => saveDatatable(req)}>
                                                <Save className="w-4 h-4 text-blue-500" />
                                            </button>

                                            <button
                                                onClick={() => setdatatbales(datatbales.filter(r => r.id !== req.id))}
                                                className="p-1.5 hover:bg-red-100 rounded"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* <h3 className="font-medium mb-2">{req.table_name} </h3> */}
                                    <p className="text-sm text-gray-600 mb-4">{req.description}</p>

                                    <div className="space-y-4">
                                        <div>
                                            <table className="border-collapse border w-full">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border p-2">컬럼명</th>
                                                        <th className="border p-2">제약 조건</th>
                                                        <th className="border p-2">데이터 타입</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {req.columns.map((col, index) => (
                                                        <tr key={index} className="border">
                                                            <td className="border p-2">{col.name}</td>
                                                            <td className="border p-2">{col.constraints}</td>
                                                            <td className="border p-2">{col.data_type}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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