const mongoose = require('mongoose');


const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    boolean: Boolean,
    default: false
  }
})

module.exports = Task;