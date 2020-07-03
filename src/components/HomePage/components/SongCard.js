import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { SERVER_API_URL } from '../../../settings';
import { CardMedia, useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  cardArea: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
    margin: '10px 5px',
    width: 370,
  },

  card: {
    width: 300,
    height: 190,
  },

  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  col: {
    flex: '0 0 52%',
  },

  cardImage: {
    width: 244,
    objectFit: 'cover',
  },

  noPadding: {
    padding: 0,
  },

  width: {
    width: 315,
    margin: 10,
  },

  height: {
    height: 141,
  },

  xsCol: {
    flex: '0 0 46%',
  },

  xsImage: {
    width: 180,
  },
}));



export default function SongCard({ song, onPlay }) {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width: 600px)');
  return (
    <Card className={isMobile ? classes.width : classes.cardArea}>
      <div className={isMobile ? classes.height : classes.card}>
        <div className={classes.wrapper}>
          <div className={isMobile ? classes.xsCol : classes.col}>
            <CardContent>
              <Typography component="h1">
                {song.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {song.year}
              </Typography>
              <div>
                <IconButton onClick={onPlay}>
                  <PlayArrowIcon className={classes.playIcon} />
                </IconButton>
              </div>
            </CardContent>
          </div>
          <div className={isMobile ? classes.xsCol : classes.col}>
            <CardContent className={classes.noPadding}>
              <CardMedia>
                <img className={isMobile ? classes.xsImage : classes.cardImage} src={`${SERVER_API_URL}api/v1/files/${song.thumbnail}`} alt={song.title} />
              </CardMedia>
            </CardContent>
          </div>
        </div>
      </div>
    </Card>
  );
}
