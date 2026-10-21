import { Request, Response } from 'express';

import { experienceModel } from '../../DB/Models/experience.model';
import {
  deleteFromCloudinary,
  uploadToCloudinary
} from '../../Utils/cloudinary/cloudinary.utils';
import { BadRequestException } from '../../Utils/res/error.response';

import { ICreateExperienceDTO, IUpdateExperienceDTO } from './experience.dto';

export const experienceService = {
  addExperience: async (req: Request, res: Response): Promise<Response> => {
    const {
      company,
      companyWebsite,
      companyLinkedIn,
      position,
      type,
      location,
      description,
      startDate,
      endDate,
      isCurrent,
      technologies
    }: ICreateExperienceDTO = req.body;

    if (!req.file) {
      throw new BadRequestException('Image file is required');
    }

    const technologiesArray = technologies
      .split(',')
      .map(technology => technology.trim())
      .filter(Boolean);

    if (!technologiesArray.length) {
      throw new BadRequestException('At least one technology is required');
    }

    const image = await uploadToCloudinary({
      buffer: req.file.buffer,
      folder: 'portfolio/experience'
    });

    try {
      const experience = await experienceModel.create({
        company,
        companyWebsite,
        companyLinkedIn,
        position,
        type,
        location,
        description,
        startDate,
        endDate,
        isCurrent,
        technologies: technologiesArray,
        image
      });

      return res.status(201).json({
        statusCode: 201,
        message: 'Experience created successfully',
        data: experience
      });
    } catch (error) {
      // Delete image from Cloudinary if database creation fails
      await deleteFromCloudinary({
        publicId: image.public_id
      });

      throw error;
    }
  },
  getExperience: async (req: Request, res: Response): Promise<Response> => {
    try {
      const experience = await experienceModel.find().sort({ createdAt: -1 });
      return res.status(200).json({
        statusCode: 200,
        message: 'Experience fetched successfully',
        data: experience
      });
    } catch (error) {
      throw error;
    }
  },
  getExperienceById: async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const experienceId = await experienceModel.findById(id);
    if (!experienceId) throw new BadRequestException('Experience not found');
    return res.status(200).json({
      statusCode: 200,
      message: 'Experience fetched successfully',
      data: experienceId
    });
  },
  updateExperience: async (req: Request, res: Response): Promise<Response> => {
    const { experienceId } = req.params;

    const experience = await experienceModel.findById(experienceId);

    if (!experience) {
      throw new BadRequestException('Experience not found');
    }

    const oldImage = experience.image;

    let newImage;

    // Upload new image if provided
    if (req.file) {
      newImage = await uploadToCloudinary({
        buffer: req.file.buffer,
        folder: 'portfolio/experience'
      });

      experience.image = newImage;
    }

    const {
      company,
      companyWebsite,
      companyLinkedIn,
      position,
      type,
      location,
      description,
      startDate,
      endDate,
      isCurrent,
      technologies
    }: IUpdateExperienceDTO = req.body;

    if (company !== undefined) {
      experience.company = company;
    }

    if (companyWebsite !== undefined) {
      experience.companyWebsite = companyWebsite;
    }

    if (companyLinkedIn !== undefined) {
      experience.companyLinkedIn = companyLinkedIn;
    }

    if (position !== undefined) {
      experience.position = position;
    }

    if (type !== undefined) {
      experience.type = type;
    }

    if (location !== undefined) {
      experience.location = location;
    }

    if (description !== undefined) {
      experience.description = description;
    }

    if (startDate !== undefined) {
      experience.startDate = startDate;
    }

    if (endDate !== undefined) {
      experience.endDate = endDate;
    }

    if (isCurrent !== undefined) {
      experience.isCurrent = isCurrent;
    }

    if (technologies !== undefined) {
      const technologiesArray = technologies
        .split(',')
        .map(technology => technology.trim())
        .filter(Boolean);

      if (!technologiesArray.length) {
        throw new BadRequestException('At least one technology is required');
      }

      experience.technologies = technologiesArray;
    }

    try {
      await experience.save();
    } catch (error) {
      // Database update failed → delete the NEW image
      if (newImage) {
        await deleteFromCloudinary({
          publicId: newImage.public_id
        });
      }

      throw error;
    }

    // Database update succeeded → delete the OLD image
    if (newImage) {
      await deleteFromCloudinary({
        publicId: oldImage.public_id
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Experience updated successfully',
      data: experience
    });
  },
  deleteExperience: async (req: Request, res: Response): Promise<Response> => {
    const { experienceId } = req.params;

    const experience = await experienceModel.findById(experienceId);

    if (!experience) {
      throw new BadRequestException('Experience not found');
    }

    await experienceModel.findByIdAndDelete(experienceId);

    await deleteFromCloudinary({
      publicId: experience.image.public_id
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Experience permanently deleted successfully'
    });
  }
};
