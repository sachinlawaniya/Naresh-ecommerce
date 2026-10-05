"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  Select,
  Input,
  message,
  Alert,
} from "antd";
import { WarningOutlined, EditOutlined, SyncOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Adjustment Modal
  const [adjustModalItem, setAdjustModalItem] = useState<any | null>(null);
  const [form] = Form.useForm();

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      let url = `/api/v1/admin/inventory?page=${page}&limit=20`;
      if (lowStockOnly) url += `&lowStockOnly=true`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
        setTotal(json.meta?.total || 0);
      }
    } catch (e) {
      message.error("Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page, lowStockOnly]);

  const handleAdjustSubmit = async (values: any) => {
    try {
      const res = await fetch("/api/v1/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: adjustModalItem.variantId,
          warehouseId: adjustModalItem.warehouseId,
          adjustmentQuantity: values.adjustmentQuantity,
          reason: values.reason,
          notes: values.notes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        message.success("Stock adjusted and audit record logged");
        setAdjustModalItem(null);
        form.resetFields();
        fetchInventory();
      } else {
        message.error(json.error?.message || "Adjustment failed");
      }
    } catch (e) {
      message.error("Network error during adjustment");
    }
  };

  const columns = [
    {
      title: "SKU / Product",
      key: "sku",
      render: (_: any, record: any) => (
        <div>
          <Text strong copyable>{record.variant?.sku || "N/A"}</Text>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            {record.variant?.product?.title} ({record.variant?.colorName} / {record.variant?.size})
          </div>
        </div>
      ),
    },
    {
      title: "Warehouse",
      key: "warehouse",
      render: (_: any, record: any) => (
        <Tag color="geekblue">{record.warehouse?.name || "Main Hub"}</Tag>
      ),
    },
    {
      title: "On Hand",
      dataIndex: "quantityOnHand",
      key: "quantityOnHand",
      render: (val: number) => <Text strong>{val}</Text>,
    },
    {
      title: "Reserved (Locks)",
      dataIndex: "quantityReserved",
      key: "quantityReserved",
      render: (val: number) => <Text type="warning">{val}</Text>,
    },
    {
      title: "Available to Sell",
      key: "available",
      render: (_: any, record: any) => {
        const available = record.quantityOnHand - record.quantityReserved;
        const isLow = available <= record.lowStockAlert;
        return (
          <Tag color={isLow ? "red" : "green"} icon={isLow ? <WarningOutlined /> : undefined}>
            {available} Units
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            setAdjustModalItem(record);
            form.resetFields();
          }}
        >
          Adjust Stock
        </Button>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Warehouse Inventory & Stock Auditor</Title>
          <Text type="secondary">Monitor SKU levels, active reservation locks, and execute audited restocks.</Text>
        </div>

        <Space>
          <Button
            type={lowStockOnly ? "primary" : "default"}
            danger={lowStockOnly}
            onClick={() => {
              setLowStockOnly(!lowStockOnly);
              setPage(1);
            }}
          >
            {lowStockOnly ? "Showing Low Stock Only" : "Filter Low Stock"}
          </Button>

          <Button icon={<SyncOutlined />} onClick={fetchInventory}>
            Refresh
          </Button>
        </Space>
      </div>

      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 20,
          total,
          onChange: (p) => setPage(p),
        }}
      />

      {/* Stock Adjustment Modal */}
      {adjustModalItem && (
        <Modal
          title={`Adjust Stock: ${adjustModalItem.variant?.sku}`}
          open={!!adjustModalItem}
          onCancel={() => setAdjustModalItem(null)}
          footer={null}
        >
          <Alert
            message="Audit Compliance Notice"
            description="Every manual inventory change is permanently recorded in the immutable AuditLog ledger with your operator credentials."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form form={form} layout="vertical" onFinish={handleAdjustSubmit}>
            <Form.Item
              name="adjustmentQuantity"
              label="Adjustment Quantity (Use positive numbers to add, negative to remove)"
              rules={[{ required: true, message: "Please specify quantity adjustment" }]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="e.g. +50 or -5" />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Operational Audit Reason"
              rules={[{ required: true, message: "Please select reason" }]}
            >
              <Select
                placeholder="Select reason"
                options={[
                  { value: "RESTOCK_INWARD", label: "Restock Inward (New batch from factory)" },
                  { value: "STOCK_COUNT_AUDIT", label: "Physical Stock Count Audit" },
                  { value: "DAMAGED_DISPOSAL", label: "Damaged / Defective Write-off" },
                  { value: "RETURN_RESTOCK", label: "Customer Return Restock" },
                  { value: "SAMPLE_DISPATCH", label: "Marketing / Influencer Sample Dispatch" },
                ]}
              />
            </Form.Item>

            <Form.Item name="notes" label="Audit Notes (Optional)">
              <Input.TextArea rows={2} placeholder="Reference invoice or inspection report ID" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block style={{ marginTop: 12 }}>
              Execute Adjustment & Record Audit
            </Button>
          </Form>
        </Modal>
      )}
    </Card>
  );
}
