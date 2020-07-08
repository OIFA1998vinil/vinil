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
import DeleteIcon from '@material-ui/icons/DeleteForever';
import UsersIcon from '@material-ui/icons/People';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import axios from "axios";
import Fuse from "fuse.js";
import { SERVER_API_URL } from '../../settings';
import Loading from '../Loading';

export default function AdminCollaborators() {

  const [collaboratorsData, setCollaboratorsData] = useState([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(true);
  const [loadCollaboratorsRequestError, setLoadCollaboratorsRequestsError] = useState(null);

  const [showBanConfirmation, setShowBanConfirmation] = useState(false);
  const [stagedCollaboratorToBan, setStagedCollaboratorToBan] = useState(false);
  const [loadingBan, setLoadingBan] = useState(false);
  const [banError, setBanError] = useState(null);

  const [search, setSearch] = useState("");

  const collaborators = useMemo(() => {
    if (!search) {
      return collaboratorsData;
    }
    const fuse = new Fuse(collaboratorsData, { keys: ["email", "name", "lastName"] });
    const result = fuse.search(search);
    return result.map(result => result.item);
  }, [collaboratorsData, search])


  const cleanBanError = () => setBanError(null);

  const stageCollaboratorToBan = (id) => () => {
    setStagedCollaboratorToBan(id);
    setShowBanConfirmation(true);
  };

  const cancelBan = () => {
    setStagedCollaboratorToBan(null);
    setShowBanConfirmation(false);
  };

  const performBan = () => {
    setLoadingBan(true);
    axios.put(`${SERVER_API_URL}api/v1/collaborators/deactivate/${stagedCollaboratorToBan}`, null, { withCredentials: true })
      .then(() => loadCollaborators())
      .catch(err => setBanError(err.response?.data?.error || 'Hubo un error de conexión al deshabilitar el colaborador'))
      .finally(() => {
        cancelBan();
        setLoadingBan(false);
      });
  };

  const loadCollaborators = () => {
    setLoadingCollaborators(true);
    axios.get(`${SERVER_API_URL}api/v1/collaborators/active`, { withCredentials: true })
      .then((response) => setCollaboratorsData(response.data.result))
      .catch(err => setLoadCollaboratorsRequestsError(err.response?.data?.error || 'Hubo un error de conexión al cargar los colaboradores'))
      .finally(() => setLoadingCollaborators(false))
  };

  useEffect(() => {
    loadCollaborators();
  }, []);

  return (
    <>
      <Container>
        <Typography variant="h4"><UsersIcon /> Colaboradores</Typography>
        <br />
        {loadingCollaborators && <Loading />}
        {loadCollaboratorsRequestError && <Alert severity="error">{loadCollaboratorsRequestError}</Alert>}
        {!loadingCollaborators && !loadCollaboratorsRequestError && (<>
          <Paper elevation={0}>
            <TextField
              placeholder="Busque por correo electrónico, nombre, apellido"
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
        {!loadingCollaborators && !loadCollaboratorsRequestError && (collaborators.length ?
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Correo Electrónico</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell padding="checkbox"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collaborators.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>
                      <IconButton title="Rechazar" onClick={stageCollaboratorToBan(user._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <Alert severity="warning">No hay colaboradores</Alert>
        )}
      </Container >

      <Dialog open={showBanConfirmation}>
        <DialogTitle>Atención</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea deshabilitar este colaborador?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loadingBan} onClick={performBan} color="primary">
            {loadingBan ? "Deshabilitando" : "Deshabilitar"}
          </Button>
          <Button disabled={loadingBan} onClick={cancelBan} color="primary" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={!!banError} onClose={cleanBanError}>
        <DialogTitle>Lo sentimos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {banError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanBanError} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}