"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Typography, Button, Select, Space, Card, Modal, Descriptions, message } from "antd";
import { formatCurrency } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { EyeOutlined, SyncOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      let url = `/api/v1/admin/orders?page=${page}&limit=10`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
        setTotal(json.meta?.total || 0);
      }
    } catch (e) {
      message.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const json = await res.json();
      if (json.success) {
        message.success(`Order status updated to ${nextStatus}`);
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(json.data);
        }
      } else {
        message.error(json.error?.message || "Status update failed");
      }
    } catch (e) {
      message.error("Network error updating order status");
    }
  };

  const columns = [
    {
      title: "Order No.",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text: string) => <Text strong copyable>{text}</Text>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: any) => (
        <div>
          <div>{record.user?.firstName} {record.user?.lastName}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.user?.email}</Text>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => new Date(d).toLocaleDateString("en-IN"),
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (val: any) => <Text strong>{formatCurrency(Number(val))}</Text>,
    },
    {
      title: "Fulfillment Status",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus, record: any) => (
        <Select
          value={status}
          style={{ width: 160 }}
          onChange={(val) => handleStatusChange(record.id, val)}
          options={[
            { value: "PENDING_PAYMENT", label: <Tag color="gold">Pending Payment</Tag> },
            { value: "CONFIRMED", label: <Tag color="green">Confirmed</Tag> },
            { value: "PROCESSING", label: <Tag color="blue">Processing</Tag> },
            { value: "PACKED", label: <Tag color="cyan">Packed</Tag> },
            { value: "SHIPPED", label: <Tag color="purple">Shipped</Tag> },
            { value: "DELIVERED", label: <Tag color="success">Delivered</Tag> },
            { value: "CANCELLED", label: <Tag color="error">Cancelled</Tag> },
          ]}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => setSelectedOrder(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Order Fulfillment Pipeline</Title>
          <Text type="secondary">Manage customer orders, track state machines, and view tax invoices.</Text>
        </div>

        <Space>
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 180 }}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            options={[
              { value: "CONFIRMED", label: "Confirmed" },
              { value: "PROCESSING", label: "Processing" },
              { value: "PACKED", label: "Packed" },
              { value: "SHIPPED", label: "Shipped" },
              { value: "DELIVERED", label: "Delivered" },
              { value: "CANCELLED", label: "Cancelled" },
            ]}
          />

          <Button icon={<SyncOutlined />} onClick={fetchOrders}>
            Refresh
          </Button>
        </Space>
      </div>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 10,
          total,
          onChange: (p) => setPage(p),
        }}
      />

      {/* Order Detail Inspection Modal */}
      {selectedOrder && (
        <Modal
          title={`Order Reference: ${selectedOrder.orderNumber}`}
          open={!!selectedOrder}
          onCancel={() => setSelectedOrder(null)}
          footer={[
            <Button key="close" type="primary" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>,
          ]}
          width={700}
        >
          <Descriptions bordered size="small" column={2} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Customer">
              {selectedOrder.user?.firstName} ({selectedOrder.user?.email})
            </Descriptions.Item>
            <Descriptions.Item label="Tax Invoice">
              {selectedOrder.invoice?.invoiceNumber || "Pending"}
            </Descriptions.Item>
            <Descriptions.Item label="Destination State">
              {selectedOrder.shippingAddress?.state} ({selectedOrder.shippingAddress?.city})
            </Descriptions.Item>
            <Descriptions.Item label="Current Status">
              <Tag color="blue">{selectedOrder.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Taxable Amount">
              {formatCurrency(Number(selectedOrder.taxableAmount))}
            </Descriptions.Item>
            <Descriptions.Item label="GST Total">
              {formatCurrency(Number(selectedOrder.totalTax))}
            </Descriptions.Item>
            <Descriptions.Item label="Grand Total" span={2}>
              <Text strong style={{ fontSize: 16 }}>
                {formatCurrency(Number(selectedOrder.grandTotal))}
              </Text>
            </Descriptions.Item>
          </Descriptions>

          <Title level={5} style={{ marginTop: 20 }}>Order Items</Title>
          <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: 12 }}>
            {selectedOrder.items?.map((item: any) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #fafafa",
                }}
              >
                <div>
                  <Text strong>{item.productTitle}</Text>
                  <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                    SKU: {item.sku} • {item.colorName} / {item.size} • Qty: {item.quantity} • HSN: {item.hsnCode}
                  </div>
                </div>
                <Text strong>{formatCurrency(Number(item.totalAmount))}</Text>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </Card>
  );
}
