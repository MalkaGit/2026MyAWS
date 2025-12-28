//8.5
// src/server.ts
// Goal: start express app
//  not fw agnostic (tied to express)
import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
