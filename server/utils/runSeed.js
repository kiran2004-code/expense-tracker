const mongoose = require('mongoose');
require('dotenv').config();
const { seedCategories } = require('./seedCategories');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  await seedCategories();
  console.log('Seeding done');
  mongoose.disconnect();
})
.catch(err => console.log(err));
