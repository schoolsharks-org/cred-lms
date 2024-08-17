import express from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/db';
import v1Routes from './routes/v1/index';
import errorHandlerMiddleware from './middlewares/errorHandler.middleware';
import notFoundMiddleware from './middlewares/notFound.middleware';
import cookieParser from "cookie-parser"

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(helmet());
app.use(cookieParser())

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', v1Routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
