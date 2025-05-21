/* istanbul ignore file */

export interface GeneralConstants {
  /**
   * Asset path
   */
  assetsPath: string,


  v1ApiPrefix: string,

  /**
   * An empty function, used when a function is set dynamically to null it out
   */
  noop: () => void;
}

/**
 * Empty method that does nothing `() => {}`
 */
/* istanbul ignore next */
export function noop(): void {}

export const generalConstants: GeneralConstants = {
  assetsPath: 'app/assets/',
  v1ApiPrefix: 'v1',
  noop: noop,
};
