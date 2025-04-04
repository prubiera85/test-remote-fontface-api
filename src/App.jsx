import { useState, useEffect } from 'react';
import './App.css';
import FontPreview from './components/FontPreview';
import { loadExternalFont } from './utils/fontLoader';

// Mock for external fonts - in a real app these would come from an API
const EXTERNAL_FONTS = [
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
  }
];

// All available fonts including system fonts
const AVAILABLE_FONTS = [
  { id: 'system-sans', name: 'System Sans-Serif', family: 'Arial, sans-serif', isExternal: false },
  { id: 'system-serif', name: 'System Serif', family: 'Georgia, serif', isExternal: false },
  ...EXTERNAL_FONTS.map(font => ({ ...font, isExternal: true, family: font.name }))
];

function App() {
  const [selectedFont, setSelectedFont] = useState(AVAILABLE_FONTS[0]);
  const [loadedFonts, setLoadedFonts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load external font when selected
  useEffect(() => {
    if (selectedFont.isExternal && !loadedFonts.includes(selectedFont.id)) {
      setIsLoading(true);
      setError(null);

      loadExternalFont(selectedFont)
        .then(() => {
          setLoadedFonts(prev => [...prev, selectedFont.id]);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to load font:', err);
          setError(`Failed to load font: ${err.message}`);
          setIsLoading(false);
        });
    }
  }, [selectedFont, loadedFonts]);

  const handleFontChange = (e) => {
    const fontId = e.target.value;
    const font = AVAILABLE_FONTS.find(f => f.id === fontId);
    setSelectedFont(font);
  };

  return (
    <div className="app-container">
      <h1>Font Testing App</h1>

      <div className="font-selector">
        <label htmlFor="font-select">Choose a font:</label>
        <select
          id="font-select"
          value={selectedFont.id}
          onChange={handleFontChange}
          disabled={isLoading}
        >
          {AVAILABLE_FONTS.map(font => (
            <option key={font.id} value={font.id}>
              {font.name} {font.isExternal ? '(External)' : '(System)'}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="loading">Loading font...</p>}
      {error && <p className="error">{error}</p>}

      <FontPreview
        font={selectedFont}
        isReady={!selectedFont.isExternal || loadedFonts.includes(selectedFont.id)}
      />
    </div>
  );
}

export default App;
