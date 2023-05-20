require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const connectDB = require('./db/connect');
var cookieParser = require('cookie-parser');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/notfound');
const authRouter = require('./routes/authRoute');
const userRequestRouter = require('./routes/userRequestRoute');
const adminRequestRouter = require('./routes/adminRequestRoute');

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/requests', adminRequestRouter);
app.use('/api/v1/users/requests', userRequestRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
