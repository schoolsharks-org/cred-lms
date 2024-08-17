import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    accent?: string; // Add the accent property
  }

  interface SimplePaletteColorOptions {
    accent?: string; // Add the accent property to options
  }

  interface Palette {
    tertiary: PaletteColor; // Define the tertiary palette
  }

  interface PaletteOptions {
    tertiary?: SimplePaletteColorOptions; // Define options for tertiary palette
  }
}

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: '#800000',
      accent: "#F40009",
    },
    secondary: {
      main: "#F9E1E2",
    },
    tertiary: {
      main: "#6A6464", // Example tertiary color
    },
    text: {
      primary: '#201f1e',
      secondary: "#6A6464",
    },
  },
  typography: {
    fontFamily: 'DM Sans',
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '1.25rem',
    },
  },
});

export default theme;
