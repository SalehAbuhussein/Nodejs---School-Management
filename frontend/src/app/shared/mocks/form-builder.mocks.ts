import { FormBuilder } from "@angular/forms";

export function mockFormBuilder(): FormBuilder {
  return {
    group: jasmine.createSpy('group'),
  } as unknown as FormBuilder
};