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
import AcceptIcon from '@material-ui/icons/ThumbUp';
import RejectIcon from '@material-ui/icons/ThumbDown';
import VerifyUserIcon from '@material-ui/icons/VerifiedUser';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";
import { SERVER_API_URL } from '../../settings';
import Loading from '../Loading';

export default function AdminSongsPage() {

  const [userRequests, setUserRequests] = useState([]);
  const [loadingUserRequests, setLoadingUserRequests] = useState(true);
  const [loadUserRequestError, setLoadUserRequestsError] = useState(null);

  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [stagedRequestToAccept, setStagedRequestToAccept] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [acceptError, setAcceptError] = useState(null);


  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [stagedRequestToReject, setStagedRequestToReject] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [rejectError, setRejectError] = useState(null);


  const cleanAcceptError = () => setAcceptError(null);

  const stageRequestToAccept = (id) => () => {
    setStagedRequestToAccept(id);
    setShowAcceptConfirmation(true);
  };

  const cancelAccept = () => {
    setStagedRequestToAccept(null);
    setShowAcceptConfirmation(false);
  };

  const cleanRejectError = () => setRejectError(null);

  const stageRequestToReject = (id) => () => {
    setStagedRequestToReject(id);
    setShowRejectConfirmation(true);
  };

  const cancelReject = () => {
    setStagedRequestToReject(null);
    setShowRejectConfirmation(false);
  };

  const performAccept = () => {
    setLoadingAccept(true);
    axios.post(`${SERVER_API_URL}api/v1/users/accept/${stagedRequestToAccept}`, null, { withCredentials: true })
      .then(() => loadRequests())
      .catch(err => setAcceptError(err.response?.data?.error || 'Hubo un error de conexión al aceptar la solicitud'))
      .finally(() => {
        cancelAccept();
        setLoadingAccept(false);
      });
  };

  const performReject = () => {
    setLoadingReject(true);
    axios.post(`${SERVER_API_URL}api/v1/users/reject/${stagedRequestToReject}`, null, { withCredentials: true })
      .then(() => loadRequests())
      .catch(err => setRejectError(err.response?.data?.error || 'Hubo un error de conexión al rechazar la solicitud'))
      .finally(() => {
        cancelReject();
        setLoadingReject(false);
      });
  };

  const loadRequests = () => {
    setLoadingUserRequests(true);
    axios.get(`${SERVER_API_URL}api/v1/users/pending`, { withCredentials: true })
      .then((response) => setUserRequests(response.data.result))
      .catch(err => setLoadUserRequestsError(err.response?.data?.error || 'Hubo un error de conexión al cargar las solicitudes'))
      .finally(() => setLoadingUserRequests(false))
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <>
      <Container>
        <Typography variant="h4"><VerifyUserIcon /> Solicitudes de Usuarios</Typography>
        <br />
        {loadingUserRequests && <Loading />}
        {loadUserRequestError && <Alert severity="error">{loadUserRequestError}</Alert>}
        {!loadingUserRequests && !loadUserRequestError && (userRequests.length ?
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Correo Electrónico</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Género</TableCell>
                  <TableCell>Fecha de Nacimiento</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell padding="checkbox">Aceptar</TableCell>
                  <TableCell padding="checkbox">Rechazar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.lastName}</TableCell>
                    <TableCell>{request.gender}</TableCell>
                    <TableCell>{new Date(request.bornDate).toLocaleDateString()}</TableCell>
                    <TableCell>{request.rol}</TableCell>
                    <TableCell>
                      <IconButton title="Aceptar" onClick={stageRequestToAccept(request._id)}>
                        <AcceptIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton title="Rechazar" onClick={stageRequestToReject(request._id)}>
                        <RejectIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          :
          <Alert severity="warning">No hay solicitudes</Alert>
        )}
      </Container >

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