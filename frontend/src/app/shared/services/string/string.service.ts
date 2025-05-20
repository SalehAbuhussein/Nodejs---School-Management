import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringService {

  // TODO: This section is designated for implementing string checking and handling using regex or any other suitable method.
  // This is the right place for adding any global string checks if needed.

  // this regex was found at http://emailregex.com/
  emailRegex: RegExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  // this regex catch this forbidden characters [..., <, >, •]
  forbiddenCharRegex: RegExp = new RegExp(/(\.\.\.)|<|>|•/g);

  // URL Checkers
  urlRegex: RegExp = new RegExp(/^(http|https):\/\//i);
  urlSchemes: string[] = ['http', 'https', 'mailto:'];
  mailtoRegex: RegExp = new RegExp(/^mailto:/i);
  protocolRegex: RegExp = new RegExp(/:\/\//i);

  constructor() { }

  /**
   * Capitalizes the string passed in
   * @param string the string to capitalize
   */
  public capitalizeString(string: string): string {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
  }

  /**
   * Checks if email is valid email,
   * @param value the email value to check
   * @returns {boolean} - true if it is valid email
   */
  public isValidEmail(value: string): boolean {
    return this.emailRegex.test(value);
  }

  /**
   * Perform some checks for whether a URL is valid or not
   * Not a definitive answer, but will catch many errors
   * @param maybeURL
   */
  public isValidUrl(maybeURL: string): boolean {
    if ( maybeURL.trim().includes(' ') || !maybeURL.includes('.') ) {
      return false;
    }

    try {
      const url: URL = new URL(maybeURL);

      return (['http:', 'https:', 'mailto:'].includes(url.protocol));

    } catch (err) {
      return false;
    }
  }

  /**
   * Sanitizes links for purposes of text boxes
   * - Removes leading/trailing spaces
   * - Prepends with `https://` if does not have protocol (`http://`, `https://`, `mailto:`)
   * @param text Link to sanitize
   */
  public sanitizeLink(text: string): string {
    let url: string = text.replace(/\s/g, '');
    if (this.protocolRegex.test(url)) {
      const protocolValidation: string[] = url.split(this.protocolRegex);
      if (!this.urlSchemes.includes(protocolValidation[0].toLowerCase())) {
        protocolValidation.splice(0, 1, 'https://');
        url = protocolValidation.join('');
      }
    }
    if (!(url === '') && !(this.urlRegex.test(url) || this.mailtoRegex.test(url))) {
      url = `https://${url}`;
    }

    return (url);
  }

  /**
   * Determine if text starts with a protocol
   * @param text the text to check
   */
  public startsWithProtocol(text: string): boolean {
    return text.startsWith('https://') || text.startsWith('http://');
  }

  /**
   * Get user's name minus their last name (accounts for cases of two first names)
   * @param fullName the full name of the user
   */
  getFirstNameFromFullname(fullName: string = ''): string {
    return fullName.split(' ').slice(0, 1).join(' ');
  }
}
