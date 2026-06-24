import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import {
  inject,
  Injectable,
} from '@angular/core';

import { map, Observable } from 'rxjs';
import { Category, Course, CoursePayload } from '../models/course.model';

import {
  environment,
} from '../../../../environments/environment';

export interface CoursesQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
  level?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface JsonServerPaginatedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

export interface CoursesResponse {
  data: Course[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class CoursesApiService {
  private readonly http =
    inject(HttpClient);

   private readonly apiUrl = `${environment.apiUrl}/courses`;

  private readonly categoriesUrl = `${environment.apiUrl}/categories`;

  getCourses( query: CoursesQuery = {}): Observable<CoursesResponse> {
    let params = new HttpParams();
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 12;

    params = params.set('_page', page).set('_per_page', pageSize);

    if (query.search?.trim()) {
      const search = query.search.trim();

      params = params.set(
        '_where',
        JSON.stringify({
          or: [
            {
              title: {
                contains: search,
              },
            },
            {
              instructor: {
                contains: search,
              },
            },
            {
              category: {
                contains: search,
              },
            },
            {
              level: {
                contains: search,
              },
            },
          ],
        }),
      );
    }

    if (query.category) {
      params = params.set('category:eq', query.category);
    }

    if (query.status) {
      params = params.set('status:eq', query.status);
    }

    if (query.level) {
      params = params.set('level:eq', query.level);
    }

    if (query.sortBy) {
      const sortValue = query.sortDirection === 'desc' ? `-${query.sortBy}` : query.sortBy;
      params = params.set('_sort', sortValue);
    }

    return this.http
      .get<JsonServerPaginatedResponse<Course>>(
        this.apiUrl,
        {
          params,
        },
      )
      .pipe(
        map((response) => ({
          data: response.data,
          total: response.items,
          page,
          pageSize,
        })),
      );
  }

  getCourseById(
    id: string,
  ): Observable<Course> {
    return this.http.get<Course>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
    );
  }

  createCourse(payload: CoursePayload): Observable<Course> {
    const courseToCreate: Omit<Course, 'id'> = {
      ...payload,
      createdDate: new Date().toISOString(),
    };

    return this.http.post<Course>(this.apiUrl, courseToCreate);
  }

  updateCourse( id: string | number, payload: CoursePayload ): Observable<Course> {
    return this.http.patch<Course>(`${this.apiUrl}/${id}`, payload);
  }

  deleteCourse(id: number): Observable<void> {
  return this.http.delete<void>(
    `${this.apiUrl}/${id}`,
  );
}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.categoriesUrl}`,
    );
  }
}