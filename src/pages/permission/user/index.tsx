import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');

  // 模拟获取用户数据
  useEffect(() => {
    setLoading(true);
    // 模拟 API 请求
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'admin',
          name: '管理员',
          email: 'admin@example.com',
          role: '超级管理员',
          status: 'active',
          createdAt: '2023-01-01',
        },
        {
          id: 2,
          username: 'editor',
          name: '编辑者',
          email: 'editor@example.com',
          role: '内容编辑',
          status: 'active',
          createdAt: '2023-01-15',
        },
        {
          id: 3,
          username: 'user1',
          name: '普通用户',
          email: 'user1@example.com',
          role: '普通用户',
          status: 'inactive',
          createdAt: '2023-02-01',
        },
        {
          id: 4,
          username: 'tester',
          name: '测试员',
          email: 'tester@example.com',
          role: '测试人员',
          status: 'active',
          createdAt: '2023-02-15',
        },
        {
          id: 5,
          username: 'guest',
          name: '访客',
          email: 'guest@example.com',
          role: '访客',
          status: 'inactive',
          createdAt: '2023-03-01',
        },
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
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
          <Popconfirm
            title="确定要删除此用户吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
          <a>{record.status === 'active' ? '禁用' : '启用'}</a>
        </Space>
      ),
    },
  ];

  // 处理删除用户
  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('用户已删除');
  };

  // 处理搜索
  const handleSearch = () => {
    if (!searchText) {
      return;
    }
    const filteredUsers = users.filter(
      user => 
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchText('');
    // 重新加载数据
    setLoading(true);
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'admin',
          name: '管理员',
          email: 'admin@example.com',
          role: '超级管理员',
          status: 'active',
          createdAt: '2023-01-01',
        },
        {
          id: 2,
          username: 'editor',
          name: '编辑者',
          email: 'editor@example.com',
          role: '内容编辑',
          status: 'active',
          createdAt: '2023-01-15',
        },
        {
          id: 3,
          username: 'user1',
          name: '普通用户',
          email: 'user1@example.com',
          role: '普通用户',
          status: 'inactive',
          createdAt: '2023-02-01',
        },
        {
          id: 4,
          username: 'tester',
          name: '测试员',
          email: 'tester@example.com',
          role: '测试人员',
          status: 'active',
          createdAt: '2023-02-15',
        },
        {
          id: 5,
          username: 'guest',
          name: '访客',
          email: 'guest@example.com',
          role: '访客',
          status: 'inactive',
          createdAt: '2023-03-01',
        },
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  };

  return (
    <Card title="用户管理" variant="borderless">
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索用户名/姓名/邮箱"
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
          新增用户
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default UserManagement;