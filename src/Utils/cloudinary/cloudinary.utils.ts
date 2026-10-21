import { UploadApiResponse } from 'cloudinary';

import cloudinary from '../../config/cloudinary.config';

export interface ICloudinaryUpload {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async ({
  buffer,
  folder,
  resourceType = 'image'
}: {
  buffer: Buffer;
  folder: string;
  resourceType?: 'image' | 'raw' | 'auto';
}): Promise<ICloudinaryUpload> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed'));
          return;
        }

        const uploadResult = result as UploadApiResponse;

        resolve({
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id
        });
      }
    );

    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async ({
  publicId,
  resourceType = 'image'
}: {
  publicId: string;
  resourceType?: 'image' | 'raw' | 'auto';
}): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType
  });
};
