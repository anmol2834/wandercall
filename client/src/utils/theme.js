import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#6366f1' : '#4f46e5',
      light: '#818cf8',
      dark: '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#f59e0b' : '#d97706',
      light: '#fbbf24',
      dark: '#92400e',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'dark' ? '#0f172a' : '#ffffff',
      paper: mode === 'dark' ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f8fafc' : '#0f172a',
      secondary: mode === 'dark' ? '#cbd5e1' : '#374151',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
          transition: 'all 0.3s ease',
        },
        outlined: {
          borderColor: mode === 'light' ? '#4f46e5' : 'inherit',
          color: mode === 'light' ? '#4f46e5' : 'inherit',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: mode === 'light' ? '#374151' : 'inherit',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          color: mode === 'light' ? '#0f172a' : '#f8fafc',
          '&[aria-selected="true"]': {
            backgroundColor: mode === 'light' ? '#e0e7ff' : '#374151',
            color: mode === 'light' ? '#0f172a' : '#f8fafc',
          },
          '&.Mui-focused': {
            backgroundColor: mode === 'light' ? '#f3f4f6' : '#4b5563',
            color: mode === 'light' ? '#0f172a' : '#f8fafc',
          },
        },
        paper: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
          color: mode === 'light' ? '#0f172a' : '#f8fafc',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          color: mode === 'light' ? '#0f172a' : '#f8fafc',
          '&[aria-selected="true"]': {
            backgroundColor: mode === 'light' ? '#e0e7ff' : '#374151',
            color: mode === 'light' ? '#0f172a' : '#f8fafc',
          },
          '&.Mui-focused': {
            backgroundColor: mode === 'light' ? '#f3f4f6' : '#4b5563',
            color: mode === 'light' ? '#0f172a' : '#f8fafc',
          },
          '&:hover': {
            backgroundColor: mode === 'light' ? '#f9fafb' : '#374151',
            color: mode === 'light' ? '#0f172a' : '#f8fafc',
          },
        },
        paper: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
          color: mode === 'light' ? '#0f172a' : '#f8fafc',
        },
        listbox: {
          '& .MuiAutocomplete-option': {
            color: mode === 'light' ? '#0f172a' : '#f8fafc',
          },
        },
      },
    },
  },
});

export default getTheme;