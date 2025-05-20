import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  constructor() { }

  /**
   * Check if text passed have number
   * 
   * @param value text to be filtered
   * @returns { boolean }
   */
  isNumber(value: string): boolean {
    return /\d/.test(value);
  }

  /**
   * Check if text passed is have special characters
   * 
   * @param value text to be filtered
   * @returns { boolean }
   */
  isSpecialCharacter(value: string): boolean {
    return /[^a-zA-Z0-9 ]/g.test(value);
  }

  /**
   * Check if text passed is valid name (No special characters and no numbers)
   * 
   * @param value text to be filtered
   * @returns { boolean }
   */
  isValidName(value: string): boolean {
    return !/(\d|[^a-zA-Z0-9 ])/g.test(value);
  }

  /**
   * Check if number passed is valid mobile number based on country request
   * 
   * @param number mobile number
   * @param country country code - jo or ksa
   * @returns { boolean }
   */
  isValidMobileNumber(number: string, country: string = 'ksa'): boolean {
    const mobileNumberRegex = {
      jo: /^(7\d{8}|07\d{8})$/,
      ksa: /^(5\d{8}|05\d{8})$/
    }
    return mobileNumberRegex[country as 'jo' | 'ksa'].test(number);
  }

  /**
   * Remove numbers from the text
   * 
   * @param value text to be filtered
   * @returns { string } string that have no numbers
   */
  removeNumbers(value: string): string {
    return value.replaceAll(/\d/g, '');
  }

  /**
   * Remove special characters from the text and preserve arabic characters
   * 
   * @param value text to be filtered
   * @returns 
   */
  removeSpecialCharacters = (value: string): string => {
    return value.replace(/[^\p{L}\p{N}\s]/gu, '');
  }

  /**
   * Remove arabic characters
   * 
   * @param value text to be filtered
   * @returns 
   */
  removeArabicCharacters = (value: string): string => {
    return value.replace(/[\u0600-\u06FF]/g, '');
  }

  /**
   * Remove characters from the text
   * 
   * @param value text to be filtered
   * @returns 
   */
  removeCharacters(value: string): string {
    return value.replace(/[a-zA-Z]/g, '');
  }

  /**
   * Remove characters and special characters from the text
   * 
   * @param value text to be filtered
   * @returns { string }
   */
  removeNumbersAndSpecialCharacters(value: string): string {
    return value.replace(/[^\p{L}\s]/gu, '');
  }
}
