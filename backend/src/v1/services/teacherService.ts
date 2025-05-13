import Teacher, { ITeacher } from 'src/db/models/teacher.model';
import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Retrieve all teachers from the database
 *
 * @returns {Promise<ITeacher[]>} A promise that resolves to an array of teachers
 * @throws {CustomError} If database operation fails
 */
export const getAllTeachers = async (): Promise<ITeacher[]> => {
  try {
    const teachers = await Teacher.find();
    return teachers;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Retrieve a specific teacher by ID
 *
 * @param {string} teacherId - The ID of the teacher to retrieve
 * @returns {Promise<ITeacher>} A promise that resolves to the teacher
 * @throws {CustomError} If teacher not found or database operation fails
 */
export const getTeacherById = async (teacherId: string): Promise<ITeacher> => {
  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      throw new CustomError('Not Found', 404);
    }

    return teacher;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Create a new teacher
 *
 * @param {Omit<ITeacher, 'subjects' | 'isActive'>} teacherData - The teacher data to create
 * @returns {Promise<ITeacher>} A promise that resolves to the created teacher
 * @throws {CustomError} If validation fails or database operation fails
 */
export const createTeacher = async (teacherData: Omit<ITeacher, 'subjects' | 'isActive'>): Promise<ITeacher> => {
  try {
    return await Teacher.create(teacherData);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Update an existing teacher
 *
 * @param {string} teacherId - The ID of the teacher to update
 * @param {Omit<ITeacher, 'userId'>} teacherData - The updated teacher data
 * @returns {Promise<ITeacher>} A promise that resolves to the updated teacher
 * @throws {CustomError} If teacher not found or database operation fails
 */
export const updateTeacher = async (teacherId: string, teacherData: Omit<ITeacher, 'userId'>): Promise<ITeacher> => {
  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      throw new CustomError('Not Found', 404);
    }

    if (teacher.firstName !== teacherData.firstName) {
      teacher.firstName = teacherData.firstName;
    }

    if (teacher.secondName !== teacherData.secondName) {
      teacher.secondName = teacherData.secondName;
    }

    if (teacher.thirdName !== teacherData.thirdName) {
      teacher.thirdName = teacherData.thirdName;
    }

    if (teacher.lastName !== teacherData.lastName) {
      teacher.lastName = teacherData.lastName;
    }

    if (teacher.isActive !== teacherData.isActive) {
      teacher.isActive = teacherData.isActive;
    }

    if (teacherData.subjects) {
      teacher.subjects = teacherData.subjects;
    }

    return await teacher.save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Delete a teacher
 *
 * @param {string} teacherId - The ID of the teacher to delete
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
 * @throws {CustomError} If teacher not found or database operation fails
 */
export const deleteTeacher = async (teacherId: string): Promise<boolean> => {
  try {
    const result = await Teacher.deleteOne({ _id: teacherId });

    if (result.deletedCount === 0) {
      throw new CustomError('Not Found', 404);
    }

    return result.deletedCount > 0;
  } catch (error) {
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Check if a teacher exists
 *
 * @param {string} teacherId - The ID of the teacher to check
 * @returns {Promise<boolean>} A promise that resolves to true if the teacher exists
 * @throws {CustomError} If database operation fails
 */
export const checkTeacherExists = async (teacherId: string): Promise<boolean> => {
  try {
    const teacher = await Teacher.findById(teacherId);
    return !!teacher;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Check if multiple teachers exist
 *
 * @param {string[]} teachersIds - The IDs of the teachers to check
 * @returns {Promise<boolean>} A promise that resolves to true if all teachers exist
 * @throws {CustomError} If database operation fails
 */
export const checkTeachersExists = async (teachersIds: string[]): Promise<boolean> => {
  try {
    const teachersList = await Teacher.find({ $in: teachersIds });

    if (teachersList.length !== teachersIds.length) {
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  teacherExists: checkTeacherExists,
  teachersExists: checkTeachersExists,
};
