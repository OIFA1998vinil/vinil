/* eslint-disable react-hooks/exhaustive-deps */
/**
 * AdminPendingSongs component module
 * @module client/components/AdminPendingSongs
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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AcceptIcon from '@material-ui/icons/ThumbUp';
import RejectIcon from '@material-ui/icons/ThumbDown';
import axios from "axios";
import { SERVER_API_URL } from '../../settings';
import Loading from '../Loading';
import Fuse from "fuse.js";
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayingSong } from '../../redux/selectors';
import { stopSong, playSong } from '../../redux/actions';

/**
 * Admin pending songs page page component
 * @function AdminPendingSongs
 * @returns {JSX.Element} AdminPendingSongs component template
 */
export default function AdminPendingSongs() {
  const dispatch = useDispatch();
  const playingSong = useSelector(selectPlayingSong);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");

  const displayableSongs = useMemo(() => {
    const songs = actions.map(action => ({ ...action.payload.song, _id: action._id, collaborator: action.collaborator }));
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
   * Loads all the actions with type INSERT_SONG which payload has the shape of an unsaved song
   * @function loadSongs
   */
  const loadSongs = () => {
    setLoading(true);
    axios.get(`${SERVER_API_URL}api/v1/actions/staged/songs`, { withCredentials: true })
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
   * @function reproduceSong
   * @param {Object} song Song object
   */
  const reproduceSong = (song) => () => {
    dispatch(playSong(song));
  };


  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [stagedRequestToAccept, setStagedRequestToAccept] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [acceptError, setAcceptError] = useState(null);


  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [stagedRequestToReject, setStagedRequestToReject] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [rejectError, setRejectError] = useState(null);

  /**
   * Hides acceptance error modal
   * @function cleanAcceptError
   */
  const cleanAcceptError = () => setAcceptError(null);

  /**
   * Stages an action to be accepted and displays accept confirmation modal
   * @function stageRequestToAccept
   * @param {String} id Action ID
   */
  const stageRequestToAccept = (id) => () => {
    setStagedRequestToAccept(id);
    setShowAcceptConfirmation(true);
  };

  /**
   * Removes any action staged to be accepted and hides accept confirmation modal
   * @function cancelAccept
   */
  const cancelAccept = () => {
    setStagedRequestToAccept(null);
    setShowAcceptConfirmation(false);
  };

  /**
   * Hides rejection error modal
   * @function cleanRejectError
   */
  const cleanRejectError = () => setRejectError(null);

  /**
   * Stages an action to be rejected and displays reject confirmation modal
   * @function stageRequestToReject
   * @param {String} id Action ID to reject
   */
  const stageRequestToReject = (id) => () => {
    setStagedRequestToReject(id);
    setShowRejectConfirmation(true);
  };

  /**
   * Cleans any staged action to reject and hides reject confirmation modal
   * @function cancelReject
   */
  const cancelReject = () => {
    setStagedRequestToReject(null);
    setShowRejectConfirmation(false);
  };

  /**
   * Performs the acceptance of an action using staged action to accept
   * @function performAccept
   */
  const performAccept = () => {
    setLoadingAccept(true);
    axios.post(`${SERVER_API_URL}api/v1/actions/commit/insert-song/${stagedRequestToAccept}`, null, { withCredentials: true })
      .then(() => loadSongs())
      .catch(err => setAcceptError(err.response?.data?.error || 'Hubo un error de conexión al aceptar la solicitud'))
      .finally(() => {
        cancelAccept();
        setLoadingAccept(false);
      });
  };

  /**
   * Performs the rejection of an action using staged action to reject
   * @function performReject
   */
  const performReject = () => {
    setLoadingReject(true);
    axios.post(`${SERVER_API_URL}api/v1/actions/discard/insert-song/${stagedRequestToReject}`, null, { withCredentials: true })
      .then(() => loadSongs())
      .catch(err => setRejectError(err.response?.data?.error || 'Hubo un error de conexión al rechazar la solicitud'))
      .finally(() => {
        cancelReject();
        setLoadingReject(false);
      });
  };

  /**
   * Loads pending song actions when component did mount
   * When component is dismount it stops any playing song
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
        <Typography variant="h4"><LibraryMusicIcon /> Canciones Pendientes</Typography>
        <br />
        {loading && <Loading />}
        {loadError && <Alert severity="error">{loadError}</Alert>}
        {!loading && !loadError && (<>
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
        </>)}
        {!loading && !loadError && (displayableSongs.length ?

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>Tītulo</TableCell>
                  <TableCell>Año</TableCell>
                  <TableCell>Géneros</TableCell>
                  <TableCell>Colaborador</TableCell>
                  <TableCell padding="checkbox">Aceptar</TableCell>
                  <TableCell padding="checkbox">Rechazar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayableSongs.map((song) => (
                  <TableRow key={song._id}>
                    <TableCell>
                      <IconButton
                        title={playingSong?._id === song._id ? "Detener" : "Reproducir"}
                        onClick={playingSong?._id === song._id ? stopPlayingSong : reproduceSong(song)}
                      >
                        {playingSong?._id === song._id ?
                          <StopIcon />
                          :
                          <PlayIcon />
                        }
                      </IconButton>
                    </TableCell>
                    <TableCell>{song.title}</TableCell>
                    <TableCell>{song.year}</TableCell>
                    <TableCell>{song.genres.join(', ')}</TableCell>
                    <TableCell>{song.collaborator.name} {song.collaborator.lastName}</TableCell>
                    <TableCell>
                      <IconButton title="Aceptar" onClick={stageRequestToAccept(song._id)}>
                        <AcceptIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton title="Rechazar" onClick={stageRequestToReject(song._id)}>
                        <RejectIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <Alert severity="warning">No hay canciones pendientes</Alert>
        )}
      </Container>


      <Dialog open={showAcceptConfirmation}>
        <DialogTitle>Atención</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea aceptar está solicitud?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loadingAccept} onClick={performAccept} color="primary">
            {loadingAccept ? "Aceptando" : "Aceptar"}
          </Button>
          <Button disabled={loadingAccept} onClick={cancelAccept} color="primary" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={showRejectConfirmation}>
        <DialogTitle>Atención</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea rechazar está solicitud?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loadingReject} onClick={performReject} color="primary">
            {loadingReject ? "Rechazando" : "Rechazar"}
          </Button>
          <Button disabled={loadingReject} onClick={cancelReject} color="primary" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!acceptError} onClose={cleanAcceptError}>
        <DialogTitle>Lo sentimos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {acceptError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanAcceptError} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={!!rejectError} onClose={cleanRejectError}>
        <DialogTitle>Lo sentimos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {rejectError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanRejectError} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}