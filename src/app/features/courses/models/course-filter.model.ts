export type CourseSort = 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';

export interface CourseFilters {
  search: string;
  category: string;
  status: string;
}

export interface CoursesQuery extends CourseFilters {
  page: number;
  pageSize: number;
}

export const DEFAULT_COURSE_FILTERS: CourseFilters = {
  search: '',
  category: '',
  status: ''
};

export const DEFAULT_COURSES_QUERY: CoursesQuery = {
  ...DEFAULT_COURSE_FILTERS,
  page: 1,
  pageSize: 12,
};