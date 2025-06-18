// src/middleware/multer.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Define a local temp directory inside your project
const tempDir = path.join(process.cwd(), "temp");

//Ensure the temp folder exists (auto-create if missing)
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Multer disk storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // Save files to ./temp/
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// STEP 4: Export multer middleware
export const upload = multer({ storage });
