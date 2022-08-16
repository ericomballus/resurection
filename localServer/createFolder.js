let fs = require("fs");
let dir = "./uploads";

if (!fs.existsSync(dir)) {
  console.log("created folder uploads");
  fs.mkdirSync(dir);
}

console.log("uploads folder ===");
