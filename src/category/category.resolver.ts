import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import {
  CategoryInput,
  UpdateCategoryInput,
  FindCategoryInput,
} from './inputs/category.input';
import { CreateCategoryDto } from './dto/category.dto';
@Resolver()
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [CreateCategoryDto])
  async categories() {
    return this.categoryService.findAll();
  }

  @Mutation(() => CreateCategoryDto)
  async createCategory(@Args('input') input: CategoryInput) {
    return this.categoryService.create(input);
  }

  @Query(() => CreateCategoryDto)
  async findCategory(@Args('input') input: FindCategoryInput) {
    return this.categoryService.findOne(input);
  }

  @Mutation(() => CreateCategoryDto)
  async updateCategory(@Args('input') input: UpdateCategoryInput) {
    return this.categoryService.update(input);
  }

  @Mutation(() => String)
  async deleteCategory(@Args('input') input: FindCategoryInput): Promise<any> {
    await this.categoryService.deleteCategory(input._id);
    return 'Category removed';
  }
}
