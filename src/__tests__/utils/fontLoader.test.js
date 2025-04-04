/**
 * @jest-environment jsdom
 */
import { loadExternalFont, isFontLoaded, fetchAvailableFonts } from '../../utils/fontLoader';

// Mock for FontFace API
class MockFontFace {
  constructor(family, source) {
    this.family = family;
    this.source = source;
    this.status = 'unloaded';
  }

  load() {
    this.status = 'loaded';
    return Promise.resolve(this);
  }
}

describe('FontLoader Utility', () => {
  let originalFontFace;
  let originalDocumentFonts;

  beforeEach(() => {
    // Save original globals
    originalFontFace = global.FontFace;
    originalDocumentFonts = document.fonts;

    // Mock FontFace API
    global.FontFace = MockFontFace;

    // Mock document.fonts
    document.fonts = {
      add: jest.fn(),
      check: jest.fn().mockReturnValue(true)
    };

    // Clear mocks between tests
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original globals
    global.FontFace = originalFontFace;
    document.fonts = originalDocumentFonts;
  });

  describe('loadExternalFont', () => {
    const fontData = {
      id: 'test-font',
      name: 'Test Font',
      url: 'https://example.com/font.woff2',
      format: 'woff2'
    };

    test('loads a font successfully', async () => {
      const loadedFont = await loadExternalFont(fontData);

      // Check that FontFace was created with correct parameters
      expect(loadedFont.family).toBe(fontData.name);
      expect(loadedFont.source).toBe(`url(${fontData.url}) format('${fontData.format}')`);

      // Check that font was added to document.fonts
      expect(document.fonts.add).toHaveBeenCalledWith(loadedFont);

      // Check that the font status is 'loaded'
      expect(loadedFont.status).toBe('loaded');
    });

    test('throws error when FontFace API is not supported', async () => {
      // Remove FontFace API
      global.FontFace = undefined;

      await expect(loadExternalFont(fontData)).rejects.toThrow(
        'FontFace API is not supported in this browser'
      );
    });
  });

  describe('isFontLoaded', () => {
    test('returns true when font is loaded', async () => {
      const result = await isFontLoaded('Test Font');

      expect(document.fonts.check).toHaveBeenCalledWith('1em "Test Font"');
      expect(result).toBe(true);
    });

    test('returns false when document.fonts.check is not available', async () => {
      // Remove document.fonts.check
      document.fonts.check = undefined;

      const result = await isFontLoaded('Test Font');
      expect(result).toBe(false);
    });
  });

  describe('fetchAvailableFonts', () => {
    test('returns mocked font data after delay', async () => {
      // Mock setTimeout to execute immediately
      jest.useFakeTimers();

      const fontPromise = fetchAvailableFonts();
      jest.runAllTimers();

      const fonts = await fontPromise;
      expect(fonts).toHaveLength(2);
      expect(fonts[0].name).toBe('Open Sans');
      expect(fonts[1].name).toBe('Roboto');

      jest.useRealTimers();
    });
  });
});
