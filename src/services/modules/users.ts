// src/services/api/modules/users.ts

import { get, post } from "../request";

// 用户数据类型
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// 获取所有用户
export const fetchUsers = () => get<User[]>("/users");

// 获取单个用户
export const fetchUserById = (id: number) => get<User>(`/users/${id}`);

// 创建用户（示例）
export const createUser = (userData: Partial<User>) =>
  post<User>("/users", userData);
