import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional, ValidateNested, IsArray, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '@forms/shared';
import { OptionInput } from './option.input.js';
import { VALIDATION_LIMITS } from '../../constants.js';

@InputType()
export class CreateQuestionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(VALIDATION_LIMITS.TITLE_MAX_LENGTH)
  text!: string;

  @Field(() => String)
  @IsEnum(QuestionType)
  type!: QuestionType;

  @Field(() => [OptionInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionInput)
  options?: OptionInput[];

  @Field()
  @IsBoolean()
  required!: boolean;
}
