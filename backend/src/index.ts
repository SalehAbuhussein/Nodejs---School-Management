import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import flash from 'express-flash';
import path from 'path';
import session from 'express-session';

import connectMongo from 'connect-mongodb-session';
import { mongoConnect, connectionString } from './db/index';

import homeRoutes from './routes/homeRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = 80;

const MongoSessionStore = connectMongo(session);
const store = new MongoSessionStore({
  uri: connectionString,
  collection: 'sessions',
});

// Express packages
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
app.use(userRoutes);
app.use(authRoutes);

mongoConnect(() => app.listen(PORT));