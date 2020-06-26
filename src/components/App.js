import React from 'react';
import ClientRouter from './ClientRouter';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { deepPurple, grey } from "@material-ui/core/colors";
import NavigationBar from './NavigationBar';
import MusicPlayer from './shared/components/MusicPlayer';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: grey
  }
});

const useStyles = makeStyles((theme) => ({
  player: {
    position: 'fixed',
    bottom: '0px',
    width: '100%'
  }
}));

export default function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <NavigationBar />
        <ClientRouter />
        <div className={classes.player}>
          <MusicPlayer />
        </div>
      </CssBaseline>
    </ThemeProvider>
  );
}