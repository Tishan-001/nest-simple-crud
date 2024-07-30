import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './category.schema';
import {
  CategoryInput,
  FindCategoryInput,
  UpdateCategoryInput,
} from './inputs/category.input';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async findAll(): Promise<CreateCategoryDto[]> {
    try {
      const categories = await this.categoryModel.find().exec();
      return categories.map((category) => ({
        _id: category._id.toString(),
        name: category.name,
        createAt: category.createdAt,
        updatedAt: category.updatedAt,
      }));
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  }

  async create(createCategoryInput: CategoryInput): Promise<CreateCategoryDto> {
    try {
      const existingCategory = await this.categoryModel
        .findOne({ name: createCategoryInput.name })
        .exec();
      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }

      const category = new this.categoryModel({
        ...createCategoryInput,
        createAt: new Date(),
      });
      const savedCategory = await category.save();
      return {
        _id: savedCategory._id.toString(),
        name: savedCategory.name,
        createAt: savedCategory.createdAt,
        updatedAt: savedCategory.updatedAt,
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async findOne(
    findCategoryInput: FindCategoryInput,
  ): Promise<CreateCategoryDto> {
    try {
      const category = await this.categoryModel
        .findById(findCategoryInput._id)
        .exec();
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return {
        _id: category._id.toString(),
        name: category.name,
        createAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    } catch (error) {
      throw new Error('Failed to find category');
    }
  }

  async update(
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<CreateCategoryDto> {
    try {
      const category = await this.categoryModel
        .findById(new Types.ObjectId(updateCategoryInput._id))
        .exec();
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      category.name = updateCategoryInput.name;
      category.updatedAt = new Date();
      const updatedCategory = await category.save();
      return {
        _id: updatedCategory._id.toString(),
        name: updatedCategory.name,
        createAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(_id: string): Promise<any> {
    try {
      const result = await this.categoryModel
        .deleteOne({ _id: new Types.ObjectId(_id) })
        .exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('Category not found');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
