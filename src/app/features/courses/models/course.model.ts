export interface Course {
  id: number;
  title: string;
  description?: string;
  instructor: string;
  category: string;
  duration: number;
  price: number;
  status: string;
  createdDate?: string;
  thumbnail?: string;
}

export interface Category{
  id: string;
  name: string;
}

export interface CoursePayload {
  title: string;
  instructor: string;
  category: string;
  duration: number;
  price: number;
  status: 'active' | 'draft' | 'archived';
  description: string;
}