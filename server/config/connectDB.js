import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const db = mongoose.connection;
    db.on('connected', () => console.log('MongoDB connected'));
    db.on('error', (err) => console.log(err));
  } catch (err) {
    console.log("Something is wrong", err);
  }
}

export default connectDB;