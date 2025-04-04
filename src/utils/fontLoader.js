/**
 * Loads an external font using the FontFace API
 * @param {Object} fontData - The font data object
 * @param {string} fontData.id - Unique identifier for the font
 * @param {string} fontData.name - Display name of the font
 * @param {string} fontData.url - URL to the font file
 * @param {string} fontData.format - Font format (e.g., 'woff', 'woff2')
 * @returns {Promise<FontFace>} A promise that resolves with the loaded FontFace
 */
export const loadExternalFont = async (fontData) => {
  try {
    // Check if FontFace API is supported
    if (!('FontFace' in window)) {
      throw new Error('FontFace API is not supported in this browser');
    }

    // Create a new FontFace instance
    const fontFace = new FontFace(
      fontData.name,
      `url(${fontData.url}) format('${fontData.format}')`
    );

    // Load and add the font to the document fonts collection
    const loadedFont = await fontFace.load();
    document.fonts.add(loadedFont);

    console.log(`Font "${fontData.name}" loaded successfully`);
    return loadedFont;

  } catch (error) {
    console.error(`Error loading font "${fontData.name}":`, error);
    throw error;
  }
};

/**
 * Checks if a specific font is already loaded
 * @param {string} fontName - The name of the font to check
 * @returns {Promise<boolean>} A promise that resolves with true if the font is loaded, false otherwise
 */
export const isFontLoaded = async (fontName) => {
  // Check if the document.fonts API is available
  if (!document.fonts || !document.fonts.check) {
    console.warn('document.fonts.check API is not supported in this browser');
    return false;
  }

  return document.fonts.check(`1em "${fontName}"`);
};

/**
 * Simulates fetching fonts from an API endpoint
 * @returns {Promise<Array>} A promise that resolves with the list of available fonts
 */
export const fetchAvailableFonts = () => {
  // This is a mock function that simulates an API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve([
        {
          id: 'open-sans',
          name: 'Open Sans',
          url: 'https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2',
          format: 'woff2'
        },
        {
          id: 'roboto',
          name: 'Roboto',
          url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
          format: 'woff2'
        },
        {
          id: 'merriweather',
          name: 'Merriweather',
          url: 'https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52_wFZWMf6.woff2',
          format: 'woff2'
        }
      ]);
    }, 300);
  });
};
