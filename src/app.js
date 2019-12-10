const express = require('express');
const PORT = process.env.PORT || 3000;
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

require('dotenv').config();
require('./db/mongoose');

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log('App is listening on port ' + PORT);
});


