import "dotenv/config";
import { server } from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
  server.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}.`);
  });
})
.catch(err => console.error(err));
