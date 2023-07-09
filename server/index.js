require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const errorHandler = require('./handlers/error');
const authRouter = require('./routes/auth');

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
// app.use('/api/users/:id/messages', messageRouter)

// Wrong url matching
app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
})