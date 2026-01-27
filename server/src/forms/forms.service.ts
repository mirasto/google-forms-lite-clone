import { Injectable } from '@nestjs/common';
import { Form, Response } from '../types.js';

@Injectable()
export class FormsService {
  private forms: Form[] = [];
  private responses: Response[] = [];

  constructor() {}

  getForms(): Form[] {
    return this.forms;
  }

  getForm(id: string): Form | undefined {
    return this.forms.find(form => form.id === id);
  }

  addForm(form: Form): void {
    this.forms.push(form);
  }

  getResponses(formId: string): Response[] {
    return this.responses.filter(response => response.formId === formId);
  }

  addResponse(response: Response): void {
    this.responses.push(response);
  }

  reset(): void {
    this.forms = [];
    this.responses = [];
  }
}
