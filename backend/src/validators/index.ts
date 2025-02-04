import mongoose from "mongoose";

/**
 * Check if field in body is valid Object Ids (mongoose object ID)
 * 
 * @param { string[] } value 
 * @param { string } param1 
 */
export const isObjectIds = (value: string[], { path }: { path: string }) => {
  console.log('isObjectIds');
      
  const allValid = value.every((item: string) => new mongoose.Types.ObjectId(item).toString() === item);
  
  if (!allValid) {
    throw new Error(`${path} must contain valid ObjectId values`);
  }

  return true;
}

/**
 * Check if value is valid object id
 * 
 * @param { string } value 
 */
export const isObjectId = (value: string, { path }: { path: string }) => {
  const isValid = new mongoose.Types.ObjectId(value).toString() === value;

  if (!isValid) {
    throw new Error(`${path} must be valid ObjectId value`);
  }

  return true;
};

/**
 * 
 * Remove duplicates from array
 * 
 * @param { T[] } value
 * @returns { T[] }
 */
export const removeDuplicates = <T>(value: T[]): T[] => {
  return [ ...new Set(value)];
}