import { HttpClient } from "@angular/common/http";

export function mockHttpClient(): HttpClient {
  return {
    get: jasmine.createSpy('get'),
    post: jasmine.createSpy('post'),
    delete: jasmine.createSpy('delete'),
    patch: jasmine.createSpy('patch'),
  } as unknown as HttpClient;
}