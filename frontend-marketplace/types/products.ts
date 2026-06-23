export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imageUrl?: string; // Nuevo campo obligatorio de la tarea
  CategoryId?: number; // Nuevo campo obligatorio de la tarea
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  nombre: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}