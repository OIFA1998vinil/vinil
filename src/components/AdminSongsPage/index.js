import React, { useState, useEffect } from 'react';
import { Container, Typography, IconButton } from '@material-ui/core';
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
import { ADD_SONG } from '../../locations';

export default function AdminSongsPage() {
  const [audio, setAudio] = useState(null);
  const [playingSong, setPlayingSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [stagedSongToDelete, setStagedSongToDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const cleanDeleteError = () => setDeleteError(null);

  const stageSongToDelete = (id) => () => {
    setStagedSongToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setStagedSongToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const performDelete = () => {
    setLoadingDelete(true);
    if (playingSong === stagedSongToDelete) {
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

  const loadSongs = () => {
    setLoadingSongs(true);
    axios.get(`${SERVER_API_URL}api/v1/songs/all`, { withCredentials: true })
      .then((response) => {
        setSongs(response.data.result);
      })
      .catch(err => setLoadError(err.response?.data?.error || 'Hubo un error de conexión al cargar las canciones'))
      .finally(() => setLoadingSongs(false))
  };

  const stopSong = () => {
    if (audio) {
      audio.onended = null;
      audio.pause();
    }
    setPlayingSong(null);
    setAudio(null);
  };

  const playSong = (id, filename) => () => {
    const newAudio = new Audio(`${SERVER_API_URL}api/v1/files/${filename}`);
    newAudio.play();
    newAudio.onended = stopSong;
    setPlayingSong(id);
    setAudio(newAudio);
  };

  useEffect(() => {
    loadSongs();
  }, []);

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
        {!loadingSongs && !loadError && (songs.length ?
          <TableContainer component={Paper}>
            <Table>
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
                {songs.map((song) => (
                  <TableRow key={song._id}>
                    <TableCell>
                      <IconButton
                        title={playingSong === song._id ? "Detener" : "Reproducir"}
                        onClick={playingSong === song._id ? stopSong : playSong(song._id, song.source)}
                      >
                        {playingSong === song._id ?
                          <StopIcon />
                          :
                          <PlayIcon />
                        }
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