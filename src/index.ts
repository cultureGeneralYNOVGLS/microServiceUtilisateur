import express from 'express';
import loginRouter from './routes/login.router';
import userRouter from './routes/user.router';

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
app.use('/api/login', loginRouter)

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
