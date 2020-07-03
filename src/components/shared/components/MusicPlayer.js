/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import AlbumIcon from '@material-ui/icons/Album';
import Slider from '@material-ui/core/Slider';

import clsx from "clsx";
import { SERVER_API_URL } from "../../../settings";

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

export default function MusicPlayer({ song }) {
  const classes = useStyles();
  const [src, setSource] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef();
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = audioRef?.current;

  const progress = useMemo(() => {
    if (time === 0) {
      return 0;
    }
    return audio ? ((time / audio.duration) * 100) : 0;
  }, [audio, time]);

  const play = useCallback(() => {
    audioRef.current.play();
    setIsPlaying(true);
  }, [audioRef]);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, [audioRef]);

  const onTimeUpdate = useCallback(() => {
    setTime(audioRef.current.currentTime);
  }, [audioRef]);

  const onProgressChange = useCallback((_, value) => {
    const currentTime = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = currentTime;
  }, [audioRef]);

  const loadHandler = useCallback((event) => {
    const request = event.target;
    if (request.status === 200) {
      setSource(URL.createObjectURL(request.response))
      setIsLoading(false);
      play();

      if (navigator.mediaSession) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: song.title,
          artwork: [{ src: `${SERVER_API_URL}api/v1/files/${song.thumbnail}`, sizes: '512x512', type: 'image/png' }]
        });
        navigator.mediaSession.setActionHandler('play', play);
        navigator.mediaSession.setActionHandler('pause', pause);
      }
    }
  }, [play, song]);

  const loadAudio = useCallback(() => {
    setTime(0);
    setIsLoading(true);
    const request = new XMLHttpRequest();
    request.open("GET", `${SERVER_API_URL}api/v1/files/${song.source}`, true);
    request.responseType = "blob";
    request.onload = loadHandler;
    request.send();
  }, [song, loadHandler])

  const onStop = () => setIsPlaying(false);
  const onPlay = () => setIsPlaying(true);

  useEffect(() => {
    if (isPlaying) {
      pause();
    }
    if (song && !isLoading) {
      loadAudio();
    }
  }, [song]);

  return (
    <>
      <audio preload="auto" src={src} ref={audioRef} onEnded={onStop} onPause={onStop} onPlay={onPlay} onTimeUpdate={onTimeUpdate} hidden />
      <Paper elevation={5}>
        <div>
          <Slider className={classes.slider} disabled={!(audioRef.current?.src) || isLoading} onChange={onProgressChange} value={progress} />
        </div>
        <div className={classes.root}>
          <div className={classes.info}>
            {!song && <AlbumIcon className={clsx(classes.verticalCenter, classes.margin)} fontSize="large" />}
            {song && (
              <img
                alt={song.title}
                height="50px"
                width="50px"
                className={clsx(classes.verticalCenter, classes.margin)}
                src={`${SERVER_API_URL}api/v1/files/${song.thumbnail}`} />
            )}
            <span className={clsx(classes.verticalCenter)}>
              {song?.title || ''}
            </span>
          </div>
          <div className={classes.controls}>
            <div className={classes.verticalCenter}>
              {!isPlaying && (
                <IconButton className={classes.margin} disabled={!(audioRef.current?.src) || isLoading} onClick={play}>
                  <PlayArrowIcon />
                </IconButton>
              )}
              {isPlaying && (
                <IconButton className={classes.margin} disabled={!(audioRef.current?.src) || isLoading} onClick={pause}>
                  <PauseIcon />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
}