import React from 'react';
import ClientRouter from './ClientRouter';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue, purple } from "@material-ui/core/colors";
import NavigationBar from './NavigationBar';

const theme = createMuiTheme({
  palette: {
    // type: "dark",
    primary: blue,
    secondary: purple
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <NavigationBar />
        <ClientRouter />
      </CssBaseline>
    </ThemeProvider>
  );
}