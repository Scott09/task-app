const express = require('express');
const PORT = process.env.PORT || 3000;

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');


require('dotenv').config();
require('./db/mongoose');

const app = express();

const multer = require('multer');

const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000
  },
  fileFilter(request, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload a word document'))
    }
  }
});

const errorMiddleware = (request, response, next) => {
  throw new Error('From my middleware');
}

app.post('/upload', upload.single('upload'), (request, response) => {
  response.send()
}, (error, request, response, next) => {
  response.status(400).send({ error: error.message })
});

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