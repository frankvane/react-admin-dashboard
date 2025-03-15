import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

const RoleManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchText, setSearchText] = useState('');

  // 模拟获取角色数据
  useEffect(() => {
    setLoading(true);
    // 模拟 API 请求
    setTimeout(() => {
      const mockRoles: Role[] = [
        {
          id: 1,
          name: '超级管理员',
          description: '拥有所有权限',
          permissions: ['all'],
          userCount: 1,
          createdAt: '2023-01-01',
          status: 'active',
        },
        {
          id: 2,
          name: '内容编辑',
          description: '管理内容相关功能',
          permissions: ['content:read', 'content:write', 'content:publish'],
          userCount: 5,
          createdAt: '2023-01-15',
          status: 'active',
        },
        {
          id: 3,
          name: '普通用户',
          description: '基础功能访问',
          permissions: ['content:read'],
          userCount: 20,
          createdAt: '2023-02-01',
          status: 'active',
        },
        {
          id: 4,
          name: '测试人员',
          description: '测试环境所有权限',
          permissions: ['test:all'],
          userCount: 3,
          createdAt: '2023-02-15',
          status: 'active',
        },
        {
          id: 5,
          name: '访客',
          description: '只读权限',
          permissions: ['read'],
          userCount: 50,
          createdAt: '2023-03-01',
          status: 'inactive',
        },
      ];
      setRoles(mockRoles);
      setLoading(false);
    }, 1000);
  }, []);

  // 表格列定义
  const columns: ColumnsType<Role> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限数量',
      key: 'permissionCount',
      render: (_, record) => record.permissions.length,
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>编辑</a>
          <a>权限设置</a>
          <Popconfirm
            title="确定要删除此角色吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理删除角色
  const handleDelete = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
    message.success('角色已删除');
  };

  // 处理搜索
  const handleSearch = () => {
    if (!searchText) {
      return;
    }
    const filteredRoles = roles.filter(
      role => 
        role.name.toLowerCase().includes(searchText.toLowerCase()) ||
        role.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setRoles(filteredRoles);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchText('');
    // 重新加载数据
    setLoading(true);
    setTimeout(() => {
      const mockRoles: Role[] = [
        {
          id: 1,
          name: '超级管理员',
          description: '拥有所有权限',
          permissions: ['all'],
          userCount: 1,
          createdAt: '2023-01-01',
          status: 'active',
        },
        {
          id: 2,
          name: '内容编辑',
          description: '管理内容相关功能',
          permissions: ['content:read', 'content:write', 'content:publish'],
          userCount: 5,
          createdAt: '2023-01-15',
          status: 'active',
        },
        {
          id: 3,
          name: '普通用户',
          description: '基础功能访问',
          permissions: ['content:read'],
          userCount: 20,
          createdAt: '2023-02-01',
          status: 'active',
        },
        {
          id: 4,
          name: '测试人员',
          description: '测试环境所有权限',
          permissions: ['test:all'],
          userCount: 3,
          createdAt: '2023-02-15',
          status: 'active',
        },
        {
          id: 5,
          name: '访客',
          description: '只读权限',
          permissions: ['read'],
          userCount: 50,
          createdAt: '2023-03-01',
          status: 'inactive',
        },
      ];
      setRoles(mockRoles);
      setLoading(false);
    }, 500);
  };

  return (
    <Card title="角色管理" variant="borderless">
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索角色名称/描述"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          onPressEnter={handleSearch}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
        <Button onClick={handleReset}>重置</Button>
        <Button type="primary" icon={<PlusOutlined />}>
          新增角色
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default RoleManagement;