import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Form, Response, Answer, QuestionType, Question } from '../types.js';
import { AnswerInput } from './dto/answer.input.js';
import { ERROR_CODES } from '../constants.js';
import * as factories from '../factories.js';

@Injectable()
export class FormsService {
  private forms: Form[] = [];
  private responses: Response[] = [];


  getForms(): Form[] {
    return this.forms;
  }

  getForm(id: string): Form | undefined {
    return this.forms.find((form) => form.id === id);
  }


  addForm(form: Form): void {
    this.forms.push(form);
  }


  getResponses(formId: string): Response[] {
    return this.responses.filter((response) => response.formId === formId);
  }


  private addResponse(response: Response): void {
    this.responses.push(response);
  }


  submitResponse(formId: string, answers: AnswerInput[]): Response {
    const targetForm = this.getFormOrThrow(formId);
    const answersMap = new Map(answers.map((a) => [a.questionId, a]));
    
    const validAnswers: Answer[] = targetForm.questions.map((question) => {
      const answerInput = answersMap.get(question.id);
      
      this.validateRequired(question, answerInput);
      
      if (answerInput) {
        this.validateOptions(question, answerInput);
        return {
          questionId: question.id,
          values: answerInput.values,
        };
      }

      return { questionId: question.id, values: [] };
    });

    const newResponse = factories.createResponse(formId, validAnswers);
    this.addResponse(newResponse);
    
    return newResponse;
  }

  private getFormOrThrow(formId: string): Form {
    const form = this.getForm(formId);
    if (!form) {
      throw new GraphQLError('Form not found', {
        extensions: { code: ERROR_CODES.NOT_FOUND },
      });
    }
    return form;
  }


  private validateRequired(question: Question, answer?: AnswerInput): void {
    const hasValue = answer?.values.some((v) => v.trim() !== '') ?? false;
    
    if (question.required && !hasValue) {
      throw new GraphQLError(`Question "${question.text}" is required`, {
        extensions: { 
          code: ERROR_CODES.BAD_USER_INPUT, 
          field: question.id 
        },
      });
    }
  }

  private validateOptions(question: Question, answer: AnswerInput): void {
    if (question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX) {
      const allowedOptions = new Set(question.options.map((opt) => opt.value));
      
      for (const value of answer.values) {
        if (!allowedOptions.has(value)) {
          throw new GraphQLError(
            `Invalid option "${value}" for question "${question.text}"`,
            { extensions: { code: ERROR_CODES.BAD_USER_INPUT } }
          );
        }
      }
    }
  }


  reset(): void {
    this.forms = [];
    this.responses = [];
  }
}