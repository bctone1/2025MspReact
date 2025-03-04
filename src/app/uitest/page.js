"use client"
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Key, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Copy, 
  ExternalLink, 
  Shield, 
  Eye, 
  EyeOff, 
  Settings, 
  RefreshCw,
  BarChart2,
  Trash2,
  Save
} from 'lucide-react';

// 날짜 포맷 유틸리티 함수
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

const calculateDaysRemaining = (dateString) => {
  if (!dateString) return 0;
  const expiryDate = new Date(dateString);
  const today = new Date();
  const diffTime = expiryDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const APIKeyDetailDialog = ({ 
  open, 
  onOpenChange, 
  apiKey, 
  provider = null,
  onUpdate, 
  onRevoke 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showKey, setShowKey] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [keyData, setKeyData] = useState(apiKey || {
    id: '',
    name: '',
    key: '',
    providerId: '',
    createdAt: '',
    expiresAt: '',
    lastUsed: '',
    status: 'active',
    environment: 'production',
    usageLimit: 0,
    usageCount: 0,
    restrictions: {
      ipAllowlist: [],
      referrers: [],
      requireMFA: false
    },
    settings: {
      autoRotate: false,
      rotationPeriodDays: 90,
      alertThreshold: 80,
      rateLimit: {
        enabled: true,
        requestsPerMinute: 60
      }
    }
  });
  
  // 수정 중인 필드를 추적하는 상태
  const [editedFields, setEditedFields] = useState({
    name: keyData.name,
    environment: keyData.environment,
    usageLimit: keyData.usageLimit,
    settings: { ...keyData.settings }
  });
  
  const handleUpdate = () => {
    // 실제 구현에서는 여기서 API 호출을 하게 됨
    const updatedKey = {
      ...keyData,
      name: editedFields.name,
      environment: editedFields.environment,
      usageLimit: parseInt(editedFields.usageLimit, 10),
      settings: editedFields.settings
    };
    
    onUpdate && onUpdate(updatedKey);
    setEditMode(false);
  };
  
  const handleCopyKey = () => {
    navigator.clipboard.writeText(keyData.key)
      .then(() => {
        alert('API 키가 클립보드에 복사되었습니다.');
      })
      .catch(err => {
        console.error('클립보드 복사 실패:', err);
      });
  };
  
  const daysRemaining = calculateDaysRemaining(keyData.expiresAt);
  const usagePercentage = (keyData.usageCount / keyData.usageLimit) * 100;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {editMode ? (
              <Input 
                value={editedFields.name} 
                onChange={(e) => setEditedFields({...editedFields, name: e.target.value})}
                className="h-7 mt-1"
              />
            ) : (
              <span>{keyData.name}</span>
            )}
            <Badge className={
              keyData.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }>
              {keyData.status === 'active' ? '활성' : '비활성'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            API 키 상세 정보 및 사용량을 확인하세요.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
            <TabsTrigger value="usage">사용량</TabsTrigger>
          </TabsList>
          
          {/* 개요 탭 */}
          <TabsContent value="overview">
            <div className="space-y-4">
              {/* 키 정보 */}
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">API 키</Label>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleCopyKey}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                <code className="block p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                  {showKey ? keyData.key : keyData.key.substring(0, 10) + '••••••••••••••••••••••••••'}
                </code>
              </div>
              
              {/* 주요 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>공급자</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                        {provider?.logo || <Bot size={14} />}
                      </div>
                      <span>{provider?.name || '알 수 없음'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>환경</Label>
                    {editMode ? (
                      <select 
                        className="w-full p-2 border rounded"
                        value={editedFields.environment}
                        onChange={(e) => setEditedFields({...editedFields, environment: e.target.value})}
                      >
                        <option value="production">프로덕션</option>
                        <option value="development">개발</option>
                        <option value="testing">테스트</option>
                      </select>
                    ) : (
                      <Badge variant={
                        keyData.environment === 'production' ? 'default' :
                        keyData.environment === 'development' ? 'outline' : 'secondary'
                      }>
                        {keyData.environment === 'production' ? '프로덕션' :
                         keyData.environment === 'development' ? '개발' : '테스트'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>생성일</Label>
                    <div className="text-sm">{formatDate(keyData.createdAt)}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>만료일</Label>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{formatDate(keyData.expiresAt)}</div>
                      <Badge className={daysRemaining < 30 ? 'bg-red-100 text-red-700' : 'bg-gray-100'}>
                        {daysRemaining}일 남음
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 사용량 정보 */}
              <div className="space-y-2 p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <Label>사용량 제한</Label>
                  {editMode ? (
                    <Input
                      type="number"
                      value={editedFields.usageLimit}
                      onChange={(e) => setEditedFields({...editedFields, usageLimit: e.target.value})}
                      className="w-32 h-8"
                    />
                  ) : (
                    <span className="text-sm font-medium">{formatNumber(keyData.usageLimit)}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>현재 사용량: {formatNumber(keyData.usageCount)} 토큰</span>
                  <span>{usagePercentage.toFixed(1)}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      usagePercentage > 90 ? 'bg-red-500' :
                      usagePercentage > 75 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* 마지막 사용 정보 */}
              {keyData.lastUsed && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>마지막 사용: {formatDate(keyData.lastUsed)}</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* 설정 탭 */}
          <TabsContent value="settings">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">보안 설정</CardTitle>
                  <CardDescription>API 키 보안 및 접근 제한 설정</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>자동 키 순환</Label>
                      <p className="text-xs text-gray-500">정기적으로 키 자동 교체</p>
                    </div>
                    <Switch 
                      checked={editMode ? editedFields.settings.autoRotate : keyData.settings.autoRotate} 
                      onCheckedChange={(checked) => editMode && setEditedFields({
                        ...editedFields, 
                        settings: {
                          ...editedFields.settings,
                          autoRotate: checked
                        }
                      })}
                      disabled={!editMode}
                    />
                  </div>
                  
                  {(editMode ? editedFields.settings.autoRotate : keyData.settings.autoRotate) && (
                    <div className="ml-6 border-l pl-4 border-gray-200">
                      <div className="space-y-2">
                        <Label className="text-sm">순환 주기 (일)</Label>
                        <Input 
                          type="number" 
                          value={editMode ? editedFields.settings.rotationPeriodDays : keyData.settings.rotationPeriodDays}
                          onChange={(e) => editMode && setEditedFields({
                            ...editedFields,
                            settings: {
                              ...editedFields.settings,
                              rotationPeriodDays: parseInt(e.target.value, 10)
                            }
                          })}
                          className="h-8"
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>IP 허용 목록</Label>
                      <p className="text-xs text-gray-500">허용된 IP 주소에서만 API 호출 허용</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!editMode}
                    >
                      설정
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>요청 제한</Label>
                      <p className="text-xs text-gray-500">분당 최대 요청 수 제한</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        value={editMode ? editedFields.settings.rateLimit.requestsPerMinute : keyData.settings.rateLimit.requestsPerMinute}
                        onChange={(e) => editMode && setEditedFields({
                          ...editedFields,
                          settings: {
                            ...editedFields.settings,
                            rateLimit: {
                              ...editedFields.settings.rateLimit,
                              requestsPerMinute: parseInt(e.target.value, 10)
                            }
                          }
                        })}
                        className="w-20 h-8"
                        disabled={!editMode}
                      />
                      <span className="text-sm text-gray-500">/ 분</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">알림 설정</CardTitle>
                  <CardDescription>사용량 및 오류 알림 설정</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>사용량 알림 임계값</Label>
                      <p className="text-xs text-gray-500">설정된 비율에 도달하면 알림 전송</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        value={editMode ? editedFields.settings.alertThreshold : keyData.settings.alertThreshold}
                        onChange={(e) => editMode && setEditedFields({
                          ...editedFields,
                          settings: {
                            ...editedFields.settings,
                            alertThreshold: parseInt(e.target.value, 10)
                          }
                        })}
                        className="w-20 h-8"
                        disabled={!editMode}
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>오류 알림</Label>
                      <p className="text-xs text-gray-500">API 호출 오류 시 알림 전송</p>
                    </div>
                    <Switch 
                      checked={editMode ? editedFields.settings.errorAlerts : (keyData.settings.errorAlerts || false)}
                      onCheckedChange={(checked) => editMode && setEditedFields({
                        ...editedFields, 
                        settings: {
                          ...editedFields.settings,
                          errorAlerts: checked
                        }
                      })}
                      disabled={!editMode}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* 사용량 탭 */}
          <TabsContent value="usage">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">최근 사용량</CardTitle>
                  <CardDescription>최근 30일간의 사용량 통계</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 flex items-center justify-center border rounded bg-gray-50">
                    <div className="text-center">
                      <BarChart2 size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">사용량 차트 영역</p>
                      <p className="text-xs text-gray-400">실제 구현 시 차트 라이브러리로 대체</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">사용량 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">총 요청</p>
                      <p className="text-xl font-semibold">{formatNumber(keyData.usageCount)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">일 평균</p>
                      <p className="text-xl font-semibold">{formatNumber(Math.round(keyData.usageCount / 30))}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">남은 용량</p>
                      <p className="text-xl font-semibold">{formatNumber(keyData.usageLimit - keyData.usageCount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">로그 히스토리</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      이 부분에서는 실제로 API 키 사용 로그를 표시할 수 있습니다.
                      여기에는 호출 시간, 엔드포인트, 응답 상태 코드 등이 포함될 수 있습니다.
                    </div>
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <ExternalLink size={14} />
                      <span>전체 로그 보기</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-2">
            {!editMode ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1"
                >
                  <Settings size={14} />
                  <span>편집</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  <span>갱신</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditMode(false)}
                >
                  취소
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleUpdate}
                  className="flex items-center gap-1"
                >
                  <Save size={14} />
                  <span>저장</span>
                </Button>
              </>
            )}
          </div>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onRevoke && onRevoke(keyData.id)}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            <span>키 폐기</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyDetailDialog;