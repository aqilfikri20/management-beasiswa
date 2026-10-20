import "dotenv/config";

import app from "./app.js";

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`RBAC Service running on http://localhost:${PORT}`);
});