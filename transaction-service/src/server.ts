import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3003;

app.listen(PORT, () => {
  console.log(`Transaction Service running on port ${PORT}`);
});