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


app.post('/upload', upload.single('upload'), (request, response) => {
  response.send()
}, (error, request, response, next) => {
  response.status(400).send({ error: error.message })
});




app.listen(PORT, () => {
  console.log('App is listening on port ' + PORT);
});


