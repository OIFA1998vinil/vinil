import React from 'react';
import ClientRouter from './ClientRouter';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { deepPurple, grey } from "@material-ui/core/colors";
import NavigationBar from './NavigationBar';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: grey
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