import { Form, Response } from './types.js';


export class InMemoryStore {
  private forms: Form[] = [];
  private responses: Response[] = [];

  constructor() {}

  getForms(): Form[] {
    return this.forms;
  }

  getForm(id: string): Form | undefined {
    return this.forms.find(f => f.id === id);
  }

  addForm(form: Form): void {
    this.forms.push(form);
  }

  getResponses(formId: string): Response[] {
    return this.responses.filter(r => r.formId === formId);
  }

  addResponse(response: Response): void {
    this.responses.push(response);
  }

  reset(): void {
    this.forms = [];
    this.responses = [];
  }
}
