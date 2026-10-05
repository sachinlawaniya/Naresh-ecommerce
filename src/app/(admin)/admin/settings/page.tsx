"use client";

import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Divider, Select, Switch, message, Alert } from "antd";
import { env } from "@/config/env";
import { SaveOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminSettingsPage() {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (values: any) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      message.success("Store configuration and statutory GST settings saved");
    }, 600);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <Card bordered={false}>
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>Store Identity & Statutory Settings</Title>
          <Text type="secondary">Manage your business details, statutory GST registration, and order policies.</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            storeName: env.NEXT_PUBLIC_STORE_NAME,
            currency: env.NEXT_PUBLIC_STORE_CURRENCY,
            gstin: env.STORE_GSTIN,
            originState: env.STORE_ORIGIN_STATE,
            supportEmail: env.EMAIL_FROM,
            defaultHsn: "61091000",
            returnWindowDays: 7,
            enableCod: false,
          }}
        >
          <Title level={5}>General Brand Identity</Title>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="storeName" label="Storefront Brand Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="currency" label="Default Currency" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </div>

          <Form.Item name="supportEmail" label="Official Transactional & Support Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          <Divider />

          <Title level={5} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SafetyCertificateOutlined style={{ color: "#10b981" }} />
            <span>Statutory Goods & Services Tax (GST) Configuration</span>
          </Title>

          <Alert
            message="GST Origin Notice"
            description="All orders delivered inside the Operating Origin State are automatically split into Intrastate CGST + SGST (50/50). Deliveries outside this state are charged as Interstate IGST."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item
              name="gstin"
              label="Registered Business GSTIN"
              rules={[{ required: true, message: "GSTIN is mandatory" }]}
            >
              <Input placeholder="29AAAAA0000A1Z5" />
            </Form.Item>

            <Form.Item
              name="originState"
              label="Operating Origin State (Warehouse Hub)"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "Karnataka", label: "Karnataka (KA)" },
                  { value: "Maharashtra", label: "Maharashtra (MH)" },
                  { value: "Delhi", label: "Delhi (DL)" },
                  { value: "Tamil Nadu", label: "Tamil Nadu (TN)" },
                  { value: "Gujarat", label: "Gujarat (GJ)" },
                  { value: "Uttar Pradesh", label: "Uttar Pradesh (UP)" },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item name="defaultHsn" label="Default Apparel HSN Code" rules={[{ required: true }]}>
            <Input placeholder="61091000" />
          </Form.Item>

          <Divider />

          <Title level={5}>Fulfillment & Return Policy</Title>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="returnWindowDays" label="Customer Exchange & Return Window (Days)">
              <Input type="number" />
            </Form.Item>

            <Form.Item name="enableCod" label="Enable Cash on Delivery (COD)" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSaving} style={{ marginTop: 16 }}>
            Save Store Settings
          </Button>
        </Form>
      </Card>
    </div>
  );
}
