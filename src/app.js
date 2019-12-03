const express = require('express');
const PORT = process.env.PORT || 3000;

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const auth = require('./middleware/auth');

require('dotenv').config();
require('./db/mongoose');

const app = express();

// app.use(auth);


// Maitenance mode
// app.use((request, response) => {
//   response.status(503).send('Sorry site is in maitenance mode');
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log('App is listening on port ' + PORT);
})

const jwt = require('jsonwebtoken');

const myFunction = async () => {
  const token = jwt.sign({ _id: 'afeaifejo1'}, 'thisismynewcourse')
  console.log(token);
};

myFunction()