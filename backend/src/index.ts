import path from 'path';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

import connectMongo from 'connect-mongodb-session';
import mongoSanitize from 'express-mongo-sanitize';
import { mongoConnect } from 'src/db';

import V1SwaggerDocs from 'src/v1/swagger';
import v1EnrollmentRoutes from 'src/v1/routes/enrollment/enrollment.routes';
import v1ExamTypeRoutes from 'src/v1/routes/examType/examType.routes';
import v1PermissionRoutes from 'src/v1/routes/permission/permission.routes';
import v1RoleRoutes from 'src/v1/routes/role/role.routes';
import v1StudentExamRoutes from 'src/v1/routes/studentExam/studentExam.routes';
import v1TeacherExamRoutes from 'src/v1/routes/teacherExam/teacherExam.routes';
import v1StudentRoutes from 'src/v1/routes/student/student.routes';
import v1StudentTierRoutes from 'src/v1/routes/studentTier/studentTier.routes';
import v1SubjectRoutes from 'src/v1/routes/subject/subject.routes';
import v1TeacherRoutes from 'src/v1/routes/teacher/teacher.routes';
import v1UserRoutes from 'src/v1/routes/user/user.routes';
import v1ProtectedRoutes from 'src/v1/routes/protected/protected.routes';

const app = express();

const MongoSessionStore = connectMongo(session);
const store = new MongoSessionStore({
  uri: process.env.MONGODB_URI as string,
  collection: 'sessions',
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per 15 minutes
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 1,
  delayMs: () => 2000,
});

/**
 * Express packages
 */

// Setting Security headers
app.use(helmet());

// logging http requests
app.use(morgan('dev'));

// API rate limit
app.use(limiter);

// API Speed limiter after certain amount of requests
app.use(speedLimiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(cookieParser());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Protect mongodb against nosql attacks
app.use(mongoSanitize());

// Routes
app.use('/v1/users', v1UserRoutes);
app.use('/v1/roles', v1RoleRoutes);
app.use('/v1/teachers', v1TeacherRoutes);
app.use('/v1/students', v1StudentRoutes);
app.use('/v1/studentTiers', v1StudentTierRoutes);
app.use('/v1/subjects', v1SubjectRoutes);
app.use('/v1/studentExams', v1StudentExamRoutes);
app.use('/v1/teacherExams', v1TeacherExamRoutes);
app.use('/v1/examTypes', v1ExamTypeRoutes);
app.use('/v1/permissions', v1PermissionRoutes);
app.use('/v1/enrollments', v1EnrollmentRoutes);

mongoConnect(() => {
  app.listen(process.env.PORT);
  V1SwaggerDocs(app, process.env.PORT as unknown as number);
});
