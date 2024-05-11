import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

async function run() {
  try {
    await mongoose.connect(DB_URI);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.info("Database connection successful");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
