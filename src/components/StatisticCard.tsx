import { Card, Col, Statistic } from "antd";

export default function StatisticCard({
  title,
  value,
  prefix,
}: {
  title: string;
  value: number;
  prefix: React.ReactNode;
}) {
  return (
    <Col xs={24} sm={12} lg={8}>
      <Card>
        <Statistic title={title} value={value} prefix={prefix} />
      </Card>
    </Col>
  );
}
