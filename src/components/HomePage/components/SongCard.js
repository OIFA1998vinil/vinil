import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { SERVER_API_URL } from '../../../settings';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '10px',
  },
  details: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  coverContainer: {
    maxHeight: "200px"
  },
  cover: {
    width: "auto",
    height: "200px",
    objectFit: "cover",
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default function SongCard({ song }) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card className={classes.root}>
      <Grid container>
        <Grid item xs={6}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                {song.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {song.year}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <IconButton aria-label="play/pause">
                <PlayArrowIcon className={classes.playIcon} />
              </IconButton>
            </div>
          </div>
        </Grid>
        <Grid className={classes.coverContainer} item xs={6}>
          <img className={classes.cover} src={`${SERVER_API_URL}api/v1/files/${song.thumbnail}`} alt={song.title} />
        </Grid>
      </Grid>
    </Card>
  );
}
