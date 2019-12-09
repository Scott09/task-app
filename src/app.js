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

const User = require('./models/user');
const Task = require('./models/task');

app.listen(PORT, () => {
  console.log('App is listening on port ' + PORT);
});


const main = async () => {
  const user = await User.findById("5dede48974d10ca59a17eec3");
  await user.populate('tasks').execPopulate();
  console.log(user.tasks);
}

main();