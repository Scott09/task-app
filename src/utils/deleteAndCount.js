require('../db/mongoose');

const Task = require('../models/task');


const deleteCountIncomplete = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false })
  return count;
}

deleteCountIncomplete("5de2e176784df036ee7958df").then((count) => {
  console.log('Count', count);
}).catch((error) => {
  console.log(error);
});

