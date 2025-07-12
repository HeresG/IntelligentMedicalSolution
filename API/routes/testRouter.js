import express from 'express';

const testRouter = express.Router();

testRouter.get('/', (req, res) => {
  res.send({ message: 'Functioneaza!' });
});

export default testRouter

