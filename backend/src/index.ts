import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import flash from 'express-flash';
import path from 'path';
import session from 'express-session';
import morgan from 'morgan';
import helmet from 'helmet';

import connectMongo from 'connect-mongodb-session';
import { mongoConnect, connectionString } from 'src/db/index';

import homeRoutes from 'src/routes/homeRoutes';
import userRoutes from 'src/routes/userRoutes';
import authRoutes from 'src/routes/authRoutes';
import roleRoutes from 'src/routes/roleRoutes';
import teacherRoutes from 'src/routes/teacherRoutes';
import studentRoutes from 'src/routes/studentRoutes';
import studentTierRoutes from 'src/routes/studentTierRoutes';
import courseRoutes from 'src/routes/courseRoutes';
import examTypeRoutes from 'src/routes/examTypeRoutes';
import examRoutes from 'src/routes/examRoutes';

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