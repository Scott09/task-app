// CRUD - Create Read Update Delete Mongo Operations

require('dotenv').config();
// destructure MongoClient method off of mongodb
const { MongoClient } = require('mongodb');
// pull connection URI from our env file
const connectionURI = process.env.MONGO_URI;
// store database name
const databaseName = 'task-app';

// Connection to client passing optional flags
MongoClient.connect(connectionURI, { useNewUrlParser: true}, (error, client) => {
  // handle any errors connecting to databse, return from function if we run into error
  if (error) {
    return console.log(error);
  }
  
  console.log('Connected to Mongo Database');

  // 
  const db = client.db(databaseName);

  // insert a document into Users collection
  db.collection('Users').insertOne({
    name: 'Scott',
    age: 27
  }, (error, result) => {
    if (error) {
      return console.log(error);
    }

    console.log(result.ops);
  })


  db.collection('Tasks').insertMany([
    {
      description: 'Do Laundry',
      completed: false
    },
    {
      description: 'Take out trash',
      completed: true
    },
    {
      description: 'Make Bed',
      completed: true
    }
  ], (error, result) => {
    if (error) {
      return console.log(error);
    }

    console.log(result.ops);
  })

});
