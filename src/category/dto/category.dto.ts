import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateCategoryDto {
  @Field()
  readonly _id: string;

  @Field()
  readonly name: string;

  @Field()
  createAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}
