import React from "react";
import { makeStyles } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import Slider from '@material-ui/core/Slider';

import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80px",
    width: "100%",
    display: "flex",
    alignContent: "center",
    justifyContent: 'space-between'
  },
  info: {
    display: "flex",
    alignContent: "center",
    height: "100%"
  },
  margin: {
    margin: "10px"
  },
  verticalCenter: {
    alignSelf: "center"
  },
  controls: {
    display: "flex",
    width: "50%",
    alignContent: "center",
    justifyContent: "flex-end"
  },
  slider: {
    // margin: 0,
    padding: 0,
    position: 'absolute'
  }
}));

export default function MusicPlayer() {
  const classes = useStyles();
  return (
    <Paper elevation={5}>
      <div>
        <Slider className={classes.slider} />
      </div>
      <div className={classes.root}>
        <div className={classes.info}>
          <img
            alt=""
            height="50px"
            className={clsx(classes.verticalCenter, classes.margin)}
            src="http://localhost:8080/api/v1/files/1haZHNwTKVGUvno1qAKcFcwU6Q6XukMy0" />
          <span className={clsx(classes.verticalCenter)}>
            Fuentes de Ortiz
        </span>
        </div>
        <div className={classes.controls}>
          <div className={classes.verticalCenter}>
            <IconButton className={classes.margin}>
              <SkipPreviousIcon />
            </IconButton>
            <IconButton className={classes.margin}>
              <PlayArrowIcon />
            </IconButton>
            <IconButton className={classes.margin}>
              <SkipNextIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </Paper>
  );
}