"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  DatePicker,
  Tabs,
  message,
} from "antd";
import { DownloadOutlined, SyncOutlined, FileTextOutlined } from "@ant-design/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function AdminGSTInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // GSTR-1 Period
  const [selectedPeriod, setSelectedPeriod] = useState<dayjs.Dayjs>(dayjs());
  const [gstr1Data, setGstr1Data] = useState<any | null>(null);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/v1/admin/gst/invoices?page=${page}&limit=15`);
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data);
        setTotal(json.meta?.total || 0);
      }
    } catch (e) {
      message.error("Failed to load GST invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGSTR1 = async (date: dayjs.Dayjs) => {
    try {
      const month = date.month() + 1;
      const year = date.year();
      const res = await fetch(`/api/v1/admin/gst/gstr1-summary?month=${month}&year=${year}`);
      const json = await res.json();
      if (json.success) {
        setGstr1Data(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch GSTR-1 summary", e);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchGSTR1(selectedPeriod);
  }, [page]);

  const handlePeriodChange = (date: any) => {
    if (date) {
      setSelectedPeriod(date);
      fetchGSTR1(date);
    }
  };

  const handleExportCSV = () => {
    if (!gstr1Data) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "State / Place of Supply,Is Interstate,Invoice Count,Taxable Amount (INR),CGST (INR),SGST (INR),IGST (INR),Total GST Tax (INR)\n";

    gstr1Data.placeOfSupplySummary?.forEach((row: any) => {
      csvContent += `"${row.state}","${row.isInterState ? "Yes" : "No"}",${row.invoiceCount},${row.taxableAmount},${row.cgst},${row.sgst},${row.igst},${row.totalTax}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GSTR1_Report_${gstr1Data.period.replace("/", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const invoiceColumns = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (num: string) => <Tag color="geekblue" style={{ fontWeight: 700 }}>{num}</Tag>,
    },
    {
      title: "Order Ref",
      key: "orderNumber",
      render: (_: any, record: any) => <Text strong>{record.order?.orderNumber}</Text>,
    },
    {
      title: "Place of Supply",
      dataIndex: "placeOfSupply",
      key: "placeOfSupply",
      render: (state: string) => <Tag color="blue">{state}</Tag>,
    },
    {
      title: "Taxable Value",
      key: "taxable",
      render: (_: any, record: any) => formatCurrency(Number(record.order?.taxableAmount || 0)),
    },
    {
      title: "Total GST Tax",
      key: "tax",
      render: (_: any, record: any) => (
        <Text type="secondary">{formatCurrency(Number(record.order?.totalTax || 0))}</Text>
      ),
    },
    {
      title: "Invoice Total",
      key: "total",
      render: (_: any, record: any) => (
        <Text strong>{formatCurrency(Number(record.order?.grandTotal || 0))}</Text>
      ),
    },
    {
      title: "Issued On",
      dataIndex: "issuedAt",
      key: "issuedAt",
      render: (d: string) => new Date(d).toLocaleDateString("en-IN"),
    },
  ];

  const stateColumns = [
    {
      title: "Place of Supply (State)",
      dataIndex: "state",
      key: "state",
      render: (s: string) => <Text strong>{s}</Text>,
    },
    {
      title: "Supply Type",
      dataIndex: "isInterState",
      key: "isInterState",
      render: (inter: boolean) => (
        <Tag color={inter ? "purple" : "cyan"}>{inter ? "Interstate (IGST)" : "Intrastate (CGST+SGST)"}</Tag>
      ),
    },
    {
      title: "Invoices",
      dataIndex: "invoiceCount",
      key: "invoiceCount",
    },
    {
      title: "Taxable Turnover",
      dataIndex: "taxableAmount",
      key: "taxableAmount",
      render: (val: number) => formatCurrency(val),
    },
    {
      title: "CGST",
      dataIndex: "cgst",
      key: "cgst",
      render: (val: number) => formatCurrency(val),
    },
    {
      title: "SGST",
      dataIndex: "sgst",
      key: "sgst",
      render: (val: number) => formatCurrency(val),
    },
    {
      title: "IGST",
      dataIndex: "igst",
      key: "igst",
      render: (val: number) => formatCurrency(val),
    },
    {
      title: "Total GST Liability",
      dataIndex: "totalTax",
      key: "totalTax",
      render: (val: number) => <Text strong>{formatCurrency(val)}</Text>,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>GST Invoicing & Statutory Return Reporting</Title>
          <Text type="secondary">Compliant B2C/B2B GSTR-1 summaries, sequential tax invoices, and accounting exports.</Text>
        </div>

        <Space>
          <DatePicker
            picker="month"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            allowClear={false}
          />

          <Button icon={<DownloadOutlined />} type="primary" onClick={handleExportCSV}>
            Export GSTR-1 CSV
          </Button>
        </Space>
      </div>

      {/* KPI Cards for Period */}
      {gstr1Data && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false}>
              <Statistic
                title={`Gross Turnover (${gstr1Data.period})`}
                value={gstr1Data.totalGrossTurnover}
                precision={2}
                prefix="₹"
                valueStyle={{ color: "#0f172a", fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false}>
              <Statistic
                title="Taxable Amount Base"
                value={gstr1Data.totalTaxableAmount}
                precision={2}
                prefix="₹"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false}>
              <Statistic
                title="Total GST Collected"
                value={gstr1Data.totalTaxLiability}
                precision={2}
                prefix="₹"
                valueStyle={{ color: "#10b981", fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false}>
              <Statistic
                title="Total Tax Invoices Issued"
                value={gstr1Data.totalInvoicesIssued}
                valueStyle={{ color: "#6366f1", fontWeight: 700 }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabs for Invoices vs State-wise GSTR-1 */}
      <Card bordered={false}>
        <Tabs
          defaultActiveKey="invoices"
          items={[
            {
              key: "invoices",
              label: "Sequential Tax Invoices Ledger",
              children: (
                <Table
                  dataSource={invoices}
                  columns={invoiceColumns}
                  rowKey="id"
                  loading={isLoading}
                  pagination={{
                    current: page,
                    pageSize: 15,
                    total,
                    onChange: (p) => setPage(p),
                  }}
                />
              ),
            },
            {
              key: "gstr1",
              label: "GSTR-1 Place of Supply Aggregation",
              children: (
                <Table
                  dataSource={gstr1Data?.placeOfSupplySummary || []}
                  columns={stateColumns}
                  rowKey="state"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
