import Teacher, { ITeacher } from 'src/models/teacher.model';
import { CustomError } from 'src/shared/utils/CustomError';

export class TeacherService {

  /**
   * Retrieve all teachers from the database
   * 
   * @returns {Promise<ITeacher[]>} A promise that resolves to an array of teachers
   * @throws {CustomError} If database operation fails
   */
  static getAllTeachers = async (): Promise<ITeacher[]> => {
    try {
      const teachers = await Teacher.find();
      return teachers;
    } catch (error) {
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
  static getTeacherById = async (teacherId: string): Promise<ITeacher> => {
    try {
      const teacher = await Teacher.findById(teacherId);

      if (!teacher) {
        throw new CustomError('Not Found', 404);
      }

      return teacher;
    } catch (error) {
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
  static createTeacher = async (teacherData: Omit<ITeacher, 'subjects' | 'isActive'>): Promise<ITeacher> => {
    try {
      return await Teacher.create(teacherData);
    } catch (error) {
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
  static updateTeacher = async (teacherId: string, teacherData: Omit<ITeacher, 'userId'>) => {
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
  static deleteTeacher = async (teacherId: string): Promise<boolean> => {
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
   * @param teacherId - The ID of the teacher to check
   * @throws CustomError if database operation fails
   */
  static teacherExists = async (teacherId: string ): Promise<boolean> => {
    try {
      const teacher = await Teacher.findById(teacherId);
      return !!teacher;
    } catch (error) {
      throw new CustomError('Server Error', 500, error);
    }
  };

  /**
   * Check if a teachers exists
   * @param teachersIds - The IDs of the teachers to check
   * @throws CustomError if database operation fails
   */
  static teachersExists = async (teachersIds: string[]) => {
    try {
      const teachersList = await Teacher.find({ $in: teachersIds });
      
      if (teachersList.length !== teachersIds.length) {
        return false;
      }

      return true;
    } catch (error) {
      throw new CustomError('Server Error', 500, error);
    }
  };
}