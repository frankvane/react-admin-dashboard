import { Button, Dropdown, Menu, Space, Tabs, Tooltip } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DownOutlined } from "@ant-design/icons";
import React from "react";
import { getRouteMetaByPath } from "../../router";

export interface TagItem {
  key: string;
  label: string;
  path: string;
  closable: boolean;
}

const TagsView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState<string>(location.pathname);
  const [items, setItems] = useState<TagItem[]>([
    {
      key: "/",
      label: "Dashboard",
      path: "/",
      closable: false,
    },
  ]);

  // 根据路由变化更新标签
  useEffect(() => {
    const { pathname } = location;
    setActiveKey(pathname);

    // 检查标签是否已存在
    const isExist = items.some((item) => item.path === pathname);
    if (!isExist) {
      // 根据路径获取路由元数据
      const meta = getRouteMetaByPath(pathname);

      // 如果找到元数据并且不是隐藏的路由，则添加标签
      if (meta && !meta.hidden) {
        setItems((prevItems) => [
          ...prevItems,
          {
            key: pathname,
            label: meta.title,
            path: pathname,
            closable: pathname !== "/",
          },
        ]);
      }
    }
  }, [location, items]);

  // 切换标签
  const onChange = (key: string) => {
    setActiveKey(key);
    navigate(key);
  };

  // 关闭标签
  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      const targetPath = targetKey as string;
      const newItems = items.filter((item) => item.path !== targetPath);
      setItems(newItems);

      // 如果关闭的是当前活动标签，则跳转到最后一个标签
      if (targetPath === activeKey) {
        const lastItem = newItems[newItems.length - 1];
        setActiveKey(lastItem.path);
        navigate(lastItem.path);
      }
    }
  };

  // 关闭当前标签
  const closeCurrent = useCallback(() => {
    if (activeKey === "/") return; // 不关闭首页
    onEdit(activeKey, "remove");
  }, [activeKey]);

  // 关闭其他标签
  const closeOthers = useCallback(() => {
    const newItems = items.filter(
      (item) => item.path === "/" || item.path === activeKey
    );
    setItems(newItems);
  }, [activeKey, items]);

  // 关闭所有标签
  const closeAll = useCallback(() => {
    const newItems = items.filter((item) => item.path === "/");
    setItems(newItems);
    setActiveKey("/");
    navigate("/");
  }, [items, navigate]);

  // 右键菜单
  const menu = (
    <Menu
      items={[
        {
          key: "close-current",
          label: "Close Current",
          onClick: closeCurrent,
          disabled: activeKey === "/",
        },
        {
          key: "close-others",
          label: "Close Others",
          onClick: closeOthers,
        },
        {
          key: "close-all",
          label: "Close All",
          onClick: closeAll,
        },
      ]}
    />
  );

  return (
    <div
      className="tags-view-container"
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "0 16px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items.map((item) => ({
          key: item.path,
          label: (
            <Tooltip title={item.label}>
              <span>{item.label}</span>
            </Tooltip>
          ),
          closable: item.closable,
        }))}
        style={{ flex: 1, marginBottom: 0 }}
      />
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button type="text" size="small">
          <Space>
            操作
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
};

export default TagsView;
