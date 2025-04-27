import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
// import cookieSession from 'cookie-session';
import session from 'express-session';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import './passport/googleStrategy.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));


app.use(session({
  secret: process.env.COOKIE_KEY,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/menu', menuRoutes);

app.get('/', (req, res) => res.send('Server is running!'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
