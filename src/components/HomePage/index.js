import React, { useEffect, useState, useMemo } from 'react';
import { Container, Grid, makeStyles, TextField } from '@material-ui/core';
import SongCard from './components/SongCard';
import { SERVER_API_URL } from '../../settings';
import Axios from 'axios';
import Loading from '../Loading';
import Alert from '@material-ui/lab/Alert';
import MusicPlayer from '../shared/components/MusicPlayer';
import Fuse from "fuse.js";
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles((theme) => ({
  player: {
    position: 'fixed',
    bottom: '0px',
    width: '100%'
  },
  fakeSpace: {
    height: "100px"
  }
}));

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export default function HomePage() {
  const classes = useStyles();
  const [playingSong, setPlayingSong] = useState();
  const [availableSongs, setAvailableSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");

  const songs = useMemo(() => {
    if (!search) {
      return availableSongs;
    }
    const fuse = new Fuse(availableSongs, { keys: ["title", "year", "genres"] });
    const result = fuse.search(search);
    return result.map(result => result.item);
  }, [availableSongs, search])


  const loadSongs = () => {
    setLoadingSongs(true);
    Axios.get(`${SERVER_API_URL}api/v1/songs/all`, { withCredentials: true })
      .then((response) => {
        setAvailableSongs(shuffle(response.data.result));
      })
      .catch(err => setLoadError(err.response?.data?.error || 'Hubo un error de conexión al cargar las canciones'))
      .finally(() => setLoadingSongs(false))
  };

  useEffect(() => {
    loadSongs();
  }, []);

  return (
    <>
      <Container>
        {loadingSongs && <Loading />}
        {loadError && <Alert severity="error">{loadError}</Alert>}
        {!loadingSongs && !loadError && (<>
          <Paper elevation={0}>
            <TextField
              placeholder="Buscar canciones"
              onChange={event => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment >
                ),
              }}
              label="Buscar"
              variant="outlined"
              fullWidth
            />
          </Paper>
          <br />
        </>)}
        {!loadingSongs && !loadError && (
          songs.length ? (
            <Grid container>
              {songs.map(song => (
                <Grid key={song._id} item sm={12} md={4}>
                  <SongCard song={song} onPlay={() => setPlayingSong(song)} />
                </Grid>
              ))}
            </Grid>
          )
            :
            <Alert severity="warning">No hay canciones</Alert>
        )}
        <div className={classes.fakeSpace} />
      </Container>
      <div className={classes.player}>
        <MusicPlayer song={playingSong} />
      </div>
    </>
  );
}