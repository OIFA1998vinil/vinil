import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@material-ui/core';
import SongCard from './components/SongCard';
import { SERVER_API_URL } from '../../settings';
import Axios from 'axios';
import Loading from '../Loading';
import Alert from '@material-ui/lab/Alert';
export default function HomePage() {
  const [songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadSongs = () => {
    setLoadingSongs(true);
    Axios.get(`${SERVER_API_URL}api/v1/songs/all`, { withCredentials: true })
      .then((response) => {
        setSongs(response.data.result);
      })
      .catch(err => setLoadError(err.response?.data?.error || 'Hubo un error de conexión al cargar las canciones'))
      .finally(() => setLoadingSongs(false))
  };

  useEffect(() => {
    loadSongs();
  }, []);

  return (
    <Container>
      {loadingSongs && <Loading />}
      {loadError && <Alert severity="error">{loadError}</Alert>}
      {!loadingSongs && !loadError && (
        songs.length ? (
          <Grid container>
            {songs.map(song => (
              <Grid key={song._id} item sm={12} md={4}>
                <SongCard song={song} />
              </Grid>
            ))}
          </Grid>
        )
          :
          <Alert severity="warning">No hay canciones</Alert>
      )}
    </Container>
  );
}