import { Request, Response } from 'express';
import { BadRequestException } from '../../Utils/res/error.response';
import {
  deleteFromCloudinary,
  uploadToCloudinary
} from '../../Utils/cloudinary/cloudinary.utils';
import { skillModel } from '../../DB/Models/skills.model';
import { ICreateSkillDTO, IUpdateSkillDTO } from './skills.dto';

export const skillsService = {
  addSkill: async (req: Request, res: Response): Promise<Response> => {
    const { name, category, order }: ICreateSkillDTO = req.body;

    if (!req.file) {
      throw new BadRequestException('Image file is required');
    }

    const image = await uploadToCloudinary({
      buffer: req.file.buffer,
      folder: 'portfolio/skills'
    });

    try {
      const skill = await skillModel.create({
        name,
        category,
        order,
        image
      });

      return res.status(201).json({
        message: 'Skill added successfully',
        skill
      });
    } catch (error) {
      // Delete image from Cloudinary if database creation fails
      await deleteFromCloudinary({
        publicId: image.public_id
      });

      throw error;
    }
  },
  getAllSkills: async (req: Request, res: Response): Promise<Response> => {
    const skills = await skillModel.find().sort({ order: 1 });

    if (!skills) {
      throw new BadRequestException('No skills found');
    }

    return res.status(200).json({
      message: 'Skills fetched successfully',
      skills
    });
  },
  getSkillId: async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const skills = await skillModel.findById(id);
    if (!skills) {
      throw new BadRequestException('No skills found');
    }

    return res.status(200).json({
      message: 'Skills fetched successfully',
      skills
    });
  },
  updateSkill: async (req: Request, res: Response): Promise<Response> => {
    const { name, category, order }: IUpdateSkillDTO = req.body;
    const { id } = req.params;

    const skill = await skillModel.findById(id);

    if (!skill) {
      throw new BadRequestException('Skill not found');
    }

    const oldImage = skill.image;

    let newImage;

    if (req.file) {
      newImage = await uploadToCloudinary({
        buffer: req.file.buffer,
        folder: 'portfolio/skills'
      });

      skill.image = newImage;
    }

    if (name !== undefined) {
      skill.name = name;
    }

    if (category !== undefined) {
      skill.category = category;
    }

    if (order !== undefined) {
      skill.order = order;
    }

    try {
      await skill.save();
    } catch (error) {
      // Database failed → delete the NEW image
      if (newImage) {
        await deleteFromCloudinary({
          publicId: newImage.public_id
        });
      }

      throw error;
    }

    // Database succeeded → delete the OLD image
    if (newImage) {
      await deleteFromCloudinary({
        publicId: oldImage.public_id
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Skill updated successfully',
      data: skill
    });
  },
  deleteSkill: async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const skill = await skillModel.findById(id);

    if (!skill) {
      throw new BadRequestException('Skill not found');
    }

    await skillModel.findByIdAndDelete(id);

    await deleteFromCloudinary({
      publicId: skill.image.public_id
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Skill permanently deleted successfully'
    });
  }
};
