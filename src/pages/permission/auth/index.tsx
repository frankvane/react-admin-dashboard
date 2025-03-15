import React, { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Divider, Form, Select, Space, Table, Tree, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  type: 'menu' | 'operation' | 'data';
}

interface Role {
  id: number;
  name: string;
  description: string;
}

const AuthManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  // 模拟获取权限和角色数据
  useEffect(() => {
    setLoading(true);
    // 模拟 API 请求
    setTimeout(() => {
      const mockPermissions: Permission[] = [
        {
          id: 'dashboard',
          name: '仪表盘',
          description: '查看仪表盘',
          module: '仪表盘',
          type: 'menu',
        },
        {
          id: 'user:view',
          name: '查看用户',
          description: '查看用户列表',
          module: '用户管理',
          type: 'menu',
        },
        {
          id: 'user:create',
          name: '创建用户',
          description: '创建新用户',
          module: '用户管理',
          type: 'operation',
        },
        {
          id: 'user:edit',
          name: '编辑用户',
          description: '编辑用户信息',
          module: '用户管理',
          type: 'operation',
        },
        {
          id: 'user:delete',
          name: '删除用户',
          description: '删除用户',
          module: '用户管理',
          type: 'operation',
        },
        {
          id: 'role:view',
          name: '查看角色',
          description: '查看角色列表',
          module: '角色管理',
          type: 'menu',
        },
        {
          id: 'role:create',
          name: '创建角色',
          description: '创建新角色',
          module: '角色管理',
          type: 'operation',
        },
        {
          id: 'role:edit',
          name: '编辑角色',
          description: '编辑角色信息',
          module: '角色管理',
          type: 'operation',
        },
        {
          id: 'role:delete',
          name: '删除角色',
          description: '删除角色',
          module: '角色管理',
          type: 'operation',
        },
        {
          id: 'auth:view',
          name: '查看权限',
          description: '查看权限列表',
          module: '授权管理',
          type: 'menu',
        },
        {
          id: 'auth:assign',
          name: '分配权限',
          description: '为角色分配权限',
          module: '授权管理',
          type: 'operation',
        },
      ];

      const mockRoles: Role[] = [
        {
          id: 1,
          name: '超级管理员',
          description: '拥有所有权限',
        },
        {
          id: 2,
          name: '内容编辑',
          description: '管理内容相关功能',
        },
        {
          id: 3,
          name: '普通用户',
          description: '基础功能访问',
        },
        {
          id: 4,
          name: '测试人员',
          description: '测试环境所有权限',
        },
        {
          id: 5,
          name: '访客',
          description: '只读权限',
        },
      ];

      setPermissions(mockPermissions);
      setRoles(mockRoles);

      // 构建树形结构
      const modules = Array.from(new Set(mockPermissions.map(p => p.module)));
      const tree: DataNode[] = modules.map(module => {
        const modulePermissions = mockPermissions.filter(p => p.module === module);
        return {
          title: module,
          key: module,
          children: modulePermissions.map(p => ({
            title: p.name,
            key: p.id,
            isLeaf: true,
          })),
        };
      });

      setTreeData(tree);
      setLoading(false);
    }, 1000);
  }, []);

  // 表格列定义
  const columns: ColumnsType<Permission> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '所属模块',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          menu: '菜单',
          operation: '操作',
          data: '数据',
        };
        return typeMap[type] || type;
      },
    },
  ];

  // 处理角色选择
  const handleRoleChange = (value: number) => {
    setSelectedRole(value);
    
    // 模拟获取角色权限
    setLoading(true);
    setTimeout(() => {
      // 根据角色ID获取不同的权限
      let rolePermissions: string[] = [];
      
      if (value === 1) { // 超级管理员
        rolePermissions = permissions.map(p => p.id);
      } else if (value === 2) { // 内容编辑
        rolePermissions = ['dashboard', 'user:view', 'role:view', 'auth:view'];
      } else if (value === 3) { // 普通用户
        rolePermissions = ['dashboard'];
      } else if (value === 4) { // 测试人员
        rolePermissions = ['dashboard', 'user:view', 'role:view', 'auth:view', 'user:create', 'user:edit'];
      } else if (value === 5) { // 访客
        rolePermissions = ['dashboard'];
      }
      
      setCheckedKeys(rolePermissions);
      setLoading(false);
    }, 500);
  };

  // 处理权限树选择
  const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    if (Array.isArray(checked)) {
      setCheckedKeys(checked);
    } else {
      setCheckedKeys(checked.checked);
    }
  };

  // 保存权限设置
  const handleSave = () => {
    if (!selectedRole) {
      message.warning('请先选择角色');
      return;
    }
    
    message.success(`已为角色 "${roles.find(r => r.id === selectedRole)?.name}" 更新权限设置`);
  };

  return (
    <Card title="授权管理" variant="borderless">
      <Form layout="vertical">
        <Form.Item label="选择角色" required>
          <Select
            placeholder="请选择角色"
            style={{ width: 300 }}
            onChange={handleRoleChange}
            options={roles.map(role => ({ label: role.name, value: role.id }))}
          />
        </Form.Item>
        
        {selectedRole && (
          <>
            <Divider orientation="left">权限分配</Divider>
            
            <div style={{ display: 'flex', marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <Card title="权限树" size="small" style={{ marginRight: 16 }}>
                  <Tree
                    checkable
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    treeData={treeData}
                    height={400}
                    loading={loading}
                  />
                </Card>
              </div>
              
              <div style={{ flex: 1 }}>
                <Card title="权限列表" size="small">
                  <Table
                    columns={columns}
                    dataSource={permissions}
                    rowKey="id"
                    size="small"
                    pagination={false}
                    loading={loading}
                    scroll={{ y: 350 }}
                    rowSelection={{
                      type: 'checkbox',
                      selectedRowKeys: checkedKeys as string[],
                      onChange: (selectedRowKeys) => {
                        setCheckedKeys(selectedRowKeys);
                      },
                    }}
                  />
                </Card>
              </div>
            </div>
            
            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleSave}>
                  保存设置
                </Button>
                <Button onClick={() => {
                  setSelectedRole(null);
                  setCheckedKeys([]);
                }}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form>
    </Card>
  );
};

export default AuthManagement;