import Subject from "src/models/subject.model";
import { SubjectService } from "src/services/subjectService";

/**
 * Check if Subject exist in database
 * 
 * @param { string } subjectId 
 */
export const checkSubjectExist = async (subjectId: string) => {
  const subject = await SubjectService.getSubjectById(subjectId);

  if (!subject) {
    throw new Error('Subject does not exist');
  }

  return true;
};

/**
 * Check if Subject is available to be enrolled at
 * 
 * @param { string } subjectId 
 */
export const checkSubjectIsAvailable = async (subjectId: string) => {
  const subject = await SubjectService.getSubjectById(subjectId);

  if (!subject) {
    throw new Error('Subject does not exist');
  }

  if (subject.isLocked) {
    throw new Error('Subject slots are full');
  }

  return true;
};

/**
 * Check if Subject exist in database
 * 
 * @param { string[] } subjectesIds subject ids 
 */
export const checkSubjectsExist = async (subjectesIds: string[]) => {
  const subjects = await Subject.find({ _id: { $in: subjectesIds }});

  if (subjects.length != subjectesIds.length) {
    throw new Error('Some Subjects does not exist');
  }

  return true;
};