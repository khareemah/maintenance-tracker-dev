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

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.get('/', (req, res) => {
  res.send(
    res.send('<h1>E-commerce API</h1><a href="/api-docs">Documentation</a>')
  );
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
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
