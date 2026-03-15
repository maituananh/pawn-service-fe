import chatApi from "@/api/chatApi";
import filesApi from "@/api/filesApi";
import useAuth from "@/hooks/useAuth";
import {
  CalendarOutlined,
  CloseOutlined,
  ExpandAltOutlined,
  PictureOutlined,
  SendOutlined,
  ShrinkOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Input,
  List,
  message,
  Space,
  Tag,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import robotIcon from "../assets/images/ai-robot-icon.png";
import { getImageUrl } from "@/lib/imageUtils";

const { Text } = Typography;

// Helper: Format Currency to VND
const formatVND = (amount: any) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return (value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

// Helper: Format Date
const formatSimpleDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? dateStr
    : date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

// Helper: Status Labels & Colors
const getStatusBadgeProps = (status: string) => {
  const s = (status || "").toUpperCase();
  switch (s) {
    case "PENDING":
      return { text: "Chờ thanh toán", color: "#faad14" };
    case "CONFIRMED":
    case "PAID":
      return { text: "Đã xác nhận", color: "#52c41a" };
    case "SHIPPING":
      return { text: "Đang giao hàng", color: "#1890ff" };
    case "DELIVERED":
    case "COMPLETED":
      return { text: "Hoàn tất", color: "#2f54eb" };
    case "CANCELLED":
    case "FAILED":
      return { text: "Thất bại", color: "#ff4d4f" };
    default:
      return { text: status, color: "#bfbfbf" };
  }
};

interface Message {
  id: number;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
  imageUrl?: string;
  type?: string;
  data?: any;
}

const NewAccountForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);

  const handleSubmit = async () => {
    if (!username || !phone || !email || !file) {
      message.error("Vui lòng điền đầy đủ thông tin và chọn ảnh!");
      return;
    }

    setLoading(true);
    try {
      const uploadRes = await filesApi.upload(file);
      const res = await chatApi.sendOcrUser({
        username,
        phone,
        email,
        fileUrl: uploadRes.url,
      });
      message.success("Đã gửi thông tin đăng ký định danh!");
      setSubmitResult(res.result || "Đã gửi thành công");
      setResultData(res);
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi gửi thông tin.");
    } finally {
      setLoading(false);
    }
  };

  if (submitResult) {
    return (
      <div
        style={{
          marginTop: 12,
          borderTop: "1px solid #f0f0f0",
          paddingTop: 12,
        }}
      >
        <Text
          type="success"
          strong
          style={{ display: "block", marginBottom: 8 }}
        >
          {submitResult}
        </Text>
        {resultData?.username && (
          <Flex
            vertical
            gap={4}
            style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}
          >
            <Text>
              <Text strong>Username:</Text> {resultData.username}
            </Text>
            {resultData.password && (
              <Text>
                <Text strong>Password:</Text> {resultData.password}
              </Text>
            )}
          </Flex>
        )}
      </div>
    );
  }

  return (
    <div
      style={{ marginTop: 12, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}
    >
      <Flex vertical gap={8}>
        <Input
          placeholder="Username"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Number phone"
          size="small"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Email"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Upload
          showUploadList={true}
          maxCount={1}
          beforeUpload={(f) => {
            setFile(f);
            return false;
          }}
          onRemove={() => setFile(null)}
          fileList={
            file
              ? ([{ uid: "-1", name: file.name, status: "done" }] as any)
              : []
          }
        >
          <Button
            icon={<PictureOutlined />}
            size="small"
            block
            disabled={loading}
          >
            Identity Cards (CCCD)
          </Button>
        </Upload>
        <Button
          type="primary"
          size="small"
          onClick={handleSubmit}
          loading={loading}
        >
          Gửi
        </Button>
      </Flex>
    </div>
  );
};

const AIAgent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(
    null,
  );
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() && !pendingImageFile) return;

    const currentInput = input;
    const currentImageFile = pendingImageFile;
    const currentPreviewUrl = pendingImagePreview;

    const userMsg: Message = {
      id: Date.now(),
      text: currentInput || (currentImageFile ? "Gửi ảnh cho AI" : ""),
      sender: "user",
      timestamp: new Date(),
      imageUrl: currentPreviewUrl || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
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
        fileUrl: fileUrl,
      });

      const aiMsg: Message = {
        id: Date.now() + 1,
        text: chatRes.result,
        sender: "ai",
        timestamp: new Date(),
        type: chatRes.type,
        data: chatRes,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      message.error("Đã có lỗi xảy ra khi kết nối với máy chủ AI.");
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Hệ thống AI hiện đang xử lý nhiều yêu cầu hoặc không phản hồi. Vui lòng thử lại sau ít phút.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
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
          <Space size={0}>
            <Button
              type="text"
              icon={isExpanded ? <ShrinkOutlined /> : <ExpandAltOutlined />}
              onClick={() => setIsExpanded(!isExpanded)}
              size="small"
            />
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsOpen(false)}
              size="small"
            />
          </Space>
        </Flex>
      }
      styles={{
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        },
      }}
      style={{
        width: "100%",
        height: "100%",
        boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={chatBodyRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          background: "#f8f9fa",
          minHeight: 0,
          scrollBehavior: "smooth",
        }}
      >
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item
              style={{
                border: "none",
                padding: "8px 0",
                marginBottom: "12px",
                justifyContent:
                  item.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Flex
                gap={8}
                style={{
                  maxWidth: "85%",
                  flexDirection: item.sender === "user" ? "row-reverse" : "row",
                }}
                align="start"
              >
                <Avatar
                  src={item.sender === "user" ? getImageUrl(currentUser?.avatar) : robotIcon}
                  icon={item.sender === "user" && !currentUser?.avatar ? <UserOutlined /> : undefined}
                  style={{
                    backgroundColor:
                      item.sender === "user" && !currentUser?.avatar ? "#1677ff" : "#fff",
                    flexShrink: 0,
                    border: item.sender === "ai" ? "1px solid #f0f0f0" : "none",
                  }}
                />
                <div
                  style={{
                    background: item.sender === "user" ? "#1677ff" : "#fff",
                    color: item.sender === "user" ? "#fff" : "#000",
                    padding: "8px 12px",
                    borderRadius: 12,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* ERROR type: show error message */}
                  {item.type === "ERROR" && (
                    <Flex
                      gap={6}
                      align="start"
                      style={{
                        background: "#fff2f0",
                        border: "1px solid #ffccc7",
                        padding: "8px 12px",
                        borderRadius: 8,
                      }}
                    >
                      <Text type="danger" style={{ whiteSpace: "pre-wrap" }}>
                        ⚠️ {item.text}
                      </Text>
                    </Flex>
                  )}

                  {/* PROFILE type: show profile card without result text */}
                  {item.type === "PROFILE" && item.data && (
                    <Flex
                      vertical
                      gap={4}
                      style={{
                        background: "#fafafa",
                        padding: 12,
                        borderRadius: 8,
                      }}
                    >
                      <Flex align="center" gap={12} style={{ marginBottom: 8 }}>
                        {item.data.avatar && (
                           <Avatar size={40} src={getImageUrl(item.data.avatar)} />
                        )}
                        <Text strong style={{ margin: 0 }}>Thông tin cá nhân</Text>
                      </Flex>
                      {item.data.name && (
                        <Text>
                          <Text strong>Họ tên:</Text> {item.data.name}
                        </Text>
                      )}
                      {item.data.age !== undefined && item.data.age !== null && (
                        <Text>
                          <Text strong>Tuổi:</Text> {item.data.age}
                        </Text>
                      )}
                      {item.data.gender && (
                        <Text>
                          <Text strong>Giới tính:</Text> {item.data.gender}
                        </Text>
                      )}
                      {item.data.phone && (
                        <Text>
                          <Text strong>SĐT:</Text> {item.data.phone}
                        </Text>
                      )}
                      {item.data.email && (
                        <Text>
                          <Text strong>Email:</Text> {item.data.email}
                        </Text>
                      )}
                      {item.data.address && (
                        <Text>
                          <Text strong>Địa chỉ:</Text> {item.data.address}
                        </Text>
                      )}
                    </Flex>
                  )}

                  {/* OCR_IDENTITY type: show username/password without result text */}
                  {item.type === "OCR_IDENTITY" && item.data && (
                    <Flex
                      vertical
                      gap={4}
                      style={{
                        background: "#fafafa",
                        padding: 12,
                        borderRadius: 8,
                      }}
                    >
                      <Text strong style={{ marginBottom: 4 }}>Thông tin tài khoản</Text>
                      {item.data.username && (
                        <Text>
                          <Text strong>Username:</Text> {item.data.username}
                        </Text>
                      )}
                      {item.data.password && (
                        <Text>
                          <Text strong>Password:</Text> {item.data.password}
                        </Text>
                      )}
                    </Flex>
                  )}

                  {/* ORDER type: show order list */}
                  {item.type === "ORDER" && item.data?.orders && (
                    <Flex vertical gap={12} style={{ width: "100%", marginTop: 8 }}>
                      {item.text && (
                        <Text style={{ color: "inherit", whiteSpace: "pre-wrap", marginBottom: 4, display: 'block' }}>
                          {item.text}
                        </Text>
                      )}
                      <Flex align="center" gap={8} style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 20 }}>📦</span>
                        <Text strong style={{ fontSize: 15, color: '#1f1f1f' }}>
                          Danh sách đơn hàng liên quan
                        </Text>
                      </Flex>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {item.data.orders.map((order: any) => {
                          const badge = getStatusBadgeProps(order.status);
                          return (
                            <Card
                              key={order.orderId}
                              size="small"
                              hoverable
                              onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                              style={{
                                borderRadius: 14,
                                border: "1px solid #e8e8e8",
                                boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
                                overflow: "hidden",
                                background: "#fff",
                                transition: 'all 0.3s'
                              }}
                              styles={{ body: { padding: "12px 14px" } }}
                            >
                              <Flex justify="space-between" align="start">
                                <Flex vertical gap={4}>
                                  <Text strong style={{ fontSize: 14, color: "#1677ff", letterSpacing: 0.5 }}>
                                    #{order.orderId}
                                  </Text>
                                  <Flex align="center" gap={6}>
                                    <CalendarOutlined style={{ fontSize: 11, color: "#8c8c8c" }} />
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                      {formatSimpleDate(order.createdAt)}
                                    </Text>
                                  </Flex>
                                </Flex>
                                <Tag
                                  bordered={false}
                                  style={{
                                    backgroundColor: badge.color,
                                    color: '#fff',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    padding: "0 10px",
                                    height: 22,
                                    lineHeight: "22px",
                                    borderRadius: 11,
                                    margin: 0,
                                    boxShadow: `0 4px 10px ${badge.color}33`,
                                    textTransform: 'uppercase'
                                  }}
                                >
                                  {badge.text}
                                </Tag>
                              </Flex>
                              <div style={{ marginTop: 10, borderTop: "1px solid #f5f5f5", paddingTop: 10 }}>
                                <Flex justify="space-between" align="center">
                                  <Text type="secondary" style={{ fontSize: 12 }}>Tổng cộng</Text>
                                  <Text strong style={{ fontSize: 16, color: "#f5222d" }}>
                                    {formatVND(order.totalAmount)}
                                  </Text>
                                </Flex>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </Flex>
                  )}

                  {/* Default: show result text for non-typed messages */}
                  {!item.type && (
                    <Text style={{ color: "inherit", whiteSpace: "pre-wrap" }}>
                      {item.text}
                    </Text>
                  )}


                  {item.type === "NEW_ACCOUNT" && <NewAccountForm />}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt="Uploaded"
                      style={{
                        maxWidth: "100%",
                        marginTop: 8,
                        borderRadius: 8,
                        display: "block",
                      }}
                    />
                  )}
                </div>
              </Flex>
            </List.Item>
          )}
        />
        {loading && (
          <div style={{ textAlign: "left", marginBottom: 16 }}>
            <Badge status="processing" text="Robot đang suy nghĩ..." />
          </div>
        )}
      </div>

      <div
        style={{
          padding: 16,
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        {pendingImagePreview && (
          <div
            style={{
              position: "relative",
              marginBottom: 12,
              display: "inline-block",
            }}
          >
            <img
              src={pendingImagePreview}
              alt="Pending"
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                objectFit: "cover",
                border: "1px solid #d9d9d9",
              }}
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
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 20,
                height: 20,
              }}
            />
          </div>
        )}
        <Flex gap={8} align="center">
          <Upload showUploadList={false} beforeUpload={handleBeforeUpload}>
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
    <div style={{ position: "fixed", bottom: 30, right: 30, zIndex: 9999 }}>
      {/* Background Overlay */}
      {isOpen && isExpanded && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 9998,
            animation: "fadeIn 0.3s ease-out",
          }}
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Manual Fixed Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: isExpanded ? "10vh" : 110,
            right: isExpanded ? "10vw" : 30,
            width: isExpanded ? "80vw" : 380,
            height: isExpanded ? "80vh" : 500,
            zIndex: 10000,
            animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {chatContent}
        </div>
      )}

      {/* Floating Button */}
      <Button
        type="primary"
        size="large"
        shape="circle"
        onClick={() => setIsOpen(!isOpen)}
        icon={
          <img
            src={robotIcon}
            style={{ width: 45, height: 45, transition: "transform 0.3s" }}
            className={isOpen ? "rotate-icon" : ""}
          />
        }
        className="ai-agent-pulse"
        style={{
          width: 64,
          height: 64,
          boxShadow: "0 4px 15px rgba(22, 119, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          border: "2px solid #1677ff",
          overflow: "hidden",
        }}
      />

      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
