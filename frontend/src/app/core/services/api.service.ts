import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public static JSON_REQUEST: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  public static FORM_REQUEST: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  public headers: Record<string, string> = {
    'accept': '*/*',
    'x-app-name': 'motory',
    'x-device-type': 'web',
    'x-app-version': 'web',
  };

  constructor(public httpClient: HttpClient) { }
}
