import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import session from 'express-session';

import connectMongo from 'connect-mongodb-session';
import mongoSanitize from 'express-mongo-sanitize';
import { mongoConnect, connectionString } from 'src/db/index';

import swaggerDocs from 'src/swagger';
import authRoutes from 'src/routes/auth/authRoutes';
import courseRoutes from 'src/routes/course/courseRoutes';
import examRoutes from 'src/routes/exam/examRoutes';
import examTypeRoutes from 'src/routes/examType/examTypeRoutes';
import permissionRoutes from 'src/routes/permission/permissionRoutes';
import roleRoutes from 'src/routes/role/roleRoutes';
import studentRoutes from 'src/routes/student/studentRoutes';
import studentTierRoutes from 'src/routes/studentTier/studentTierRoutes';
import teacherRoutes from 'src/routes/teacher/teacherRoutes';
import userRoutes from 'src/routes/user/userRoutes';

const app = express();
const PORT = 80;

const MongoSessionStore = connectMongo(session);
const store = new MongoSessionStore({
  uri: connectionString,
  collection: 'sessions',
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per 15 minutes
})

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
app.use(cors());
app.use(session({
  secret: '4f9h8G2k1LzR',
  resave: false,
  saveUninitialized: false,
  store: store,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Protect mongodb against nosql attacks
app.use(mongoSanitize());

// Routes
app.use(authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);
app.use('/studentTiers', studentTierRoutes);
app.use('/courses', courseRoutes);
app.use('/exams', examRoutes);
app.use('/examTypes', examTypeRoutes);
app.use('/permissions', permissionRoutes);

mongoConnect(() => {
  app.listen(PORT);
  swaggerDocs(app, PORT);
});