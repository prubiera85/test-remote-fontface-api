import { useState, useEffect } from "react";
import "./App.css";
import FontPreview from "./components/FontPreview";
import { loadExternalFont } from "./utils/fontLoader";

// Mock for external fonts - in a real app these would come from an API
const EXTERNAL_FONTS = [
  {
    id: "open-sans",
    name: "Open Sans",
    url: "https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2",
    format: "woff2",
  },
  {
    id: "roboto",
    name: "Roboto",
    url: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
    format: "woff2",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    url: "https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52_wFZWMf6.woff2",
    format: "woff2",
  },
];

// All available fonts including system fonts
const AVAILABLE_FONTS = [
  {
    id: "system-sans",
    name: "Arial - System Sans-Serif",
    family: "Arial",
    isExternal: false,
  },
  {
    id: "system-serif",
    name: "Georgia - System Serif",
    family: "Georgia",
    isExternal: false,
  },
  ...EXTERNAL_FONTS.map((font) => ({
    ...font,
    isExternal: true,
    family: font.name,
  })),
];

function App() {
  const [selectedFont, setSelectedFont] = useState(AVAILABLE_FONTS[0]);
  const [loadedFonts, setLoadedFonts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Preload all external fonts on component mount
  useEffect(() => {
    const loadAllFonts = async () => {
      setIsLoading(true);

      try {
        const fontPromises = EXTERNAL_FONTS.map(font => loadExternalFont(font));
        await Promise.all(fontPromises);

        setLoadedFonts(EXTERNAL_FONTS.map(font => font.id));
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load fonts:", err);
        setError(`Failed to load fonts: ${err.message}`);
        setIsLoading(false);
      }
    };

    loadAllFonts();
  }, []);

  // Load external font when selected
  useEffect(() => {
    if (selectedFont.isExternal && !loadedFonts.includes(selectedFont.id)) {
      setIsLoading(true);
      setError(null);

      loadExternalFont(selectedFont)
        .then(() => {
          setLoadedFonts((prev) => [...prev, selectedFont.id]);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load font:", err);
          setError(`Failed to load font: ${err.message}`);
          setIsLoading(false);
        });
    }
  }, [selectedFont, loadedFonts]);

  const handleFontChange = (e) => {
    const fontId = e.target.value;
    const font = AVAILABLE_FONTS.find((f) => f.id === fontId);
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
          {AVAILABLE_FONTS.map((font) => (
            <option
              key={font.id}
              value={font.id}
              style={{
                fontFamily: font.isExternal && loadedFonts.includes(font.id)
                  ? `"${font.family}", system-ui, sans-serif`
                  : font.family
              }}
            >
              {font.name} {font.isExternal ? "(External)" : "(System)"}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="loading">Loading fonts...</p>}
      {error && <p className="error">{error}</p>}

      <FontPreview
        font={selectedFont}
        isReady={
          !selectedFont.isExternal || loadedFonts.includes(selectedFont.id)
        }
      />
    </div>
  );
}

export default App;
