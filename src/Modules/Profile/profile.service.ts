import { Request, Response } from 'express';

import { profileModel } from '../../DB/Models/profile.model';

import {
  deleteFromCloudinary,
  uploadToCloudinary
} from '../../Utils/cloudinary/cloudinary.utils';

import { BadRequestException } from '../../Utils/res/error.response';

import { ICreateProfileDTO, IUpdateProfileDTO } from './profile.dto';

export const profileService = {
  createProfile: async (req: Request, res: Response): Promise<Response> => {
    const existingProfile = await profileModel.findOne();

    if (existingProfile) {
      throw new BadRequestException('Profile already exists');
    }

    const {
      name,
      headline,
      bio,
      email,
      location,
      github,
      linkedin
    }: ICreateProfileDTO = req.body;

    if (!req.file) {
      throw new BadRequestException('Profile image is required');
    }

    const image = await uploadToCloudinary({
      buffer: req.file.buffer,
      folder: 'portfolio/profile'
    });

    try {
      const profile = await profileModel.create({
        name,
        headline,
        bio,
        email,
        location,
        github,
        linkedin,
        image
      });

      return res.status(201).json({
        statusCode: 201,
        message: 'Profile created successfully',
        data: profile
      });
    } catch (error) {
      await deleteFromCloudinary({
        publicId: image.public_id
      });

      throw error;
    }
  },

  getProfile: async (req: Request, res: Response): Promise<Response> => {
    const profile = await profileModel.findOne();

    if (!profile) {
      throw new BadRequestException('Profile not found');
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Profile fetched successfully',
      data: profile
    });
  },

  updateProfile: async (req: Request, res: Response): Promise<Response> => {
    const profile = await profileModel.findOne();

    if (!profile) {
      throw new BadRequestException('Profile not found');
    }

    const oldImage = profile.image;

    let newImage;

    if (req.file) {
      newImage = await uploadToCloudinary({
        buffer: req.file.buffer,
        folder: 'portfolio/profile'
      });

      profile.image = newImage;
    }

    const {
      name,
      headline,
      bio,
      email,
      location,
      github,
      linkedin
    }: IUpdateProfileDTO = req.body;

    if (name !== undefined) {
      profile.name = name;
    }

    if (headline !== undefined) {
      profile.headline = headline;
    }

    if (bio !== undefined) {
      profile.bio = bio;
    }

    if (email !== undefined) {
      profile.email = email;
    }

    if (location !== undefined) {
      profile.location = location;
    }

    if (github !== undefined) {
      profile.github = github;
    }

    if (linkedin !== undefined) {
      profile.linkedin = linkedin;
    }

    try {
      await profile.save();
    } catch (error) {
      if (newImage) {
        await deleteFromCloudinary({
          publicId: newImage.public_id
        });
      }

      throw error;
    }

    if (newImage) {
      await deleteFromCloudinary({
        publicId: oldImage.public_id
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Profile updated successfully',
      data: profile
    });
  }
};

