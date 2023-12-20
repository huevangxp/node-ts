import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata"

import { AppDataSource } from './configs/db';

AppDataSource.initialize().then(() => {
    console.log('Server connect to database successfully');
}).catch((error) => {
    console.log('Server connect to database failed', error);
})


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 5000000000 }));

app.use('/api', require('./routes/userRoute').default)
app.use('/api', require('./routes/photoroute').default)

app.listen(port, () => {
    console.log('Server running on port ' + port);
})