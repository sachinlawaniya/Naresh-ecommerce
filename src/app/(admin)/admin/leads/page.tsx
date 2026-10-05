"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  Space,
  Tag,
  Drawer,
  Form,
  Input,
  Select,
  Timeline,
  message,
} from "antd";
import { PhoneOutlined, MessageOutlined, MailOutlined, EditOutlined, SyncOutlined } from "@ant-design/icons";
import { LeadStatus, LeadSource } from "@prisma/client";

const { Title, Text } = Typography;

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [sourceFilter, setSourceFilter] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Activity Drawer
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [form] = Form.useForm();

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      let url = `/api/v1/admin/leads?page=${page}&limit=15`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (sourceFilter) url += `&source=${sourceFilter}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setLeads(json.data);
        setTotal(json.meta?.total || 0);
      }
    } catch (e) {
      message.error("Failed to load CRM leads");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter, sourceFilter]);

  const handleStatusChange = async (leadId: string, nextStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/v1/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const json = await res.json();
      if (json.success) {
        message.success(`Lead stage updated to ${nextStatus}`);
        fetchLeads();
      } else {
        message.error(json.error?.message || "Status update failed");
      }
    } catch (e) {
      message.error("Network error updating status");
    }
  };

  const handleAddActivity = async (values: any) => {
    try {
      const res = await fetch(`/api/v1/admin/leads/${selectedLead.id}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json = await res.json();
      if (json.success) {
        message.success("Activity logged to customer timeline");
        form.resetFields();
        fetchLeads();
        // Update local drawer activity state
        setSelectedLead({
          ...selectedLead,
          activities: [json.data, ...(selectedLead.activities || [])],
        });
      }
    } catch (e) {
      message.error("Network error logging activity");
    }
  };

  const columns = [
    {
      title: "Contact / Lead",
      key: "contact",
      render: (_: any, record: any) => (
        <div>
          <Text strong>{record.name || "Subscriber"}</Text>
          <div><Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text></div>
          {record.phone && <div style={{ fontSize: 12, color: "#10b981" }}>📞 {record.phone}</div>}
        </div>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (source: LeadSource) => {
        let color = "blue";
        if (source === "ABANDONED_CART") color = "volcano";
        if (source === "WEBSITE_SIGNUP") color = "cyan";
        return <Tag color={color}>{source}</Tag>;
      },
    },
    {
      title: "Lead Stage",
      dataIndex: "status",
      key: "status",
      render: (status: LeadStatus, record: any) => (
        <Select
          value={status}
          style={{ width: 160 }}
          onChange={(val) => handleStatusChange(record.id, val)}
          options={[
            { value: "NEW", label: <Tag color="blue">New Lead</Tag> },
            { value: "CONTACTED", label: <Tag color="gold">Contacted</Tag> },
            { value: "CART_ABANDONED", label: <Tag color="volcano">Abandoned Cart</Tag> },
            { value: "CONVERTED", label: <Tag color="green">Converted (Paid)</Tag> },
            { value: "LOST", label: <Tag color="default">Lost</Tag> },
          ]}
        />
      ),
    },
    {
      title: "Captured On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => new Date(d).toLocaleDateString("en-IN"),
    },
    {
      title: "Timeline & Notes",
      key: "timeline",
      render: (_: any, record: any) => (
        <Button
          icon={<EditOutlined />}
          size="small"
          onClick={() => setSelectedLead(record)}
        >
          {record.activities?.length ? `${record.activities.length} Logs` : "Add Activity"}
        </Button>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Customer Relationship Management (CRM)</Title>
          <Text type="secondary">Recover abandoned carts, manage marketing leads, and log interaction timelines.</Text>
        </div>

        <Space>
          <Select
            placeholder="Filter Source"
            allowClear
            style={{ width: 160 }}
            onChange={(val) => {
              setSourceFilter(val);
              setPage(1);
            }}
            options={[
              { value: "ABANDONED_CART", label: "Abandoned Cart" },
              { value: "WEBSITE_SIGNUP", label: "Website Signup" },
              { value: "NEWSLETTER", label: "Newsletter" },
            ]}
          />

          <Button icon={<SyncOutlined />} onClick={fetchLeads}>
            Refresh
          </Button>
        </Space>
      </div>

      <Table
        dataSource={leads}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 15,
          total,
          onChange: (p) => setPage(p),
        }}
      />

      {/* Activity Timeline Drawer */}
      {selectedLead && (
        <Drawer
          title={`Lead Timeline: ${selectedLead.name || selectedLead.email}`}
          open={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          width={450}
        >
          <Form form={form} layout="vertical" onFinish={handleAddActivity}>
            <Form.Item
              name="activityType"
              label="Activity Type"
              initialValue="WHATSAPP"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "WHATSAPP", label: "WhatsApp Recovery Message" },
                  { value: "CALL", label: "Phone Call Discussion" },
                  { value: "EMAIL_SENT", label: "Email Sent" },
                  { value: "NOTE", label: "Internal Customer Note" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="note"
              label="Notes & Remarks"
              rules={[{ required: true, message: "Please enter note" }]}
            >
              <Input.TextArea rows={2} placeholder="Shared 10% personalized discount code..." />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Log Activity
            </Button>
          </Form>

          <Title level={5} style={{ marginTop: 28, marginBottom: 16 }}>Activity Timeline</Title>
          <Timeline
            items={selectedLead.activities?.map((act: any) => ({
              children: (
                <div>
                  <Tag color="cyan">{act.activityType}</Tag>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{act.note}</div>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {new Date(act.createdAt).toLocaleString("en-IN")}
                  </Text>
                </div>
              ),
            })) || []}
          />
        </Drawer>
      )}
    </Card>
  );
}
