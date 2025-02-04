import process from 'process';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import Permission from "src/models/permission.model";
import Role from "src/models/role.model";
import User, { IUser } from "src/models/user.model";

import { connectionString } from 'src/db';

/**
 * Seed Admin User
 * 
 */
const seedAdmin = async () => {
  await mongoose.connect(connectionString);

  let existingAdmin = await User.findOne({ name: 'admin' });
  let existingRole = await Role.findOne({ roleName: 'admin' });
  let existingPermission = await Permission.findOne({ name: 'create_record' });

  if (!existingPermission) {
    existingPermission = await new Permission({ name: 'create_record' }).save();
  }

  if (!existingRole) {
    existingRole = await new Role({ roleName: 'admin', permissions: [existingPermission?.id] }).save();
  }

  if (!existingAdmin) {
    const adminCredintals: IUser = {
      email: 'admin@gmail.com',
      name: 'admin',
      password: await bcrypt.hash('123', 10),
      role: existingRole.id,
    };

    await new User(adminCredintals).save();
  }

  await mongoose.disconnect();
};

seedAdmin().then(() => {
  console.log("Admin Seeding Completed");
  process.exit(0);
}).catch(err => {
  console.error("Error seeding admin:", err);
  process.exit(1);
});