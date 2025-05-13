import mongoose from 'mongoose';

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
    await mongoose.connect(process.env.MONGODB_URI as string);
    callback();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
