import { memo } from 'react';
import PropTypes from 'prop-types';

const FontPreview = ({ font, isReady }) => {
  // Apply font styling based on the selected font
  const textStyle = isReady ? {
    fontFamily: font.family,
  } : {
    // Fallback font while loading or if there's an error
    fontFamily: 'system-ui, sans-serif',
  };

  return (
    <div className="font-preview-container">
      <h2>Font Preview: {font.name}</h2>
      <div className="font-info">
        <p><strong>Font ID:</strong> {font.id}</p>
        <p><strong>Type:</strong> {font.isExternal ? 'External' : 'System'}</p>
        {font.isExternal && (
          <>
            <p><strong>URL:</strong> {font.url}</p>
            <p><strong>Format:</strong> {font.format}</p>
          </>
        )}
        <p><strong>Status:</strong> {isReady ? 'Ready' : 'Loading...'}</p>
      </div>

      <div className="preview-text" style={textStyle}>
        <h3 style={textStyle}>Heading with {font.name}</h3>
        <p style={textStyle}>
          This is a paragraph set in {font.name}. The quick brown fox jumps over the lazy dog.
          This sentence demonstrates how the font renders various characters and spacing.
        </p>
        <p style={textStyle} className="large-text">
          Large Text Sample
        </p>
        <p style={textStyle} className="small-text">
          Small text sample for examining details in the font.
        </p>
      </div>
    </div>
  );
};

FontPreview.propTypes = {
  font: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    family: PropTypes.string.isRequired,
    isExternal: PropTypes.bool.isRequired,
    url: PropTypes.string,
    format: PropTypes.string
  }).isRequired,
  isReady: PropTypes.bool.isRequired
};

export default memo(FontPreview);
