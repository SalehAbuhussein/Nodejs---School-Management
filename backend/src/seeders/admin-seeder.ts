import process from 'process';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import Permission from 'src/db/models/permission.model';
import Role from 'src/db/models/role.model';
import User, { IUser } from 'src/db/models/user.model';

/**
 * Seed Admin User
 *
 */
const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);

  let existingAdmin = await User.findOne({ name: 'admin' });
  let existingRole = await Role.findOne({ roleName: 'admin' });
  let existingPermission = await Permission.findOne({ name: 'admin.all' });

  if (!existingPermission) {
    existingPermission = await new Permission({ name: 'admin.all', description: 'Can do anything in the system' }).save();
  }

  if (!existingRole) {
    existingRole = await new Role({ roleName: 'admin', permissions: [existingPermission?.id] }).save();
  }

  if (!existingAdmin) {
    const adminCredintals: IUser = {
      email: 'admin@gmail.com',
      name: 'admin',
      password: await bcrypt.hash('123', 10),
      isActive: true,
      tokenVersion: 0,
    };

    await new User(adminCredintals).save();
  }

  await mongoose.disconnect();
};

seedAdmin()
  .then(() => {
    console.log('Admin Seeding Completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding admin:', err);
    process.exit(1);
  });
