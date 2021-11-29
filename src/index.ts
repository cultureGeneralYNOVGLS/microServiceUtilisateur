import express from 'express';
import userRouter from './routes/user.router';
import loginRouter from './routes/login.router';
import authRouter from './routes/auth.router';

const app = express();
const port = 7510; // default port to listen
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

// middleware used to parse incoming requests with JSON payloads
app.use(express.json())

// CORS
app.use(cors())

// API Routes
app.use('/api/user', userRouter)
app.use('/api/user/login', loginRouter)
app.use('/api/user/auth', authRouter)

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
