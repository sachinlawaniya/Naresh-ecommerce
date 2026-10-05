import React from "react";
import { adminOrderService } from "@/modules/order/services/admin-order.service";
import { inventoryService } from "@/modules/inventory/services/inventory.service";
import { formatCurrency } from "@/lib/utils";
import { Card, Row, Col, Statistic, Table, Tag, Typography, Button, Space, Alert } from "antd";
import {
  DollarCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
  WarningOutlined,
  ArrowRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Text } = Typography;

export default async function AdminDashboardPage() {
  let analytics = {
    totalRevenue: 0,
    totalTaxCollected: 0,
    totalOrders: 0,
    confirmedOrdersCount: 0,
    averageOrderValue: 0,
    lowStockCount: 0,
    totalCustomers: 0,
  };

  let recentOrders: any[] = [];
  let lowStockItems: any[] = [];

  try {
    const [analyticsData, ordersData, inventoryData] = await Promise.all([
      adminOrderService.getDashboardAnalytics(),
      adminOrderService.listOrders({ page: 1, limit: 5 }),
      inventoryService.listInventory({ page: 1, limit: 5, lowStockOnly: true }),
    ]);

    analytics = analyticsData;
    recentOrders = ordersData.orders;
    lowStockItems = inventoryData.items;
  } catch (err) {
    console.error("Could not load admin dashboard analytics", err);
  }

  const orderColumns = [
    {
      title: "Order No.",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: any) => (
        <span>{record.user?.firstName || "Guest"} ({record.user?.email || "N/A"})</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (val: any) => <Text strong>{formatCurrency(Number(val))}</Text>,
    },
    {
      title: "GST Tax",
      dataIndex: "totalTax",
      key: "totalTax",
      render: (val: any) => <Text type="secondary">{formatCurrency(Number(val))}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "CONFIRMED") color = "green";
        if (status === "PENDING_PAYMENT") color = "gold";
        if (status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Operational Control Center</Title>
          <Text type="secondary">Real-time revenue metrics, order velocity, and warehouse alerts.</Text>
        </div>

        <Space>
          <Link href="/admin/products">
            <Button type="primary" icon={<PlusOutlined />}>
              Create Product & Matrix
            </Button>
          </Link>
        </Space>
      </div>

      {/* Low stock alert banner */}
      {analytics.lowStockCount > 0 && (
        <Alert
          message={`${analytics.lowStockCount} Variant SKUs are below critical threshold (<= 5 units remaining)`}
          type="warning"
          showIcon
          action={
            <Link href="/admin/inventory">
              <Button size="small" type="primary" ghost>
                Review Inventory
              </Button>
            </Link>
          }
        />
      )}

      {/* KPI Statistic Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
            <Statistic
              title="Gross Revenue (Captured)"
              value={analytics.totalRevenue}
              precision={2}
              prefix="₹"
              valueStyle={{ color: "#0f172a", fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
            <Statistic
              title="Average Order Value (AOV)"
              value={analytics.averageOrderValue}
              precision={2}
              prefix="₹"
              valueStyle={{ color: "#10b981", fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
            <Statistic
              title="GST Liability Collected"
              value={analytics.totalTaxCollected}
              precision={2}
              prefix="₹"
              valueStyle={{ color: "#6366f1", fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
            <Statistic
              title="Active Customers"
              value={analytics.totalCustomers}
              valueStyle={{ color: "#0f172a", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Card
        title="Recent Storefront Orders"
        extra={
          <Link href="/admin/orders">
            <Button type="link" icon={<ArrowRightOutlined />}>
              View All Orders
            </Button>
          </Link>
        }
        bordered={false}
      >
        <Table
          dataSource={recentOrders}
          columns={orderColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
