import bodyParser from 'body-parser';
import express from 'express';
import flash from 'express-flash';
import session from 'express-session';

import connectMongo from 'connect-mongodb-session';
import { mongoConnect, connectionString } from './db/index';

import homeRoutes from './routes/homeRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = 3000;

const MongoSessionStore = connectMongo(session);
const store = new MongoSessionStore({
  uri: connectionString,
  collection: 'sessions',
})

app.set('view engine', 'ejs');

// Express packages
app.use(session({
  secret: '4f9h8G2k1LzR',
  resave: false,
  saveUninitialized: false,
  store: store,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(flash());

// Routes
app.use(homeRoutes);
app.use(userRoutes);

mongoConnect(() => app.listen(PORT));