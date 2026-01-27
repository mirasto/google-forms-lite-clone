import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsArray, MaxLength, ArrayMaxSize } from 'class-validator';
import { VALIDATION_LIMITS } from '../../constants.js';

@InputType()
export class AnswerInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(VALIDATION_LIMITS.MAX_ANSWER_VALUES)
  @MaxLength(VALIDATION_LIMITS.DESC_MAX_LENGTH, { each: true }) 
  values!: string[];
}
