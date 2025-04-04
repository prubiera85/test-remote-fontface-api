// Import jest-dom to extend Jest with custom DOM element matchers
import '@testing-library/jest-dom';

// Mock for URL API which might not be available in the Jest environment
if (typeof URL.createObjectURL === 'undefined') {
  Object.defineProperty(URL, 'createObjectURL', { value: jest.fn() });
}
