import { ISubject } from "src/models/subject.model";

export type GetSubjectParams = { subjectId: string };

export type PostSubjectBody = { 
  name: string, 
  teacherId: string,
  totalSlots: string,
};

export type UpdateSubjectBody = Omit<PostSubjectBody, 'teacherId'> & { isActive: boolean, teachersIds: string[] };

export type UpdateSubjectParams = { subjectId: string };

export type DeleteSubjectParams = { subjectId: string };

export type GetSubjectsResponse = {
  status: number,
  data: ISubject[] | null,
  message: string,
  error?: any,
};

export type GetSubjectResponse = {
  status: number,
  data: ISubject | null,
  message: string,
  error?: any,
};

export type CreateSubjectResponse = {
  status: number,
  data: ISubject | null,
  message: string,
  error?: any,
};

export type UpdateSubjectResponse = {
  status: number,
  data: ISubject | null,
  message: string,
  error?: any,
};

export type DeleteSubjectResponse = {
  status: number,
  message: string,
  data: ISubject | null,
  error?: any,
};