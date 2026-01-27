import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { VALIDATION_LIMITS } from '../../constants.js';

@InputType()
export class OptionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(VALIDATION_LIMITS.OPTION_MAX_LENGTH)
  value!: string;
}
