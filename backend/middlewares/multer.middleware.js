import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join("uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // console.log("fileName", file);
        
        cb(null, Date.now() + "-" + file.originalname)
    }
});

export const upload = multer({
    storage,
    // limits: { fileSize: 3 * 1024 * 1024 }
});