import { createTheme } from "@mui/material/styles";
// Define your custom theme
// Augment the palette to include an ochre color
declare module "@mui/material/styles" {
  interface Palette {
    cyan: Palette["primary"];
    violet: Palette["secondary"];
  }
  interface PaletteOptions {
    cyan?: PaletteOptions["primary"];
    violet?: PaletteOptions["secondary"];
  }
}
export const theme = createTheme({
  //Breakpoint
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  //Palette
  palette: {
    mode: "light",
    primary: {
      main: "#605BFF",
      light: "#605BFF1A",
    },
    secondary: {
      main: "#CB2A7E",
      light: "#CB2A7E1A",
    },
    success: {
      main: "#1C9321",
      light: "#1C93211A",
    },
    error: {
      main: "#E71D36",
      light: "#E71D361A",
    },
    warning: {
      main: "#FFA32F",
      light: "#FFA32F1A",
    },
    info: {
      main: "#004FCE",
      light: "#004FCE1A",
    },
    cyan: {
      main: "#008D91",
      light: "#008D911A",
      // dark: "#0C7275",
      // contrastText: "#fff",
    },
    violet: {
      main: "#8861BF",
      light: "#8861BF1A",
      // dark: "#764FAD",
      // contrastText: "#fff",
    },
    background: {
      default: "#FAFAFB",
    },
    text: {
      primary: "#030229",
      secondary: "#727272",
    },
    grey: {
      A100: "#292B2D",
      A200: "#F9F8F9",
      A700: "#191D23",
      A400:"#1A1C21",
    },
  },
  // overrides: {
  // MuiAppBar: {
  //   colorInherit: {
  //     backgroundColor: '#fff',
  //     color: '#000',
  //   },
  // },
  // },
  // props: {
  //   MuiAppBar: {
  //     color: 'inherit',
  //   },
  //   MuiTooltip: {
  //     arrow: true,
  //   },
  // },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        arrow: true,
      },
    },
  },
  spacing: 8,
  typography: {
    caption: {
      fontFamily: "DM Sans",
    },
    button: {
      fontFamily: "DM Sans",
    },
    body2: {
      fontFamily: "DM Sans",
    },
    fontFamily: "DM Sans",
  },
});
