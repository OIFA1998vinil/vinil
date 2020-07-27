/* eslint-disable react-hooks/exhaustive-deps */

/**
 * CollabPendingSongs component module
 * @module client/components/CollabPendingSongs
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, IconButton, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import PlayIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import axios from "axios";
import { SERVER_API_URL } from '../../settings';
import Loading from '../Loading';
import Fuse from "fuse.js";
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayingSong, selectAuth } from '../../redux/selectors';
import { stopSong, playSong } from '../../redux/actions';
import { COLLABORATOR } from '../../constants/roles';

/**
 * Collab pending songs page component
 * @function CollabPendingSongs
 * @returns {JSX.Element} CollabPendingSongs component template
 */
export default function CollabPendingSongs() {
  const dispatch = useDispatch();
  const collabInfo = useSelector(selectAuth(COLLABORATOR));
  const playingSong = useSelector(selectPlayingSong);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");

  const displayableSongs = useMemo(() => {
    const songs = actions.map(action => ({ ...action.payload.song, _id: action._id }));
    if (!search) {
      return songs;
    }

    /**
     * Use fuse to perform searches see: [Fuse]{@link https://fusejs.io/}
     */
    const fuse = new Fuse(songs, { keys: ["title", "year", "genres"] });
    const result = fuse.search(search);
    return result.map(result => result.item);
  }, [actions, search])


  /**
   * Loads collaborator pending songs
   * @function
   */
  const loadSongs = () => {
    setLoading(true);
    axios.get(`${SERVER_API_URL}api/v1/actions/staged/songs/${collabInfo._id}`, { withCredentials: true })
      .then((response) => setActions(response.data.result))
      .catch(err => setLoadError(err.response?.data?.error || 'Hubo un error de conexión al cargar las canciones'))
      .finally(() => setLoading(false))
  };

  /**
   * Stops the currently playing song
   * @function stopPlayingSong
   */
  const stopPlayingSong = () => {
    dispatch(stopSong());
  };

  /**
   * Plays a song
   * @function
   * @param {Object} song Song object
   */
  const reproduceSong = (song) => () => {
    dispatch(playSong(song));
  };

  /**
   * Loads collaborator pending songs when component did mount
   * Stops any song being played when component unmounts
   */
  useEffect(() => {
    loadSongs();
    return () => {
      dispatch(stopSong());
    }
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h4"><LibraryMusicIcon /> Canciones Pendientes</Typography>
      <br />
      {loading && <Loading />}
      {loadError && <Alert severity="error">{loadError}</Alert>}
      {!loading && !loadError && (
        <>
          <Paper elevation={0}>
            <TextField
              placeholder="Busque por título, géneros"
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
        </>
      )}
      {!loading && !loadError && (displayableSongs.length ?
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Tītulo</TableCell>
                <TableCell>Año</TableCell>
                <TableCell>Géneros</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayableSongs.map((song) => (
                <TableRow key={song._id}>
                  <TableCell>
                    <IconButton
                      title={playingSong?._id === song._id ? "Detener" : "Reproducir"}
                      onClick={playingSong?._id === song._id ? stopPlayingSong : reproduceSong(song)}>
                      {playingSong?._id === song._id ? <StopIcon /> : <PlayIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{song.title}</TableCell>
                  <TableCell>{song.year}</TableCell>
                  <TableCell>{song.genres.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <Alert severity="warning">No hay canciones pendientes</Alert>
      )}
    </Container>
  );
}