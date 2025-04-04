import { render, screen } from '@testing-library/react';
import FontPreview from '../../components/FontPreview';

describe('FontPreview Component', () => {
  // Sample font data for testing
  const systemFont = {
    id: 'system-sans',
    name: 'System Sans-Serif',
    family: 'Arial, sans-serif',
    isExternal: false
  };

  const externalFont = {
    id: 'open-sans',
    name: 'Open Sans',
    family: 'Open Sans',
    isExternal: true,
    url: 'https://example.com/font.woff2',
    format: 'woff2'
  };

  test('renders correctly with a system font', () => {
    render(<FontPreview font={systemFont} isReady={true} />);

    // Check that the font name is displayed
    expect(screen.getByText(`Font Preview: ${systemFont.name}`)).toBeInTheDocument();

    // Check that font info is displayed correctly
    expect(screen.getByText(/Font ID:/)).toHaveTextContent(`Font ID: ${systemFont.id}`);
    expect(screen.getByText(/Type:/)).toHaveTextContent('Type: System');
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Ready');

    // Check that the preview text is displayed
    expect(screen.getByText(`Heading with ${systemFont.name}`)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`This is a paragraph set in ${systemFont.name}`))).toBeInTheDocument();
  });

  test('renders correctly with an external font that is ready', () => {
    render(<FontPreview font={externalFont} isReady={true} />);

    // Check that the font name is displayed
    expect(screen.getByText(`Font Preview: ${externalFont.name}`)).toBeInTheDocument();

    // Check that font info is displayed correctly
    expect(screen.getByText(/Font ID:/)).toHaveTextContent(`Font ID: ${externalFont.id}`);
    expect(screen.getByText(/Type:/)).toHaveTextContent('Type: External');
    expect(screen.getByText(/URL:/)).toHaveTextContent(`URL: ${externalFont.url}`);
    expect(screen.getByText(/Format:/)).toHaveTextContent(`Format: ${externalFont.format}`);
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Ready');
  });

  test('shows loading state for external font that is not ready', () => {
    render(<FontPreview font={externalFont} isReady={false} />);

    // Check for loading state
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Loading...');
  });

  test('applies the correct font family style when ready', () => {
    const { container } = render(<FontPreview font={systemFont} isReady={true} />);

    // Find the preview text element
    const previewTextDiv = container.querySelector('.preview-text');

    // Check that the font-family style is applied correctly
    expect(previewTextDiv).toHaveStyle(`font-family: ${systemFont.family}`);
  });

  test('applies fallback font family style when not ready', () => {
    const { container } = render(<FontPreview font={externalFont} isReady={false} />);

    // Find the preview text element
    const previewTextDiv = container.querySelector('.preview-text');

    // Check that the fallback font-family is applied
    expect(previewTextDiv).toHaveStyle('font-family: system-ui, sans-serif');
  });
});
