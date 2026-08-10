import type { Course, CourseChapter, CoursePricing } from "../context/CourseContext";
import { del, get, patch, post, put, upload } from "./client";

export type CoursePayload = {
  title: string;
  description: string;
  pricing: CoursePricing;
  chapters: CourseChapter[];
  cover?: string;
};

export type UploadResult = {
  url: string;
  name: string;
  size: number;
  type: string;
};

export const courseApi = {
  list: () => get<Course[]>("/courses/"),
  create: (data: CoursePayload) => post<Course>("/courses/", data),
  update: (id: number, data: CoursePayload) => put<Course>(`/courses/${id}/`, data),
  partialUpdate: (id: number, data: Partial<Course>) => patch<Course>(`/courses/${id}/`, data),
  remove: (id: number) => del<never>(`/courses/${id}/`),
  uploadFile: (file: File) => upload<UploadResult>("/upload/", file),
};
