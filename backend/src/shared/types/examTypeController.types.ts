import { IExamType } from "src/models/examType.model";

export type GetExamTypeParams = { examTypeId: string };

export type PostExamTypeBody = { name: string };

export type UpdateExamTypeBody = PostExamTypeBody;

export type UpdateExamTypeParams = { examTypeId: string };

export type DeleteExamTypeParams = { examTypeId: string };

export type GetExamTypesResponse = {
  status: number,
  data: IExamType[] | null,
  message: string,
  error?: any,
};

export type GetExamTypeResponse = {
  status: number,
  data: IExamType | null,
  message: string,
  error?: any,
};

export type CreateExamTypeResponse = {
  status: number,
  data: IExamType | null,
  message: string,
  error?: any,
};

export type UpdateExamTypeResponse = {
  status: number,
  data: IExamType | null,
  message: string,
  error?: any,
};

export type DeleteExamTypeResponse = {
  status: number,
  message: string,
  error?: any,
};