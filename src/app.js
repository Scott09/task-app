const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

app.post('/tasks', (request, response) => {

})


app.get('/', (request, response) => {
  response.send('Hey im the response')
})


app.listen(PORT, () => {
  console.log('App is listening on port ' + PORT);
})