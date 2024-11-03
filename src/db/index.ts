import mongoose from 'mongoose';

export const connectionString = "mongodb+srv://salehabuhussein:3996949@cluster0.oa8cj.mongodb.net/shop";

/**
 * Connect to database 
 * Then assign MongoClient instance to global variable called _db
 * Then fire the callback which is listening to the server in this case
 * 
 * @param { void } callback 
 * @returns { Promise<void> }
 */
export const mongoConnect = async (callback: () => void): Promise<void> => {
  try {
    await mongoose.connect(connectionString);
    callback();
  } catch (err) {
    console.log(err);
    throw(err);
  }
};