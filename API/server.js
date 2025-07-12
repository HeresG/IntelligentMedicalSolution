
import express from 'express';
import dotenv from 'dotenv'
import { logRequest } from './config/index.js';
import checkDbConnection from './utils/runningDatabase.js';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import fileRouter from './routes/fileRouter.js';
import personalDataRouter from './routes/personalDataRouter.js';
import articleRouter from './routes/articleRouter.js';
import medicamenteRouter from './routes/medicamenteRouter.js';
import medicamentatieRouter from './routes/medicamentatieRouter.js';
import analizeRouter from './routes/analizeRouter.js';
import prisma from './config/databaseInstance.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(logRequest);
app.use(cors())


app.use('/api/auth', userRouter);
app.use('/api/file', fileRouter);
app.use('/api/personal', personalDataRouter);
app.use('/api/article', articleRouter);
app.use("/api/medicamente", medicamenteRouter);
app.use("/api/medicamentatie", medicamentatieRouter);
app.use("/api/analize/", analizeRouter);


app.use((req, res) => {
  res.status(404).json({ message: 'There is no such path' });
});



const gracefulShutdown = async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log('Conexiunea la baza de date a fost oprita!');
    process.exit(0);
  });
};

 (async () => {
  try {
    await checkDbConnection();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Serverul ruleaza pe portul: ${process.env.PORT || 5000}`);
    });

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('Nu s-a putut porni serverul din cauza unei erori la conexiunea la baza de date.');
  }
})()

