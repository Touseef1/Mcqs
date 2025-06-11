export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Mcq {
  id: string;
  statement: string;
  options: string[];
  correctOption: number;
  type: 'easy' | 'medium' | 'hard';
  category: Category;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface McqFormData {
  statement: string;
  options: string[];
  correctOption: number;
  type: 'easy' | 'medium' | 'hard';
  category: string;
  description?: string;
  createdBy: string;
}