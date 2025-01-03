import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import flash from 'express-flash';
import path from 'path';
import session from 'express-session';
import morgan from 'morgan';
import helmet from 'helmet';

import connectMongo from 'connect-mongodb-session';
import { mongoConnect, connectionString } from './db/index';

import homeRoutes from './routes/homeRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import roleRoutes from './routes/roleRoutes';
import teacherRoutes from './routes/teacherRoutes';
import studentRoutes from './routes/studentRoutes';
import studentTierRoutes from './routes/studentTierRoutes';
import courseRoutes from './routes/courseRoutes';
import examTypeRoutes from './routes/examTypeRoutes';
import examRoutes from './routes/examRoutes';

const app = express();
const PORT = 80;

const MongoSessionStore = connectMongo(session);
const store = new MongoSessionStore({
  uri: connectionString,
  collection: 'sessions',
});

// Express packages

// Setting Security headers
app.use(helmet());

// logging http requests
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(cors());
app.use(session({
  secret: '4f9h8G2k1LzR',
  resave: false,
  saveUninitialized: false,
  store: store,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(express.json());

// Routes
app.use(homeRoutes);
app.use(authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);
app.use('/studentTiers', studentTierRoutes);
app.use('/courseRoutes', courseRoutes);
app.use('/exams', examRoutes);
app.use('/examTypes', examTypeRoutes);

mongoConnect(() => app.listen(PORT));