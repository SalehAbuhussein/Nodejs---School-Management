import mongoose, { ClientSession } from 'mongoose';

import Subject from 'src/db/models/subject.model';
import Teacher from 'src/db/models/teacher.model';
import TeacherSubject, { AssignTeacherParams, ITeacherSubject } from 'src/db/models/teacherSubject.model';

import { CustomError } from 'src/shared/utils/CustomError';

// TODO: Check if it works
/**
 * Get teachers for a specific subject
 * 
 * @param {string} subjectId - The ID of the subject
 * @param {string} semester - The semester ('First' or 'Second')
 * @returns {Promise<any[]>} A promise that resolves to an array of teachers
 * @throws {CustomError} If operation fails
 */
export const getSubjectTeachers = async (subjectId: string, semester: 'First' | 'Second') => {
  try {
    const assignments = await TeacherSubject.where('isDeleted')
      .equals(false)
      .find({
        subjectId,
        semester,
        isActive: true,
      })
      .populate({
        path: 'teacherId',
        populate: {
          path: 'userId',
          select: 'name email profileImg'
        }
      });

      return assignments.map(assignment => assignment.teacherId);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to get subject teachers', 500, error);
  }
};

/**
 * Assign a teacher to a subject
 *
 * @param {AssignTeacherParams} params - Assignment parameters
 * @returns {Promise<ITeacherSubject>} Promise with the created assignment
 * @throws {Error} If database operation fails
 */
export const assignTeacherToSubject = async (params: AssignTeacherParams, existingSession?: ClientSession): Promise<ITeacherSubject> => {
  const { teacherId, subjectId, semester, assignedDate = new Date() } = params;

    // Use existing session or create a new one
    const useExistingSession = !!existingSession;
    const session = existingSession || await mongoose.startSession();
    
    if (!useExistingSession) {
      session.startTransaction();
    }


  try {
    const teacher = await Teacher.findById(teacherId).session(session);
    if (!teacher) {
      throw new CustomError('Teacher Not Found', 404);
    }

    const subject = await Subject.findById(subjectId).session(session);
    if (!subject) {
      throw new CustomError('Subject Not Found', 404);
    }

    const existingAssignment = await TeacherSubject.findOne({ 
      teacherId, 
      subjectId,
      semester,
      isDeleted: false 
    }).session(session);

    if (existingAssignment) {
      throw new CustomError('Teacher is already assigned to this subject for this semester', 400);
    }

    // Create the assignment
    const assignment = await TeacherSubject.create(
      [
        {
          teacherId,
          subjectId,
          semester,
          assignedDate,
          isActive: true,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return assignment[0];
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to assign teacher to subject', 500);   
  } finally {
    await session.abortTransaction();
    await session.endSession();
  }
};

/**
 * Find teacher assignments by date range and semester
 *
 * @param {string} teacherId - The teacher ID
 * @param {Date} startDate - Start of date range
 * @param {Date} endDate - End of date range
 * @param {string} semester - Optional semester filter
 * @returns {Promise<Array>} Promise with array of assignments
 */
export const findTeacherAssignmentsByDateRange = async (
  teacherId: string,
  startDate: Date,
  endDate: Date,
  semester: 'First' | 'Second',
) => {
  try {
    const query: any = {
      teacherId,
      assignedDate: { $gte: startDate, $lte: endDate },
      isDeleted: false
    };

    if (semester) {
      query.semester = semester;
    }

    return await TeacherSubject.find(query)
      .populate('subjectId')
      .sort({ assignedDate: -1 });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to find teacher assignments', 500);
  }
};

/**
 * Find teacher assignments by semester
 *
 * @param {string} teacherId - The teacher ID
 * @param {string} semester - The semester
 * @returns {Promise<Array>} Promise with array of assignments
 */
export const findTeacherAssignmentsBySemester = async (teacherId: string, semester: 'First' | 'Second') => {
  try {
    return await TeacherSubject.where('isDeleted')
      .equals(false)
      .find({ teacherId, semester })
      .populate('subjectId')
      .sort({ assignedDate: -1 });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to find teacher assignments', 500);
  }
};

/**
 * Find current teacher assignments
 *
 * @param {string} teacherId - The teacher ID
 * @returns {Promise<Array>} Promise with array of current assignments
 */
export const findCurrentTeacherAssignments = async (teacherId: string) => {
  const currentMonth = new Date().getMonth();
  const currentSemester = currentMonth < 6 ? 'First' : 'Second';

  try {
    return await TeacherSubject.where('isDeleted')
      .equals(false)
      .find({
        teacherId,
        semester: currentSemester,
        isActive: true,
      })
      .populate('subjectId');
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to find current teacher assignments', 500);
  }
};

export default {
  assignTeacherToSubject,
  findTeacherAssignmentsByDateRange,
  findTeacherAssignmentsBySemester,
  findCurrentTeacherAssignments
};