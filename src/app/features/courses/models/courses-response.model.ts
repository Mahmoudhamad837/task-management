import { Course } from './course.model';

export interface CoursesResponse {
  courses: Course[];
  total: number;
  skip: number;
  limit: number;
}