const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (file, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: "fashion-section",
      resource_type: resourceType,
    };

    // Image Optimization
    if (resourceType === "image") {
      options.quality = "auto";
      options.fetch_format = "auto";
    }

    // Video Optimization
    // Video Optimization
    if (resourceType === "video") {
      options.quality = "auto:good";
      options.fetch_format = "auto";

      options.video_codec = "auto";

      options.transformation = [
        {
          width: 1080,
          crop: "limit",
          quality: "auto:good",
        },
      ];
    }

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
/* const uploadToCloudinary = (file, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "fashion-section",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result);
      }
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(stream);
  });
}; */

module.exports = uploadToCloudinary;
