/**
 * AdminSongsPage component module
 * @module client/components/AdminSongsPage
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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";
import { SERVER_API_URL } from '../../settings';
import Loading from '../Loading';
import { Link } from 'react-router-dom';
import Fuse from "fuse.js";
import { ADD_SONG } from '../../locations';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayingSong } from '../../redux/selectors';
import { stopSong, playSong } from '../../redux/actions';

/**
 * Admin songs page component
 * @function AdminSongsPage
 * @returns {JSX.Element} AdminSongsPage component template
 */
export default function AdminSongsPage() {
  const dispatch = useDispatch();
  const playingSong = useSelector(selectPlayingSong);
  const [songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [stagedSongToDelete, setStagedSongToDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [search, setSearch] = useState("");

  const displayableSongs = useMemo(() => {
    if (!search) {
      return songs;
    }

    /**
     * Use fuse to perform searches see: [Fuse]{@link https://fusejs.io/}
     */
    const fuse = new Fuse(songs, { keys: ["title", "year", "genres"] });
    const result = fuse.search(search);
    return result.map(result => result.item);
  }, [songs, search])

  /**
   * Hides delete error modal
   * @function cleanDeleteError
   */
  const cleanDeleteError = () => setDeleteError(null);

  /**
   * Stages a song to be deleted and shows delete confirmation modal
   * @function stageSongToDelete
   * @param {String} id Song ID
   */
  const stageSongToDelete = (id) => () => {
    setStagedSongToDelete(id);
    setShowDeleteConfirmation(true);
  };

  /**
   * Cleans staged song to be deleted and hides delete confirmation modal
   * @function cancelDelete
   */
  const cancelDelete = () => {
    setStagedSongToDelete(null);
    setShowDeleteConfirmation(false);
  };

  /**
   * Performs delete on staged song to delete
   * @function
   */
  const performDelete = () => {
    setLoadingDelete(true);
    if (playingSong?._id === stagedSongToDelete) {
      stopSong();
    }
    axios.delete(`${SERVER_API_URL}api/v1/songs/delete/${stagedSongToDelete}`, { withCredentials: true })
      .then(() => {
        loadSongs();
      })
      .catch(err => setDeleteError(err.response?.data?.error || 'Hubo un error de conexión al eliminar la canción'))
      .finally(() => {
        cancelDelete();
        setLoadingDelete(false);
      });
  };

  /**
   * Loads songs
   * @function
   */
  const loadSongs = () => {
    setLoadingSongs(true);
    axios.get(`${SERVER_API_URL}api/v1/songs/all`, { withCredentials: true })
      .then((response) => {
        setSongs(response.data.result);
      })
      .catch(err => setLoadError(err.response?.data?.error || 'Hubo un error de conexión al cargar las canciones'))
      .finally(() => setLoadingSongs(false))
  };

  /**
   * Stops currently playing song
   * @function
   */
  const stopPlayingSong = () => {
    dispatch(stopSong());
  };

  /**
   * Plays a song
   * @param {Object} song Song object
   */
  const reproduceSong = (song) => () => {
    dispatch(playSong(song));
  };

  /**
   * Loads songs when component did mount and stops any playing song when component unmounts
   */
  useEffect(() => {
    loadSongs();
    return () => {
      dispatch(stopSong());
    }
  }, [dispatch]);

  return (
    <>
      <Container>
        <Typography variant="h4"><LibraryMusicIcon /> Canciones</Typography>
        <br />
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          component={Link}
          to={ADD_SONG()}>
          Agregar Canción
        </Button>
        <br /><br />
        {loadingSongs && <Loading />}
        {loadError && <Alert severity="error">{loadError}</Alert>}
        {!loadingSongs && !loadError && (
          <>
            <Paper elevation={0}>
              <TextField
                placeholder="Busque por título, géneros"
                onChange={event => setSearch(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
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
        {!loadingSongs && !loadError && (displayableSongs.length ?
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>Tītulo</TableCell>
                  <TableCell>Año</TableCell>
                  <TableCell>Géneros</TableCell>
                  <TableCell padding="checkbox" />
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
                    <TableCell>
                      <IconButton title="Eliminar" onClick={stageSongToDelete(song._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <Alert severity="warning">No hay canciones</Alert>
        )}
      </Container >
      <Dialog open={showDeleteConfirmation}>
        <DialogTitle>Atención</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar está canción?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loadingDelete} onClick={performDelete} color="primary">
            {loadingDelete ? "Eliminando" : "Eliminar"}
          </Button>
          <Button disabled={loadingDelete} onClick={cancelDelete} color="primary" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deleteError} onClose={cleanDeleteError}>
        <DialogTitle>Lo sentimos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanDeleteError} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}