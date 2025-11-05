export interface User {
  id: string;
  email: string;
  password: string; // O hash do bcrypt
  name: string;
  role: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}