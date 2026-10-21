import { Request, Response } from 'express';

import { resumeModel } from '../../DB/Models/resume.model';

import {
  deleteFromCloudinary,
  uploadToCloudinary
} from '../../Utils/cloudinary/cloudinary.utils';

import { BadRequestException } from '../../Utils/res/error.response';

export const resumeService = {
  getResume: async (req: Request, res: Response): Promise<Response> => {
    const resume = await resumeModel.findOne();

    if (!resume) {
      throw new BadRequestException('Resume not found');
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Resume fetched successfully',
      data: resume
    });
  },

  uploadOrUpdateResume: async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (!req.file) {
      throw new BadRequestException('Resume file is required');
    }

    const existingResume = await resumeModel.findOne();

    const newFile = await uploadToCloudinary({
      buffer: req.file.buffer,
      folder: 'portfolio/resume',
      resourceType: 'raw'
    });

    // First upload
    if (!existingResume) {
      try {
        const resume = await resumeModel.create({
          file: newFile
        });

        return res.status(201).json({
          statusCode: 201,
          message: 'Resume uploaded successfully',
          data: resume
        });
      } catch (error) {
        await deleteFromCloudinary({
          publicId: newFile.public_id,
          resourceType: 'raw'
        });

        throw error;
      }
    }

    // Update existing resume
    const oldFile = existingResume.file;

    existingResume.file = newFile;

    try {
      await existingResume.save();
    } catch (error) {
      await deleteFromCloudinary({
        publicId: newFile.public_id,
        resourceType: 'raw'
      });

      throw error;
    }

    // Delete old resume after successful DB update
    await deleteFromCloudinary({
      publicId: oldFile.public_id,
      resourceType: 'raw'
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Resume updated successfully',
      data: existingResume
    });
  }
};
