import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
    try {
        // Resolve the absolute file path
        const absoluteFilePath = path.resolve(filePath);
        console.log("Uploading file:", absoluteFilePath);

        // Check if the file exists before uploading
        if (!fs.existsSync(absoluteFilePath)) {
            console.error(`File not found: ${absoluteFilePath}`);
            throw new Error(`File not found: ${absoluteFilePath}`);
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(absoluteFilePath, {
            folder: 'uploads', // Optional: Specify a folder in Cloudinary
        });

        console.log("File uploaded to Cloudinary:", result);

        // Delete the file from the local filesystem after upload
        fs.unlinkSync(absoluteFilePath);

        return result;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

export { uploadOnCloudinary };