"use client";

import Sidebar from "@/components/Sidebar";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Bot,
  Key,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  Clock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Search,
  Settings
} from 'lucide-react';

// 초기 데이터 (실제로는 API에서 가져올 것)
const initialProviders = [
  {
    id: 'openai',
    name: 'OpenAI',
    status: 'active',
    modelsCount: 4,
    keysCount: 2,
    website: 'https://openai.com',
    description: 'OpenAI의 GPT 모델들을 위한 API 서비스'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    status: 'active',
    modelsCount: 2,
    keysCount: 1,
    website: 'https://anthropic.com',
    description: 'Anthropic Claude 시리즈 모델들을 위한 API 서비스'
  },
  {
    id: 'cohere',
    name: 'Cohere',
    status: 'inactive',
    modelsCount: 1,
    keysCount: 0,
    website: 'https://cohere.ai',
    description: 'Cohere의 자연어 처리 모델들을 위한 API 서비스'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    status: 'active',
    modelsCount: 3,
    keysCount: 1,
    website: 'https://mistral.ai',
    description: 'Mistral의 강력한 LLM을 위한 API 서비스'
  }
];

const initialApiKeys = [
  {
    id: 'key-1',
    providerId: 'openai',
    name: '프로덕션 키',
    key: 'sk-openai-prod-xxxxxxxxxxxxxxxxxxxxxx',
    createdAt: '2024-01-15T10:30:00Z',
    expiresAt: '2025-01-15T10:30:00Z',
    lastUsed: '2024-02-27T11:45:22Z',
    status: 'active',
    environment: 'production',
    usageLimit: 1000000,
    usageCount: 450289
  },
  {
    id: 'key-2',
    providerId: 'openai',
    name: '개발 환경 키',
    key: 'sk-openai-dev-xxxxxxxxxxxxxxxxxxxxxx',
    createdAt: '2024-01-20T14:45:00Z',
    expiresAt: '2025-01-20T14:45:00Z',
    lastUsed: '2024-02-28T09:12:33Z',
    status: 'active',
    environment: 'development',
    usageLimit: 500000,
    usageCount: 124567
  },
  {
    id: 'key-3',
    providerId: 'anthropic',
    name: '기본 키',
    key: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxx',
    createdAt: '2024-02-05T09:15:00Z',
    expiresAt: '2025-02-05T09:15:00Z',
    lastUsed: '2024-02-28T15:30:45Z',
    status: 'active',
    environment: 'production',
    usageLimit: 750000,
    usageCount: 325890
  },
  {
    id: 'key-4',
    providerId: 'mistral',
    name: '테스트 키',
    key: 'sk-mistral-xxxxxxxxxxxxxxxxxxxxxx',
    createdAt: '2024-02-10T16:20:00Z',
    expiresAt: '2025-02-10T16:20:00Z',
    lastUsed: '2024-02-26T19:05:12Z',
    status: 'active',
    environment: 'testing',
    usageLimit: 300000,
    usageCount: 56789
  },
];

const LLMProviderKeyManager = () => {
  const [providers, setProviders] = useState(initialProviders);
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [activeTab, setActiveTab] = useState('providers');
  const [searchQuery, setSearchQuery] = useState('');

  // 대화상자 상태
  const [showAddProviderDialog, setShowAddProviderDialog] = useState(false);
  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // API 키 표시 상태
  const [visibleKeys, setVisibleKeys] = useState({});

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  // 필터링된 공급자 목록
  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 필터링된 API 키 목록
  const filteredApiKeys = apiKeys.filter(key => {
    const provider = providers.find(p => p.id === key.providerId);
    return (
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (provider && provider.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // API 키 복사 함수
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('API Key copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // 공급자 추가 폼
  const AddProviderForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
      const newProvider = {
        id: `provider-${Date.now()}`,
        name: data.name,
        status: data.status,
        modelsCount: 0,
        keysCount: 0,
        logo: '🔌', // 기본 로고
        website: data.website,
        description: data.description
      };

      setProviders([...providers, newProvider]);
      setShowAddProviderDialog(false);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="grid gap-4 py-4">

          <div className="space-y-2">
            <Label htmlFor="name">공급자 이름</Label>
            <Input
              id="name"
              placeholder="이름 입력"
              {...register("name", { required: "이름은 필수입니다" })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">웹사이트</Label>
            <Input
              id="website"
              placeholder="https://example.com"
              {...register("website")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Input
              id="description"
              placeholder="공급자 설명 입력"
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <select
              className="w-full p-2 border rounded-md"
              id="status"
              {...register("status", { required: true })}
            >
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setShowAddProviderDialog(false)}>
            취소
          </Button>
          <Button type="submit">추가</Button>
        </DialogFooter>
      </form>
    );
  };

  // API 키 추가 폼
  const AddApiKeyForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
      // 실제로는 서버에 요청을 보내 새 키를 생성할 것임
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1년 후 만료

      const newApiKey = {
        id: `key-${Date.now()}`,
        providerId: data.providerId,
        name: data.name,
        key: `sk-${data.providerId}-${Math.random().toString(36).substring(2, 15)}`,
        createdAt: new Date().toISOString(),
        expiresAt: expiryDate.toISOString(),
        lastUsed: null,
        status: 'active',
        environment: data.environment,
        usageLimit: parseInt(data.usageLimit, 10),
        usageCount: 0
      };

      setApiKeys([...apiKeys, newApiKey]);

      // 해당 Provider의 키 카운트 증가
      setProviders(prevProviders =>
        prevProviders.map(provider =>
          provider.id === data.providerId
            ? { ...provider, keysCount: provider.keysCount + 1 }
            : provider
        )
      );

      setShowAddKeyDialog(false);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">키 이름</Label>
            <Input
              id="name"
              placeholder="이름 입력"
              {...register("name", { required: "이름은 필수입니다" })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="providerId">공급자</Label>
            <select
              className="w-full p-2 border rounded-md"
              id="providerId"
              {...register("providerId", { required: true })}
              defaultValue={selectedProvider ? selectedProvider.id : ''}
            >
              {providers.filter(p => p.status === 'active').map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="environment">환경</Label>
            <select
              className="w-full p-2 border rounded-md"
              id="environment"
              {...register("environment", { required: true })}
            >
              <option value="production">프로덕션</option>
              <option value="development">개발</option>
              <option value="testing">테스트</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageLimit">사용 제한 (토큰)</Label>
            <Input
              id="usageLimit"
              type="number"
              placeholder="사용 제한"
              {...register("usageLimit", { required: true, min: 1 })}
              defaultValue="1000000"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setShowAddKeyDialog(false)}>
            취소
          </Button>
          <Button type="submit">생성</Button>
        </DialogFooter>
      </form>
    );
  };

  // 포매팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return '방금 전';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}일 전`;

    return formatDate(dateString);
  };

  // 사용량 계산 및 포매팅
  const getUsagePercentage = (used, limit) => {
    return (used / limit) * 100;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  // UI 렌더링
  return (

    <div className="flex">
      <div className="w-64 bg-gray-900 text-white"><Sidebar /></div>
      <div className="container mx-auto py-6">


        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">LLM 공급자 및 API 키 관리</h1>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between border-b px-4">
              <TabsList className="h-12">
                <TabsTrigger value="providers" className="flex items-center gap-2">
                  <Bot size={16} />
                  <span>LLM 공급자</span>
                  <Badge variant="secondary" className="ml-1">{providers.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="apiKeys" className="flex items-center gap-2">
                  <Key size={16} />
                  <span>API 키</span>
                  <Badge variant="secondary" className="ml-1">{apiKeys.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-60"
                  />
                </div>

                {activeTab === 'providers' ? (
                  <Dialog open={showAddProviderDialog} onOpenChange={setShowAddProviderDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        공급자 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>새 LLM 공급자 추가</DialogTitle>
                        <DialogDescription>
                          LLM 공급자 정보를 입력하세요. 추가 후 API 키를 등록할 수 있습니다.
                        </DialogDescription>
                      </DialogHeader>
                      <AddProviderForm />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={showAddKeyDialog} onOpenChange={setShowAddKeyDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        API 키 생성
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>새 API 키 생성</DialogTitle>
                        <DialogDescription>
                          새 API 키 정보를 입력하세요. 이 키는 생성 후 한 번만 표시됩니다.
                        </DialogDescription>
                      </DialogHeader>
                      <AddApiKeyForm />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            <TabsContent value="providers" className="p-4">
              {filteredProviders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProviders.map(provider => (
                    <Card key={provider.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {/* <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-xl">
                              {provider.logo}
                            </div> */}
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {provider.name}
                                {provider.status === 'active' ? (
                                  <Badge className="bg-green-100 text-green-700">활성</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-gray-500">비활성</Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-sm mt-1">
                                {provider.description || '설명 없음'}
                              </CardDescription>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedProvider(provider);
                                setShowAddKeyDialog(true);
                              }}>
                                <Key className="mr-2 h-4 w-4" />
                                <span>API 키 생성</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>편집</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>삭제</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex flex-col">
                            <span className="text-gray-500">모델</span>
                            <span className="font-medium">{provider.modelsCount}개</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500">API 키</span>
                            <span className="font-medium">{provider.keysCount}개</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex justify-between border-t pt-4 pb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-xs"
                          onClick={() => window.open(provider.website, '_blank')}
                        >
                          <ExternalLink size={12} /> 웹사이트
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex items-center gap-1 text-xs"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setShowAddKeyDialog(true);
                          }}
                        >
                          <Key size={12} /> API 키 생성
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Bot size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium">LLM 공급자가 없습니다</h3>
                  <p className="text-gray-500 mt-2 mb-4">
                    새 LLM 공급자를 추가하여 시작하세요.
                  </p>
                  <Button
                    onClick={() => setShowAddProviderDialog(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    공급자 추가
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="apiKeys" className="p-4">
              {filteredApiKeys.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>공급자</TableHead>
                      <TableHead>API 키</TableHead>
                      <TableHead>환경</TableHead>
                      <TableHead>사용량</TableHead>
                      <TableHead>생성일</TableHead>
                      <TableHead>만료일</TableHead>
                      <TableHead>마지막 사용</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApiKeys.map(key => {
                      const provider = providers.find(p => p.id === key.providerId);
                      const usagePercentage = getUsagePercentage(key.usageCount, key.usageLimit);
                      return (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.name}</TableCell>
                          <TableCell>{provider?.name || '알 수 없음'}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <code className="bg-gray-100 rounded px-2 py-1 text-xs">
                                {visibleKeys[key.id] ? key.key : key.key.substring(0, 8) + '••••••••••••••••'}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleKeyVisibility(key.id)}
                              >
                                {visibleKeys[key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(key.key)}
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              key.environment === 'production' ? 'default' :
                                key.environment === 'development' ? 'outline' : 'secondary'
                            }>
                              {key.environment === 'production' ? '프로덕션' :
                                key.environment === 'development' ? '개발' : '테스트'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center text-xs">
                                <span>{formatNumber(key.usageCount)} / {formatNumber(key.usageLimit)}</span>
                                <span className="ml-auto text-gray-500">
                                  {usagePercentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${usagePercentage > 90 ? 'bg-red-500' :
                                      usagePercentage > 75 ? 'bg-amber-500' : 'bg-blue-500'
                                    }`}
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">{formatDate(key.createdAt)}</TableCell>
                          <TableCell className="text-xs">{formatDate(key.expiresAt)}</TableCell>
                          <TableCell className="text-xs">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatRelativeTime(key.lastUsed)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => copyToClipboard(key.key)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  <span>복사</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  <span>갱신</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>폐기</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Key size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium">API 키가 없습니다</h3>
                  <p className="text-gray-500 mt-2 mb-4">
                    새 API 키를 생성하여 LLM 서비스에 연결하세요.
                  </p>
                  <Button
                    onClick={() => setShowAddKeyDialog(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    API 키 생성
                  </Button>
                </div>
              )}
            </TabsContent>

          </Tabs>
        </div>

        {/* API 사용량 요약 및 통계 섹션 (탭 아래에 추가) */}
        <div className="mt-8 border rounded-lg shadow-sm bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">API 사용량 요약</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">총 요청 수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(apiKeys.reduce((sum, key) => sum + key.usageCount, 0))}
                </div>
                <p className="text-xs text-gray-500 mt-1">모든 공급자 통합</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">남은 사용량</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(apiKeys.reduce((sum, key) => sum + (key.usageLimit - key.usageCount), 0))}
                </div>
                <p className="text-xs text-gray-500 mt-1">모든 키 제한 합산</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">활성 공급자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {providers.filter(p => p.status === 'active').length} / {providers.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">사용 가능한 서비스</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">활성 API 키</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apiKeys.filter(k => k.status === 'active').length} / {apiKeys.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">사용 가능한 키</p>
              </CardContent>
            </Card>
          </div>

          {/* 공급자별 사용량 차트 (실제로는 차트 라이브러리 사용) */}
          <div className="mt-8">
            <h3 className="text-md font-medium mb-4">공급자별 사용량</h3>
            <div className="border rounded-lg p-4">
              <div className="space-y-4">
                {providers.filter(p => p.status === 'active').map(provider => {
                  const providerKeys = apiKeys.filter(k => k.providerId === provider.id);
                  const totalUsage = providerKeys.reduce((sum, key) => sum + key.usageCount, 0);
                  const totalLimit = providerKeys.reduce((sum, key) => sum + key.usageLimit, 0);
                  const usagePercentage = totalLimit > 0 ? (totalUsage / totalLimit) * 100 : 0;

                  return (
                    <div key={provider.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{provider.name}</span>
                          <Badge variant="outline">
                            {providerKeys.length}개 키
                          </Badge>
                        </div>
                        <span className="text-sm">
                          {formatNumber(totalUsage)} / {formatNumber(totalLimit)} ({usagePercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${usagePercentage > 90 ? 'bg-red-500' :
                              usagePercentage > 75 ? 'bg-amber-500' : 'bg-blue-500'
                            }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 보안 및 설정 섹션 */}
        <div className="mt-8 border rounded-lg shadow-sm bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">API 키 보안 및 설정</h2>
            <Button variant="outline" size="sm">
              <Settings size={14} className="mr-1" /> 고급 설정
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-3">보안 설정</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="rotate-keys">자동 키 순환</Label>
                        <p className="text-xs text-gray-500">90일마다 API 키 자동 교체</p>
                      </div>
                      <Switch id="rotate-keys" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ip-restrict">IP 접근 제한</Label>
                        <p className="text-xs text-gray-500">허용된 IP 주소에서만 API 키 사용 가능</p>
                      </div>
                      <Switch id="ip-restrict" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="alert-threshold">사용량 알림</Label>
                        <p className="text-xs text-gray-500">사용량이 80%에 도달하면 알림 전송</p>
                      </div>
                      <Switch id="alert-threshold" checked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-md font-medium mb-3">모니터링 및 로깅</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="detailed-logs">상세 로깅</Label>
                        <p className="text-xs text-gray-500">모든 API 요청에 대한 상세 로그 저장</p>
                      </div>
                      <Switch id="detailed-logs" checked={true} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="failure-alerts">오류 알림</Label>
                        <p className="text-xs text-gray-500">API 오류 발생 시 즉시 알림</p>
                      </div>
                      <Switch id="failure-alerts" checked={true} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="export-logs">로그 내보내기</Label>
                        <p className="text-xs text-gray-500">주 단위로 로그 자동 내보내기</p>
                      </div>
                      <Switch id="export-logs" />
                    </div>
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

export default LLMProviderKeyManager;