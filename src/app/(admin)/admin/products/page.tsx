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
  InputNumber,
  Select,
  Switch,
  message,
  Divider,
} from "antd";
import { PlusOutlined, SyncOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { formatCurrency } from "@/lib/utils";

const { Title, Text } = Typography;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSeedApparel = async () => {
    try {
      setIsSeeding(true);
      const res = await fetch("/api/v1/admin/catalog/seed-apparel", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        message.success(
          `Apparel Catalog Seeded: ${json.data.productsCount} Products & ${json.data.totalSkusGenerated} SKUs (T-Shirts, Lowers, Trousers, Pants)`
        );
        fetchCatalog();
      } else {
        message.error(json.error?.message || "Seeding failed");
      }
    } catch (e) {
      message.error("Network error seeding catalog");
    } finally {
      setIsSeeding(false);
    }
  };

  const fetchCatalog = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/v1/catalog/products?limit=50"),
        fetch("/api/v1/catalog/categories"),
      ]);

      const prodJson = await prodRes.json();
      const catJson = await catRes.json();

      if (prodJson.success) setProducts(prodJson.data);
      if (catJson.success) setCategories(catJson.data);
    } catch (e) {
      message.error("Failed to load catalog");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleCreateProduct = async (values: any) => {
    try {
      // Build auto variant matrix from entered colors & sizes
      const colors = values.colors || ["Black"];
      const sizes = values.sizes || ["S", "M", "L", "XL"];
      const basePrice = Number(values.basePrice);

      const variants = [];
      for (const color of colors) {
        for (const size of sizes) {
          variants.push({
            colorName: color,
            colorHex: color.toLowerCase() === "white" ? "#ffffff" : color.toLowerCase() === "black" ? "#000000" : "#3b82f6",
            size: size,
            basePrice,
            salePrice: values.salePrice ? Number(values.salePrice) : null,
            weightGrams: 280,
            imageUrls: values.imageUrl ? [values.imageUrl] : [],
            initialStock: 25,
          });
        }
      }

      const payload = {
        title: values.title,
        slug: values.slug || values.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: values.description,
        categoryId: values.categoryId,
        hsnCode: values.hsnCode || "61091000",
        gstRate: Number(values.gstRate || 5.0),
        isPublished: values.isPublished !== undefined ? values.isPublished : true,
        isFeatured: values.isFeatured || false,
        variants,
      };

      const res = await fetch("/api/v1/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        message.success("Product and Variant Matrix created successfully!");
        setIsDrawerOpen(false);
        form.resetFields();
        fetchCatalog();
      } else {
        message.error(json.error?.message || "Failed to create product");
      }
    } catch (e) {
      message.error("Network error creating product");
    }
  };

  const columns = [
    {
      title: "Product Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div>
          <Text strong>{text}</Text>
          <div style={{ fontSize: 11, color: "#8c8c8c" }}>Slug: {record.slug}</div>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      render: (_: any, record: any) => (
        <Tag color="blue">{record.category?.name || "Apparel"}</Tag>
      ),
    },
    {
      title: "Variant SKUs",
      key: "variants",
      render: (_: any, record: any) => (
        <Tag color="cyan">{record.variants?.length || 0} SKUs Generated</Tag>
      ),
    },
    {
      title: "Base Price",
      key: "price",
      render: (_: any, record: any) => {
        const price = record.variants?.[0]?.basePrice || 0;
        return <Text strong>{formatCurrency(Number(price))}</Text>;
      },
    },
    {
      title: "HSN / GST",
      key: "hsn",
      render: (_: any, record: any) => (
        <span style={{ fontSize: 12 }}>
          {record.hsnCode} ({Number(record.gstRate)}% GST)
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? "green" : "default"}>
          {isPublished ? "Published" : "Draft"}
        </Tag>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Product Catalog & SKU Matrix</Title>
          <Text type="secondary">Create apparel lines, generate Cartesian variant matrices, and configure HSN taxation.</Text>
        </div>

        <Space>
          <Button
            icon={<CloudDownloadOutlined />}
            loading={isSeeding}
            onClick={handleSeedApparel}
          >
            Seed Apparel (T-Shirts, Lowers, Trousers, Pants)
          </Button>
          <Button icon={<SyncOutlined />} onClick={fetchCatalog}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>
            Add Product & Matrix
          </Button>
        </Space>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />

      {/* Product Creation Drawer */}
      <Drawer
        title="Create New Product & Automated Variant Matrix"
        width={560}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateProduct}>
          <Form.Item
            name="title"
            label="Product Title"
            rules={[{ required: true, message: "Please enter product title" }]}
          >
            <Input placeholder="e.g. Heavyweight Boxy Tee" />
          </Form.Item>

          <Form.Item name="slug" label="URL Slug (Optional - Auto generated if left blank)">
            <Input placeholder="e.g. heavyweight-boxy-tee" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select placeholder="Select category">
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description & Narrative"
            rules={[{ required: true, message: "Description required" }]}
          >
            <Input.TextArea rows={3} placeholder="Crafted with 280 GSM French Terry..." />
          </Form.Item>

          <Form.Item name="imageUrl" label="Primary Image URL">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <Divider style={{ margin: "16px 0" }}>Pricing & Taxation</Divider>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item
              name="basePrice"
              label="Base Price (₹)"
              rules={[{ required: true, message: "Price required" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} placeholder="999" />
            </Form.Item>

            <Form.Item name="salePrice" label="Sale Price (₹, Optional)">
              <InputNumber style={{ width: "100%" }} min={1} placeholder="799" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="hsnCode" label="HSN Code" initialValue="61091000">
              <Input placeholder="61091000" />
            </Form.Item>

            <Form.Item name="gstRate" label="GST Rate (%)" initialValue={5}>
              <Select
                options={[
                  { value: 5, label: "5% (Standard Apparel <= ₹1000)" },
                  { value: 12, label: "12% (Luxury Apparel > ₹1000)" },
                  { value: 18, label: "18% (Accessories)" },
                ]}
              />
            </Form.Item>
          </div>

          <Divider style={{ margin: "16px 0" }}>Matrix Generator (Colors × Sizes)</Divider>

          <Form.Item name="colors" label="Colors" initialValue={["Black", "White"]}>
            <Select
              mode="tags"
              placeholder="Type colors and press enter"
              options={[
                { value: "Black", label: "Black" },
                { value: "White", label: "White" },
                { value: "Navy", label: "Navy" },
                { value: "Olive", label: "Olive" },
                { value: "Charcoal", label: "Charcoal" },
              ]}
            />
          </Form.Item>

          <Form.Item name="sizes" label="Sizes" initialValue={["S", "M", "L", "XL"]}>
            <Select
              mode="tags"
              placeholder="Select sizes"
              options={[
                { value: "XS", label: "XS" },
                { value: "S", label: "S" },
                { value: "M", label: "M" },
                { value: "L", label: "L" },
                { value: "XL", label: "XL" },
                { value: "XXL", label: "XXL" },
              ]}
            />
          </Form.Item>

          <Space size="large" style={{ marginTop: 8 }}>
            <Form.Item name="isPublished" label="Publish to Storefront" valuePropName="checked" initialValue={true}>
              <Switch />
            </Form.Item>

            <Form.Item name="isFeatured" label="Feature on Homepage" valuePropName="checked" initialValue={false}>
              <Switch />
            </Form.Item>
          </Space>

          <Button type="primary" htmlType="submit" block style={{ marginTop: 24 }}>
            Generate Matrix & Save Product
          </Button>
        </Form>
      </Drawer>
    </Card>
  );
}
