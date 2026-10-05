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
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  message,
} from "antd";
import { PlusOutlined, SyncOutlined, PercentageOutlined } from "@ant-design/icons";
import { formatCurrency } from "@/lib/utils";

const { Title, Text } = Typography;

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/admin/coupons");
      const json = await res.json();
      if (json.success) {
        setCoupons(json.data);
      }
    } catch (e) {
      message.error("Failed to load coupons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (values: any) => {
    try {
      const dates = values.dateRange;
      const payload = {
        code: values.code.toUpperCase(),
        discountType: values.discountType,
        discountValue: Number(values.discountValue),
        minOrderValue: Number(values.minOrderValue || 0),
        maxDiscount: values.maxDiscount ? Number(values.maxDiscount) : null,
        usageLimit: values.usageLimit ? Number(values.usageLimit) : null,
        startDate: dates[0].toISOString(),
        endDate: dates[1].toISOString(),
        isActive: values.isActive !== undefined ? values.isActive : true,
      };

      const res = await fetch("/api/v1/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        message.success("Coupon code created successfully");
        setIsModalOpen(false);
        form.resetFields();
        fetchCoupons();
      } else {
        message.error(json.error?.message || "Failed to create coupon");
      }
    } catch (e) {
      message.error("Network error creating coupon");
    }
  };

  const columns = [
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <Tag color="geekblue" style={{ fontSize: 13, fontWeight: 700 }}>{code}</Tag>,
    },
    {
      title: "Discount",
      key: "discount",
      render: (_: any, record: any) => (
        <Text strong>
          {record.discountType === "PERCENTAGE"
            ? `${record.discountValue}% OFF`
            : formatCurrency(Number(record.discountValue))}
        </Text>
      ),
    },
    {
      title: "Min. Order",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      render: (val: any) => formatCurrency(Number(val)),
    },
    {
      title: "Max. Cap",
      dataIndex: "maxDiscount",
      key: "maxDiscount",
      render: (val: any) => (val ? formatCurrency(Number(val)) : "No Cap"),
    },
    {
      title: "Redemptions",
      key: "usage",
      render: (_: any, record: any) => (
        <span>
          {record.usageCount} {record.usageLimit ? `/ ${record.usageLimit}` : "used"}
        </span>
      ),
    },
    {
      title: "Valid Until",
      dataIndex: "endDate",
      key: "endDate",
      render: (d: string) => new Date(d).toLocaleDateString("en-IN"),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "default"}>{active ? "Active" : "Inactive"}</Tag>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Coupon & Discount Engine</Title>
          <Text type="secondary">Create promotional campaigns, usage caps, and minimum order rules.</Text>
        </div>

        <Space>
          <Button icon={<SyncOutlined />} onClick={fetchCoupons}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Create Promo Coupon
          </Button>
        </Space>
      </div>

      <Table dataSource={coupons} columns={columns} rowKey="id" loading={isLoading} />

      {/* Coupon Modal */}
      <Modal
        title="Create Promotional Coupon"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateCoupon}>
          <Form.Item
            name="code"
            label="Coupon Code (e.g. FESTIVE20)"
            rules={[{ required: true, message: "Code required" }]}
          >
            <Input placeholder="VOGUE20" />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item
              name="discountType"
              label="Type"
              initialValue="PERCENTAGE"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "PERCENTAGE", label: "Percentage (%)" },
                  { value: "FLAT_AMOUNT", label: "Flat Amount (₹)" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="discountValue"
              label="Value"
              rules={[{ required: true, message: "Value required" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} placeholder="20" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="minOrderValue" label="Min. Cart Value (₹)" initialValue={999}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item name="maxDiscount" label="Max. Discount Cap (₹, Optional)">
              <InputNumber style={{ width: "100%" }} min={1} placeholder="500" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="usageLimit" label="Max Redemptions (Optional)">
              <InputNumber style={{ width: "100%" }} min={1} placeholder="1000" />
            </Form.Item>

            <Form.Item name="isActive" label="Active Status" valuePropName="checked" initialValue={true}>
              <Switch />
            </Form.Item>
          </div>

          <Form.Item
            name="dateRange"
            label="Validity Date Range"
            rules={[{ required: true, message: "Select date range" }]}
          >
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block style={{ marginTop: 12 }}>
            Save & Activate Coupon
          </Button>
        </Form>
      </Modal>
    </Card>
  );
}
