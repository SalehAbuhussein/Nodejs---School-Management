import { BreadcrumbService } from "./breadcrumb.service";

export function mockBreadcrumbService(): BreadcrumbService {
  return {
    breadcrumbList: [],
  }
};