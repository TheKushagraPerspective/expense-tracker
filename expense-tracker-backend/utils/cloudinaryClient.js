const cloudinary = require("cloudinary").v2;
const fs = require("fs")
require("dotenv").config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});


/**
 * Upload a local file (saved by multer) to Cloudinary.
 * On failure, attempts to delete the local temp file to avoid leftover files.
 * Returns the upload result object on success, or null on failure.
 */
const uploadOnCLoudinary = async(localFilePath) => {
    try {
        if(!localFilePath) {
            return null;
        }

        const uploadResult = await cloudinary.uploader.upload(localFilePath , {
            resource_type: "auto"
        });

        console.log("Uploaded to cloudinary " , uploadResult.secure_url);

        return uploadResult;
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        // try to remove temp file if upload failed
        try {
            await fs.promises.unlink(localFilePath);
        } catch (unlinkErr) {
            // ignore unlink errors (file might already be gone)
            console.error("Failed to delete temp file after upload error:", unlinkErr?.message);
        }

        return null;
    }
};


const deleteFromCloudinary = async(public_id) => {
    try {
        if(!public_id) {
            return null;
        }

        await cloudinary.uploader.destroy(public_id);
        console.log("Deleted from Cloudinary:", public_id);
        return true;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return false;
    }
}

module.exports = {uploadOnCLoudinary , deleteFromCloudinary};
