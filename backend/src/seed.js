import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import { Event } from "./models/event-model.js";
import { seedEvents } from "./data/seed-events.js";

try {
  await connectDatabase();
  await Promise.all(seedEvents.map((event) => new Event(event).validate()));
  await Event.deleteMany({});
  const created = await Event.insertMany(seedEvents);
  console.log(`${created.length} etkinlik eklendi`);
} catch (err) {
  console.error(`Seed tamamlanamadı (${err.name}). Veritabanı ayarlarını ve örnek verileri kontrol edin.`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
