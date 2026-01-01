import statisticApi from "@/api/statisticApi";
import StatisticCard from "@/components/StatisticCard";
import { Statistic } from "@/type/statistic.type";
import {
  DesktopOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Row } from "antd";

const STATISTICS_QUERY_KEY = ["statistics"];

export default function DashboardStatsFeature({
  rowClassName,
}: {
  rowClassName?: string;
}) {
  const { data } = useQuery<Statistic>({
    queryKey: STATISTICS_QUERY_KEY,
    queryFn: statisticApi.getStatistics,
    retry: 1,
  });

  return (
    <Row gutter={[24, 24]} className={rowClassName ?? "stats-cards"}>
      <StatisticCard
        title="Tổng khách"
        value={data?.numberOfUser ?? 0}
        prefix={<UsergroupAddOutlined />}
      />
      <StatisticCard
        title="Tổng sản phẩm"
        value={data?.numberOfProduct ?? 0}
        prefix={<ShoppingOutlined />}
      />
      <StatisticCard
        title="Tài khoản hoạt động"
        value={data?.numberOfUserActive ?? 0}
        prefix={<DesktopOutlined />}
      />
    </Row>
  );
}
