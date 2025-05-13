import { IEnrollment } from 'src/db/models/enrollment.model';

export type GetEnrollemntParams = { studentId: string; subjectId: string; examTypeId: string; isActive: boolean };

export type PostEnrollmentBody = {
  studentId: string;
  subjectId: string;
  enrollmentDate?: Date;
  enrollmentFees: number;
  semester: 'First' | 'Second';
};

export type UpdateEnrollmentBody = PostEnrollmentBody;

export type UpdateEnrollmentParams = { subjectId: string; enrollmentDate: Date; enrollmentFees: number; isActive: boolean };

export type DeleteEnrollmentParams = { enrollmentId: string };

export type GetEnrollmentsResponse = {
  status: number;
  data: IEnrollment[] | null;
  message: string;
  error?: any;
};

export type GetEnrollmentResponse = {
  status: number;
  data: IEnrollment | null;
  message: string;
  error?: any;
};

export type CreateEnrollmentResponse = {
  status: number;
  data: IEnrollment | null;
  message: string;
  error?: any;
};

export type UpdateEnrollmentResponse = {
  status: number;
  data: IEnrollment | null;
  message: string;
  error?: any;
};

export type DeleteIEnrollmentResponse = {
  status: number;
  message: string;
  data: IEnrollment | null;
  error?: any;
};
