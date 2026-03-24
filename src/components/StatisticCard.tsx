// [UI ONLY] Redesigned StatisticCard with premium fintech aesthetic
import { Card, Statistic, theme, Flex } from "antd";

export default function StatisticCard({
    title,
    value,
    prefix
}: {
    title: string;
    value: number;
    prefix: React.ReactNode;
}) {
    const { token } = theme.useToken();

    return (
        <Card
            bordered={false}
            style={{
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                borderRadius: 16,
                height: "100%",
                overflow: "hidden"
            }}
            bodyStyle={{ padding: 24 }}
        >
            <Flex align="center" gap={16}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: token.colorPrimaryBg,
                        color: token.colorPrimary,
                        fontSize: 20
                    }}
                >
                    {prefix}
                </div>
                <Statistic
                    title={
                        <span style={{ color: token.colorTextSecondary, fontWeight: 500, fontSize: 13 }}>{title}</span>
                    }
                    value={value}
                    valueStyle={{ fontWeight: 700, fontSize: 24, letterSpacing: -0.5 }}
                />
            </Flex>
        </Card>
    );
}
