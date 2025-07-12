
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00B4D8', // Customize the primary color
      light: '#90E0EF', // Optional: lighter shade of primary
      dark: '#0077B6', 
      contrastText:"#f4f6f8" // Optional: darker shade of primary
    },
    secondary: {
      main: '#444444',  // Customize the secondary color
      light: '#666666', // Optional: lighter shade of secondary
      dark: '#222222',  // Optional: darker shade of secondary
    },
    background: {
      default: '#f4f6f8',  // Background color for the app
      paper: '#dAF0F8',    // Background color for Paper components
    },
    text: {
      primary: '#666666',
      secondary: '#666666', // Secondary text color
         // Default text color
    },
    error: {
      main: '#d32f2f'
    }
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem'
    },
  },
  spacing: 8, // Default spacing (can be accessed as multiples of 8)
  shape: {
    borderRadius: 3, // Default border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#fff",
            borderRadius: 8,
            border: '1px solid #33333315',
            boxShadow: '-6px 6px 8px 0 #00000010', // Custom drop shadow for Paper
          },
        },
      },
  },
});

export default theme;
