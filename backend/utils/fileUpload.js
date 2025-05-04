// testing
import multer, { diskStorage } from 'multer';
import { uploader } from 'cloudinary';
import { config } from 'cloudinary';

/*
app.use("/uploads/files", express.static("uploads/files"));
const upload = multer({ dest: "uploads/files" })
*/

// Configure Cloudinary
// import { uploader } from 'cloudinary';
config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer
// const date = Date.now();
// let fileDir = `uploads/files/${date}`;
const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/files'); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Or generate a unique filename
    }
});
export const upload = multer({ storage: storage });

// Your route handler
/*
import { upload } from "../utils/fileUpload.js";
import { uploader } from 'cloudinary';
*/
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    uploader.upload(filePath, {
        resource_type: 'raw', // Or 'image', 'video'
    }, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error uploading file');
            return;
        }
        // Success!
        console.log(result);
        res.status(200).send(result.secure_url); // Send the Cloudinary URL
    });
});