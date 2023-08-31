import mongoose from 'mongoose';

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDb = async () => {
  const connectionUrl = 'mongodb+srv://youssifhegab:Welcome123@nextjs-ecommerce.r1tuev7.mongodb.net/';
  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log('Ecommerce database connected successfully!'))
    .catch(err => console.log(`Getting Error from DB connection ${err.message}`));
};

export default connectToDb;
