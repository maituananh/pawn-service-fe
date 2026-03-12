import { useOrder } from "@/hooks/useOrder";
import { OrderDetailResponse, OrderStatus, PaginatedOrderResponse } from "@/type/order.type";
import {
  CalendarOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  theme,
  Tabs,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [activeTab, setActiveTab ] = useState<string>("ALL");

  const { useGetOrders } = useOrder();
  
  const orderParams = {
    page: currentPage,
    size: pageSize,
    status: activeTab === "ALL" ? undefined : (activeTab as OrderStatus),
  };

  const { data, isLoading } = useGetOrders(orderParams);
  const ordersPage = data as PaginatedOrderResponse;

  const handleRowClick = (record: OrderDetailResponse) => {
    const pathId = record.id || record.orderId;
    if (pathId) {
       navigate(`/admin/orders/${pathId}`);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CONFIRMED:
      case OrderStatus.PAID:
        return "success";
      case OrderStatus.DELIVERED:
      case OrderStatus.COMPLETED:
        return "cyan";
      case OrderStatus.PENDING:
        return "processing";
      case OrderStatus.CANCELLED:
      case OrderStatus.FAILED:
        return "error";
      case OrderStatus.SHIPPING:
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Chờ thanh toán";
      case OrderStatus.CONFIRMED:
      case OrderStatus.PAID:
        return "Đã xác nhận";
      case OrderStatus.SHIPPING:
        return "Đang giao hàng";
      case OrderStatus.DELIVERED:
      case OrderStatus.COMPLETED:
        return "Đã giao hàng";
      case OrderStatus.CANCELLED:
        return "Đã hủy";
      case OrderStatus.FAILED:
        return "Thanh toán lỗi";
      default:
        return status;
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "---";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "---" : date.toLocaleDateString("vi-VN");
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      key: "orderCode",
      render: (_: any, record: OrderDetailResponse) => (
        <Text strong>#{record.orderId || record.orderCode || record.id}</Text>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Space>
          <CalendarOutlined style={{ color: "#8c8c8c" }} />
          {formatDate(date)}
        </Space>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "shippingName",
      key: "customer",
      render: (text: string, record: OrderDetailResponse) => (
        <Flex vertical gap={0}>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>{text || 'N/A'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.shippingPhone || 'N/A'}</Text>
        </Flex>
      ),
    },
    {
      title: "Tổng cộng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <Text strong style={{ color: token.colorError }}>
          {amount?.toLocaleString() || 0} VND
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: OrderDetailResponse) => {
        const currentStatus = record.orderStatus || record.status;
        return (
          <Tag color={getStatusColor(currentStatus)} bordered={false} style={{ borderRadius: 6, fontWeight: 500 }}>
            {getStatusLabel(currentStatus)}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "right" as const,
      render: (_: any, record: OrderDetailResponse) => (
        <Button
          type="text"
          shape="circle"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(record);
          }}
        />
      ),
    },
  ];

  const tabItems = [
    { key: "ALL", label: "Tất cả đơn hàng" },
    { key: OrderStatus.PENDING, label: "Chờ thanh toán" },
    { key: OrderStatus.CONFIRMED, label: "Đã xác nhận" },
    { key: OrderStatus.SHIPPING, label: "Đang giao hàng" },
    { key: OrderStatus.DELIVERED, label: "Đã giao hàng" },
    { key: OrderStatus.CANCELLED, label: "Đã hủy" },
    { key: OrderStatus.FAILED, label: "Thất bại" },
  ];

  return (
    <Flex vertical gap={24}>
      <Card 
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderRadius: 16 }}
        title={
          <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
            <Flex vertical gap={4}>
              <Title level={4} style={{ margin: 0 }}>Quản lý đơn hàng</Title>
              <Text type="secondary" style={{ fontSize: 13 }}>Theo dõi và cập nhật trạng thái đơn đặt hàng</Text>
            </Flex>
            <Flex gap={12} wrap="wrap">
              <Input 
                placeholder="Tìm mã đơn hàng..." 
                prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />} 
                style={{ width: 240, borderRadius: 10 }}
                allowClear
              />
              <Button icon={<FilterOutlined />} style={{ borderRadius: 10 }}>Bộ lọc</Button>
            </Flex>
          </Flex>
        }
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => {
            setActiveTab(key);
            setCurrentPage(0);
          }}
          items={tabItems}
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={ordersPage?.data || []}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          loading={isLoading}
          size="middle"
          rowClassName="row-hover-custom"
          pagination={{
            position: ["bottomRight"],
            current: currentPage + 1,
            pageSize: pageSize,
            total: ordersPage?.totalElements || 0,
            onChange: (page) => setCurrentPage(page - 1),
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}-${range[1]} của ${total} đơn hàng`,
            showSizeChanger: false,
          }}
          style={{ cursor: 'pointer' }}
        />
      </Card>
    </Flex>
  );
};

export default AdminOrdersPage;
