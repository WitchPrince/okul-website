import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI tanımlı değil");
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const { host, name } = mongoose.connection;
  const source = uri.startsWith("mongodb+srv://") ? "Atlas" : "yerel";
  console.log(`MongoDB bağlandı (${source}): ${host}/${name}`);
}
