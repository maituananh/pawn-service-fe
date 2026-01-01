import DashboardStatsFeature from "@/features/DashboardStatsFeature";
import { ExportOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Card, Space, Table, Tabs, Tag, Typography } from "antd";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const chartData = [
  { name: "Feb", value: 30000 },
  { name: "Mar", value: 45000 },
  { name: "Apr", value: 40000 },
  { name: "May", value: 60000 },
  { name: "Jun", value: 45591 },
  { name: "Jul", value: 50000 },
  { name: "Aug", value: 65000 },
  { name: "Sep", value: 70000 },
  { name: "Oct", value: 68000 },
  { name: "Nov", value: 72000 },
  { name: "Dec", value: 80000 },
];

const tableData = [
  {
    key: "1",
    name: "[số căn cước công dân]",
    user: "[tên người cầm]",
    price: "20.000.000 vnd",
    date: "Jan 17, 2022",
    product: "[tên sản phẩm]",
    status: "Mới cầm",
  },
  {
    key: "2",
    name: "[số căn cước công dân]",
    user: "[tên người cầm]",
    price: "10.000.000 vnd",
    date: "Jan 17, 2022",
    product: "Iphone 17 Pro",
    status: "Đã gia hạn",
  },
  {
    key: "3",
    name: "[số căn cước công dân]",
    user: "[tên người cầm]",
    price: "3.000.000 vnd",
    date: "Jan 17, 2022",
    product: "Xe Winner",
    status: "Đang cầm",
  },
  {
    key: "4",
    name: "[số căn cước công dân]",
    user: "[tên người cầm]",
    price: "1.000.000 vnd",
    date: "Jan 17, 2022",
    product: "Vang 9999",
    status: "Đã quá hạn",
  },
];

const statusColors: { [key: string]: string } = {
  "Mới cầm": "green",
  "Đã gia hạn": "blue",
  "Đang cầm": "gold",
  "Đã quá hạn": "red",
};

const columns = [
  {
    title: "Tên khách hàng",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: any) => (
      <div>
        <Text strong>{text}</Text>
        <br />
        <Text type="secondary">{record.user}</Text>
      </div>
    ),
  },
  { title: "Giá trị", dataIndex: "price", key: "price" },
  { title: "Ngày cầm", dataIndex: "date", key: "date" },
  { title: "Sản phẩm", dataIndex: "product", key: "product" },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={statusColors[status]}>{status}</Tag>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: () => <Button type="text" icon={<MoreOutlined />} />,
  },
];

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="admin-dashboard-page">
      <DashboardStatsFeature />
      <Card className="chart-card">
        <div className="chart-header">
          <div>
            <Title level={5}>Số sản phẩm được cầm</Title>
          </div>
          <Space>
            <Tabs defaultValue="12">
              <TabPane tab="12 Months" key="12" />
              <TabPane tab="6 Months" key="6" />
              <TabPane tab="30 Days" key="30" />
              <TabPane tab="7 Days" key="7" />
            </Tabs>
            <Button icon={<ExportOutlined />}>Export PDF</Button>
          </Space>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="table-card">
        <div className="table-header">
          <Title level={5}>Những sản phẩm được cầm</Title>
          <Button type="link">Xem tất cả</Button>
        </div>
        <Table columns={columns} dataSource={tableData} pagination={false} />
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
