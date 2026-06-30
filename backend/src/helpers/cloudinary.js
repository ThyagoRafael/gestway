import { cloudinary } from "../config/cloudinary.js";

export function uploadToCloudinary(buffer, folder) {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "image", folder }, (error, result) => {
			if (error) return reject(error);

			resolve(result);
		});

		uploadStream.end(buffer);
	});
}

export async function deleteFromCloudinary(publicId) {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.destroy(publicId, (error, result) => {
			if (error) return reject(error);

			resolve(result);
		});
	});
}
