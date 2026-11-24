import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 3000;

try {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`API: http://localhost:${PORT}`);
  });
} catch (err) {
  const message = process.env.MONGODB_URI
    ? `Veritabanına bağlanılamadı (${err.name}). MONGODB_URI ve ağ erişimini kontrol edin.`
    : "MONGODB_URI tanımlı değil";
  console.error(message);
  process.exitCode = 1;
}
