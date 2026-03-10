import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Input, List, Avatar, Space, Upload, message, Typography, Badge, Flex } from 'antd';
import { RobotOutlined, SendOutlined, PictureOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import useAuth from '@/hooks/useAuth';
import filesApi from '@/api/filesApi';
import chatApi from '@/api/chatApi';
import robotIcon from '../assets/images/ai-robot-icon.png';

const { Text } = Typography;

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  imageUrl?: string;
}

const AIAgent: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isAuthenticated) return null;

  const handleSend = async () => {
    if (!input.trim() && !pendingImageFile) return;

    const currentInput = input;
    const currentImageFile = pendingImageFile;
    const currentPreviewUrl = pendingImagePreview;

    const userMsg: Message = {
      id: Date.now(),
      text: currentInput || (currentImageFile ? "Gửi ảnh cho AI" : ""),
      sender: 'user',
      timestamp: new Date(),
      imageUrl: currentPreviewUrl || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setPendingImageFile(null);
    setPendingImagePreview(null);
    setLoading(true);

    try {
      let fileUrl = undefined;
      
      // Upload image first if it exists
      if (currentImageFile) {
        const uploadRes = await filesApi.upload(currentImageFile);
        fileUrl = uploadRes.url;
      }

      // Send to chat API
      const chatRes = await chatApi.sendMessage({
        content: currentInput,
        fileUrl: fileUrl
      });

      const aiMsg: Message = {
        id: Date.now() + 1,
        text: chatRes.result,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      
    } catch (error) {
      console.error("Chat Error:", error);
      message.error("Đã có lỗi xảy ra khi kết nối với máy chủ AI.");
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Hệ thống AI hiện đang xử lý nhiều yêu cầu hoặc không phản hồi. Vui lòng thử lại sau ít phút.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeUpload = (file: File) => {
    setPendingImageFile(file);
    setPendingImagePreview(URL.createObjectURL(file));
    return false; // Prevent automatic upload by antd
  };

  const chatContent = (
    <Card 
      title={
        <Flex justify="space-between" align="center">
          <Space>
            <Avatar src={robotIcon} size="small" />
            <Text strong>AI Assistant</Text>
          </Space>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={() => setIsOpen(false)} 
            size="small"
          />
        </Flex>
      }
      styles={{ 
        body: { 
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          height: 440 // Adjusting based on 500px total height minus header
        } 
      }}
      style={{ 
        width: 380, 
        height: 500, 
        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
        borderRadius: 16,
        overflow: 'hidden'
      }}
    >
      <div 
        ref={chatBodyRef}
        style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f8f9fa', minHeight: 0, scrollBehavior: 'smooth' }}
      >
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item style={{ border: 'none', padding: '8px 0', justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Flex gap={8} style={{ maxWidth: '85%', flexDirection: item.sender === 'user' ? 'row-reverse' : 'row' }} align="start">
                <Avatar 
                  src={item.sender === 'user' ? undefined : robotIcon}
                  icon={item.sender === 'user' ? <UserOutlined /> : undefined} 
                  style={{ backgroundColor: item.sender === 'user' ? '#1677ff' : '#fff', flexShrink: 0, border: item.sender === 'ai' ? '1px solid #f0f0f0' : 'none' }}
                />
                <div style={{ 
                  background: item.sender === 'user' ? '#1677ff' : '#fff', 
                  color: item.sender === 'user' ? '#fff' : '#000',
                  padding: '8px 12px',
                  borderRadius: 12,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}>
                  <Text style={{ color: 'inherit' }}>{item.text}</Text>
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt="Uploaded" 
                      style={{ maxWidth: '100%', marginTop: 8, borderRadius: 8, display: 'block' }} 
                    />
                  )}
                </div>
              </Flex>
            </List.Item>
          )}
        />
        {loading && (
          <div style={{ textAlign: 'left', marginBottom: 16 }}>
            <Badge status="processing" text="Robot đang suy nghĩ..." />
          </div>
        )}
      </div>
      
      <div style={{ padding: 16, background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        {pendingImagePreview && (
          <div style={{ position: 'relative', marginBottom: 12, display: 'inline-block' }}>
            <img 
              src={pendingImagePreview} 
              alt="Pending" 
              style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #d9d9d9' }} 
            />
            <Button 
              type="primary" 
              shape="circle" 
              icon={<CloseOutlined style={{ fontSize: 10 }} />} 
              size="small" 
              onClick={() => {
                setPendingImageFile(null);
                setPendingImagePreview(null);
              }}
              style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20 }}
            />
          </div>
        )}
        <Flex gap={8} align="center">
          <Upload 
            showUploadList={false} 
            beforeUpload={handleBeforeUpload}
          >
            <Button icon={<PictureOutlined />} shape="circle" />
          </Upload>
          <Input 
            placeholder="Nhập nội dung..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleSend}
            style={{ borderRadius: 20 }}
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSend}
            shape="circle"
          />
        </Flex>
      </div>
    </Card>
  );

  return (
    <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 9999 }}>
      {/* Manual Fixed Chat Window */}
      {isOpen && (
        <div style={{ 
          position: 'fixed', 
          bottom: 110, 
          right: 30, 
          zIndex: 10000,
          animation: 'slideUp 0.3s ease-out'
        }}>
          {chatContent}
        </div>
      )}

      {/* Floating Button */}
      <Button 
        type="primary" 
        size="large"
        shape="circle" 
        onClick={() => setIsOpen(!isOpen)}
        icon={<img src={robotIcon} style={{ width: 45, height: 45, transition: 'transform 0.3s' }} className={isOpen ? "rotate-icon" : ""} />}
        className="ai-agent-pulse"
        style={{ 
          width: 64, 
          height: 64, 
          boxShadow: '0 4px 15px rgba(22, 119, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          border: '2px solid #1677ff',
          overflow: 'hidden'
        }}
      />

      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .ai-agent-pulse {
            animation: pulse 2s infinite;
          }
          .rotate-icon {
            transform: scale(0.8) rotate(-10deg);
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(22, 119, 255, 0.6); }
            70% { box-shadow: 0 0 0 15px rgba(22, 119, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(22, 119, 255, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default AIAgent;
