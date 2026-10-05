"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Menu, Button, Avatar, Dropdown, Space, Tag } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { AntdProvider } from "@/components/admin/AntdProvider";
import { createClient } from "@/lib/supabase/client";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/orders",
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/orders">Orders & Pipeline</Link>,
    },
    {
      key: "/admin/products",
      icon: <AppstoreOutlined />,
      label: <Link href="/admin/products">Product Catalog</Link>,
    },
    {
      key: "/admin/inventory",
      icon: <DatabaseOutlined />,
      label: <Link href="/admin/inventory">Warehouse Inventory</Link>,
    },
    {
      key: "/admin/gst-invoices",
      icon: <FileTextOutlined />,
      label: <Link href="/admin/gst-invoices">GST Invoices & Reports</Link>,
    },
    {
      key: "/admin/leads",
      icon: <UsergroupAddOutlined />,
      label: <Link href="/admin/leads">CRM Leads</Link>,
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">Store Settings</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "storefront",
      icon: <ShopOutlined />,
      label: <Link href="/" target="_blank">View Live Storefront</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Sign Out",
      onClick: handleLogout,
    },
  ];

  return (
    <AntdProvider>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Responsive Sider */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={240}
          theme="dark"
          style={{
            background: "#0b0f17",
            borderRight: "1px solid #1e293b",
          }}
        >
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #1e293b",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontWeight: 800,
                letterSpacing: 1.5,
                fontSize: collapsed ? 14 : 18,
                textTransform: "uppercase",
              }}
            >
              {collapsed ? "LV" : "LUXE VOGUE"}
            </span>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            style={{ background: "transparent", borderRight: 0, marginTop: 12 }}
          />
        </Sider>

        <Layout>
          {/* Top Header */}
          <Header
            style={{
              padding: "0 24px",
              background: "#ffffff",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Space size="middle">
              <Tag color="cyan">Production Ready</Tag>
              <Tag color="blue">GST Engine Active</Tag>
            </Space>

            <Space size="middle">
              <Link href="/" target="_blank">
                <Button icon={<ShopOutlined />} type="dashed">
                  Storefront
                </Button>
              </Link>

              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: "pointer" }}>
                  <Avatar style={{ backgroundColor: "#0f172a" }} icon={<UserOutlined />} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                    Administrator
                  </span>
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* Main Body Content */}
          <Content style={{ margin: "24px", minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </AntdProvider>
  );
}
