import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import LogoImg from "../../assets/najot.jpg"; 
import { Select, Space } from 'antd';
import { useTranslation } from "react-i18next";
import { FileProtectOutlined, TagsOutlined, SettingOutlined, StockOutlined, NotificationOutlined, TagOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState("");
  const { pathname } = useLocation();

  const { t, i18n: { changeLanguage, language } } = useTranslation();
  const [languageState, setLanguageState] = useState(language);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    let index = admin.findIndex((item) => item.path === pathname);
    if (index !== -1) {
      setSelectedKeys(index.toString());
    }
  }, [pathname]);

  const ChangeLanguage = (value) => {
    changeLanguage(value);
    console.log(value);
  };

  const admin = [
    {
      content: t("page1"),
      path: "/admin-layout/himiko",
      icon: LogoImg,
    },
    {
      content:  t("page2"),
      path: "/admin-layout",
      icon: FileProtectOutlined,
    },
    {
      content:  t("page3"),
      path: "/admin-layout/category",
      icon: AppstoreOutlined,
    },
    {
      content:  t("page4"),
      path: "/admin-layout/brands",
      icon: TagOutlined,
    },
    {
      content: t("page5"),
      path: "/admin-layout/brands-category",
      icon: TagsOutlined,
    },
    {
      content: t("page6"),
      path: "/admin-layout/ads",
      icon: NotificationOutlined,
    },
    {
      content: t("page7"),
      path: "/admin-layout/stock",
      icon: StockOutlined,
    },
    {
      content: t("page8"),
      path: "/admin-layout/setting",
      icon: SettingOutlined,
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} className="min-h-[100vh]">
        <div className="demo-logo-vertical px-3" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKeys]}
          items={admin.map((item, index) => ({
            key: index.toString(),
            icon: index === 0 ? (
              <img
                src={LogoImg}
                alt="Logo"
                className="w-20 h-auto rounded-full object-cover"
              />
            ) : (
              React.createElement(item.icon)
            ),
            label: (
              <NavLink
                to={item.path}
                className="text-white hover:text-white focus:text-white"
              >
                {item.content === "Himiko" ? (
                  <span className="ml-2 text-xl font-bold">Himiko</span>
                ) : (
                  item.content
                )}
              </NavLink>
            ),
          }))}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space wrap>
            <Select
              defaultValue="en"
              style={{ width: 120 }}
              onChange={(value) => ChangeLanguage(value)}
              options={[
                { value: 'en', label: 'en' },
                { value: 'uz', label: 'uz' },
              ]}
            />
          </Space>
        </Header>
        <div className="p-3">
          <div
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default Admin;
