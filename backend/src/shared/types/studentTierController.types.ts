import { IStudentTier } from "src/models/studentTier.model";

export type GetStudentTierParams = { studentTierId: string };

export type PostStudentTierBody = { 
  tierName: string, 
  monthlySubscriptionFees: number, 
};

export type UpdateStudentTierBody = PostStudentTierBody;

export type UpdateStudentTierParams = { studentTierId: string };

export type DeleteStudentTierParams = { studentTierId: string };

export type GetStudentTiersResponse = {
  status: number,
  data: IStudentTier[] | null,
  message: string,
  error?: any,
};

export type GetStudentTierResponse = {
  status: number,
  data: IStudentTier | null,
  message: string,
  error?: any,
};

export type CreateStudentTierResponse = {
  status: number,
  data: Partial<IStudentTier> | null,
  message: string,
  error?: any,
};

export type UpdateStudentTierResponse = {
  status: number,
  data: IStudentTier | null,
  message: string,
  error?: any,
};

export type DeleteStudentTierResponse = {
  status: number,
  message: string,
  data: IStudentTier | null,
  error?: any,
};