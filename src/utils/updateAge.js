require('../db/mongoose');
const User = require('../models/user');


const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });

  return count;
}

updateAgeAndCount("5ddf176458b7982008e2761c", 3000).then((count) => {
  console.log('Count', count);
});