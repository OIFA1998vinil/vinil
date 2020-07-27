/**
 * Application component module
 * @module client/components/App
 */

import React from 'react';
import ClientRouter from './ClientRouter';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { deepPurple, grey } from "@material-ui/core/colors";
import NavigationBar from './NavigationBar';

/**
 * Application theme see: [Material UI documentation]{@link https://material-ui.com/customization/color/#picking-colors}
 * @constant
 * @type {Theme}
 */
const theme = createMuiTheme({
  palette: {
    // type: 'dark',
    primary: deepPurple,
    secondary: grey
  }
});

/**
 * App main component
 * @function App
 * @returns {JSX.Element} App component template
 */
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