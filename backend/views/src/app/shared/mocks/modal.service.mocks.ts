import { BsModalService } from "ngx-bootstrap/modal";

export function mockModalService(): BsModalService {
  return {
    show: jasmine.createSpy('show'),
  } as unknown as BsModalService;
};