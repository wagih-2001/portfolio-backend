import { Request, Response } from 'express';
import { ICreateDTO, IUpdateDTO } from './project.dto';
import { BadRequestException } from '../../Utils/res/error.response';
import {
  deleteFromCloudinary,
  uploadToCloudinary
} from '../../Utils/cloudinary/cloudinary.utils';
import { projectModel } from '../../DB/Models/project.model';

export const projectService = {
  addProject: async (req: Request, res: Response): Promise<Response> => {
    const { title, description, technologies, liveDemo, github }: ICreateDTO =
      req.body;

    if (!req.file) {
      throw new BadRequestException('Image file is required');
    }

    const technologiesArray = technologies
      // Remove whitespace and empty strings
      /*
    EX : technologies = "React, Next.js, Node.js, MongoDB, Express.js"
    to : [
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "Express.js"
    ]
    */
      .split(',')
      .map(technology => technology.trim())
      .filter(Boolean);

    if (!technologiesArray.length) {
      throw new BadRequestException('At least one technology is required');
    }

    const image = await uploadToCloudinary({
      buffer: req.file.buffer,
      folder: 'portfolio/projects'
    });

    try {
      const project = await projectModel.create({
        title,
        description,
        technologies: technologiesArray,
        image,
        liveDemo,
        github
      });

      return res.status(201).json({
        statusCode: 201,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      // Delete image from cloudinary if upload fails
      await deleteFromCloudinary({
        publicId: image.public_id
      });

      throw error;
    }
  },
  getProjects: async (req: Request, res: Response): Promise<Response> => {
    try {
      const projects = await projectModel.find().sort({ createdAt: -1 });

      return res.status(200).json({
        statusCode: 200,
        message: 'Projects fetched successfully',
        data: projects
      });
    } catch (error) {
      throw error;
    }
  },
  getProjectById: async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const projectId = await projectModel.findById(id);
    if (!projectId) throw new BadRequestException('Project not found');

    return res.status(200).json({
      statusCode: 200,
      message: 'Project fetched successfully',
      data: projectId
    });
  },
  updateProject: async (req: Request, res: Response): Promise<Response> => {
    const { projectId } = req.params;

    // Find the project
    const project = await projectModel.findOne({
      _id: projectId,
      deletedAt: null
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    // Save old image
    const oldImage = project.image;

    // Store new image
    let newImage;

    // Check if a new image exists
    if (req.file) {
      newImage = await uploadToCloudinary({
        buffer: req.file.buffer,
        folder: 'portfolio/projects'
      });

      project.image = newImage;
    }

    const { title, description, technologies, liveDemo, github }: IUpdateDTO =
      req.body;

    // Update title
    if (title !== undefined) {
      project.title = title;
    }

    // Update description
    if (description !== undefined) {
      project.description = description;
    }

    // Update technologies
    if (technologies !== undefined) {
      const technologiesArray = technologies
        .split(',')
        .map(technology => technology.trim())
        .filter(Boolean);

      if (!technologiesArray.length) {
        throw new BadRequestException('At least one technology is required');
      }

      project.technologies = technologiesArray;
    }

    // Update live demo
    if (liveDemo !== undefined) {
      project.liveDemo = liveDemo;
    }

    // Update GitHub
    if (github !== undefined) {
      project.github = github;
    }

    try {
      // Save updated project
      await project.save();
    } catch (error) {
      // Delete the new image if database update fails
      if (newImage) {
        await deleteFromCloudinary({
          publicId: newImage.public_id
        });
      }

      throw error;
    }

    // Delete old image after successful database update
    if (newImage) {
      await deleteFromCloudinary({
        publicId: oldImage.public_id
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Project updated successfully',
      data: project
    });
  },
  softDeleteProject: async (req: Request, res: Response): Promise<Response> => {
    const { projectId } = req.params;

    // Find the project
    const project = await projectModel.findOne({
      _id: projectId,
      deletedAt: null
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    project.deletedAt = new Date();

    await project.save();

    return res.status(200).json({
      statusCode: 200,
      message: 'Project soft deleted successfully'
    });
  },
  hardDeleteProject: async (req: Request, res: Response): Promise<Response> => {
    const { projectId } = req.params;

    // Find the project
    const project = await projectModel.findOne({
      _id: projectId
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    // Delete image from cloudinary
    await deleteFromCloudinary({
      publicId: project.image.public_id
    });
    // Delete project form database
    try {
      await projectModel.findByIdAndDelete(projectId);
    } catch (error) {
      throw error;
    }
    return res.status(200).json({
      statusCode: 200,
      message: 'Project permanently deleted successfully'
    });
  }
};
