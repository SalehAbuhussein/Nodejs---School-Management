import { Request, Response, NextFunction } from 'express';

import mongoose from 'mongoose';

import Role from 'src/db/models/role.model';

export const checkPermission = (permissionId: string) => async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.session as unknown as { userId: string };

  if (!userId) {
    res.status(403).json({ message: 'You do not have permission to perform this operation' });
  }

  const rolesWithPermission = await Role.aggregate([
    {
      $match: {
        users: mongoose.Types.ObjectId.createFromHexString(userId),
        permissions: mongoose.Types.ObjectId.createFromHexString(permissionId),
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ]);

  if (rolesWithPermission.length > 0) {
    return next();
  } else {
    res.status(403).json({ message: 'You do not have permission to perform this operation' });
  }
};
