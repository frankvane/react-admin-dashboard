import { Area, Column, Line } from "@ant-design/plots";
import {
  AreaChartOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  ChartDataItem,
  DashboardStatistics,
  SalesProportionItem,
} from "../../types";
import React, { useEffect, useState } from "react";

import { mockApi } from "../../services/api";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // 状态
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(
    null
  );
  const [salesProportionData, setSalesProportionData] = useState<
    SalesProportionItem[]
  >([]);

  // 图表数据
  const trafficPaymentsData: ChartDataItem[] = [
    { month: "1月", Traffic: 50, Payments: 30 },
    { month: "2月", Traffic: 60, Payments: 80 },
    { month: "3月", Traffic: 40, Payments: 40 },
    { month: "4月", Traffic: 110, Payments: 35 },
    { month: "5月", Traffic: 70, Payments: 50 },
    { month: "6月", Traffic: 30, Payments: 60 },
    { month: "7月", Traffic: 80, Payments: 35 },
    { month: "8月", Traffic: 35, Payments: 110 },
    { month: "9月", Traffic: 80, Payments: 80 },
    { month: "10月", Traffic: 105, Payments: 60 },
    { month: "11月", Traffic: 30, Payments: 120 },
    { month: "12月", Traffic: 50, Payments: 50 },
  ];

  // 访问量数据
  const visitsData: ChartDataItem[] = [
    { month: "1月", visits: 3500 },
    { month: "2月", visits: 4500 },
    { month: "3月", visits: 3800 },
    { month: "4月", visits: 5000 },
    { month: "5月", visits: 4800 },
    { month: "6月", visits: 5200 },
    { month: "7月", visits: 5800 },
    { month: "8月", visits: 6000 },
    { month: "9月", visits: 5500 },
    { month: "10月", visits: 6200 },
    { month: "11月", visits: 6800 },
    { month: "12月", visits: 7000 },
  ];

  // 支付数据
  const paymentsData: ChartDataItem[] = [
    { month: "1月", value: 800 },
    { month: "2月", value: 900 },
    { month: "3月", value: 300 },
    { month: "4月", value: 500 },
    { month: "5月", value: 1200 },
    { month: "6月", value: 600 },
    { month: "7月", value: 700 },
    { month: "8月", value: 400 },
    { month: "9月", value: 900 },
    { month: "10月", value: 1000 },
    { month: "11月", value: 800 },
    { month: "12月", value: 700 },
  ];

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取统计数据
        const statsResponse = await mockApi.getStatistics();
        if (statsResponse.success) {
          setStatistics(statsResponse.data);
        }

        // 获取销售比例数据
        const proportionResponse = await mockApi.getSalesProportionData();
        if (proportionResponse.success) {
          setSalesProportionData(proportionResponse.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 销售比例柱状图配置 (替代饼图)
  const salesColumnConfig = {
    data: salesProportionData,
    xField: 'type',
    yField: 'value',
    color: ({ type }) => {
      const colorMap = {
        appliances: '#1890ff',
        drinks: '#52c41a',
        health: '#faad14',
        clothing: '#f5222d',
        baby: '#eb2f96',
        default: '#722ed1'
      };
      return colorMap[type] || colorMap.default;
    },
    label: {
      position: 'top',
      content: (data) => `${data.value}`,
    },
    xAxis: {
      label: {
        autoRotate: true,
      },
    },
  };

  // 折线图配置
  const lineConfig = {
    data: trafficPaymentsData,
    xField: "month",
    yField: ["Traffic", "Payments"],
    seriesField: "type",
    smooth: true,
    legend: {
      position: "top",
    },
    point: {
      size: 5,
      shape: "circle",
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: "#eee",
            lineDash: [4, 4],
          },
        },
      },
    },
  };

  // 面积图配置
  const areaConfig = {
    data: visitsData,
    xField: "month",
    yField: "visits",
    smooth: true,
    areaStyle: {
      fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
    },
  };

  // 柱状图配置
  const columnConfig = {
    data: paymentsData,
    xField: "month",
    yField: "value",
    color: "#1890ff",
    label: {
      position: "top",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
  };

  if (loading || !statistics) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 0 }}>
      <Row gutter={[16, 16]}>
        {/* 总销售额 */}
        <Col xs={24} sm={12} md={6}>
          <Card
            variant="borderless"
            style={{ borderRadius: 4 }}
            loading={loading}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space align="center">
                <Text type="secondary">总销售额</Text>
                <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
              </Space>
              <Title level={3} style={{ margin: "8px 0" }}>
                ¥ {statistics.sales.toLocaleString()}
              </Title>
              <Space
                align="center"
                style={{ justifyContent: "space-between", width: "100%" }}
              >
                <Space>
                  <Text>周同比</Text>
                  <Text type="danger">
                    12% <ArrowUpOutlined />
                  </Text>
                </Space>
                <Space>
                  <Text>日环比</Text>
                  <Text type="success">
                    12% <ArrowDownOutlined />
                  </Text>
                </Space>
              </Space>
              <Divider style={{ margin: "12px 0" }} />
              <Text type="secondary">
                日销售额 ¥{statistics.dailySales.toLocaleString()}
              </Text>
            </Space>
          </Card>
        </Col>

        {/* 访问量 */}
        <Col xs={24} sm={12} md={6}>
          <Card
            variant="borderless"
            style={{ borderRadius: 4 }}
            loading={loading}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space align="center">
                <Text type="secondary">访问量</Text>
                <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
              </Space>
              <Title level={3} style={{ margin: "8px 0" }}>
                {statistics.visits.toLocaleString()}
              </Title>
              <div style={{ height: 46 }}>
                <Area {...areaConfig} height={46} autoFit={true} padding={0} />
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <Text type="secondary">
                日访问量 {statistics.dailyVisits.toLocaleString()}
              </Text>
            </Space>
          </Card>
        </Col>

        {/* 支付笔数 */}
        <Col xs={24} sm={12} md={6}>
          <Card
            variant="borderless"
            style={{ borderRadius: 4 }}
            loading={loading}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space align="center">
                <Text type="secondary">支付笔数</Text>
                <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
              </Space>
              <Title level={3} style={{ margin: "8px 0" }}>
                {statistics.payments.toLocaleString()}
              </Title>
              <div style={{ height: 46 }}>
                <Column
                  {...columnConfig}
                  height={46}
                  autoFit={true}
                  padding={0}
                />
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <Text type="secondary">转化率 {statistics.conversionRate}%</Text>
            </Space>
          </Card>
        </Col>

        {/* 运营效果 */}
        <Col xs={24} sm={12} md={6}>
          <Card
            variant="borderless"
            style={{ borderRadius: 4 }}
            loading={loading}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space align="center">
                <Text type="secondary">运营效果</Text>
                <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
              </Space>
              <Title level={3} style={{ margin: "8px 0" }}>
                {statistics.operations.toLocaleString()}
              </Title>
              <Progress percent={85} showInfo={false} strokeColor="#5AD8A6" />
              <Space
                align="center"
                style={{
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: 8,
                }}
              >
                <Space>
                  <Text>周同比</Text>
                  <Text type="danger">
                    12% <ArrowUpOutlined />
                  </Text>
                </Space>
                <Space>
                  <Text>日环比</Text>
                  <Text type="success">
                    12% <ArrowDownOutlined />
                  </Text>
                </Space>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 销售比例 - 使用柱状图替代饼图 */}
      <Card
        title="销售比例"
        style={{ marginTop: 16, borderRadius: 4 }}
        variant="borderless"
        loading={loading}
        extra={
          <Space>
            <Button type="primary" size="small">
              全部
            </Button>
            <Button size="small">线上</Button>
            <Button size="small">线下</Button>
          </Space>
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Column {...salesColumnConfig} height={300} />
          </Col>
          <Col span={12}>
            <List
              size="small"
              dataSource={salesProportionData}
              renderItem={(item) => (
                <List.Item>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Space>
                      <Tag
                        color={
                          item.type === "appliances"
                            ? "blue"
                            : item.type === "drinks"
                            ? "green"
                            : item.type === "health"
                            ? "gold"
                            : item.type === "clothing"
                            ? "red"
                            : item.type === "baby"
                            ? "pink"
                            : "purple"
                        }
                      />
                      <Text>{item.type}</Text>
                    </Space>
                    <Space>
                      <Text>{item.value}</Text>
                      <Text type="secondary">
                        {item.percentage.toFixed(2)}%
                      </Text>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>

      {/* 流量与支付 */}
      <Card
        title={
          <Space>
            <AreaChartOutlined />
            <span>流量与支付</span>
          </Space>
        }
        style={{ marginTop: 16, borderRadius: 4 }}
        variant="borderless"
        loading={loading}
      >
        <Line {...lineConfig} height={400} />
      </Card>
    </div>
  );
};

export default Dashboard;