import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { port, logger } from './config';
import authRoutes from './routes/auth';
import path from 'path'

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes)
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '/index.html')) })

app.listen(port, () => logger.info(`The server is running on port ${port}`));


