/**
 * AdminUsers component module
 * @module client/components/AdminUsers
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

/**
 * Admin users page component
 * @function AdminUsers
 * @returns {JSX.Element} AdminUsers component template
 */
export default function AdminUsers() {
  const [usersData, setUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadUserRequestError, setLoadUserRequestsError] = useState(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [stagedUserToDelete, setStagedUserToDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [search, setSearch] = useState("");

  const users = useMemo(() => {
    if (!search) {
      return usersData;
    }

    /**
     * Use fuse to perform searches see: [Fuse]{@link https://fusejs.io/}
     */
    const fuse = new Fuse(usersData, { keys: ["email", "name", "lastName", "rol", "gender"] });
    const result = fuse.search(search);
    return result.map(result => result.item);
  }, [usersData, search])

  /**
   * Hides rejection error modal
   * @function cleanRejectError
   */
  const cleanDeleteError = () => setDeleteError(null);

  /**
   * Stages an user to be deleted (deleted) and shows confirmation modal
   * @function stageUserToDelete
   * @param {String} id User ID
   */
  const stageUserToDelete = (id) => () => {
    setStagedUserToDelete(id);
    setShowDeleteConfirmation(true);
  };

  /**
   * Cleans staged user to delete and hides confirmation modal
   * @function cancelDelete
   */
  const cancelDelete = () => {
    setStagedUserToDelete(null);
    setShowDeleteConfirmation(false);
  };

  /**
   * Performs delete of the staged user to delete
   * @function performDelete
   */
  const performDelete = () => {
    setLoadingDelete(true);
    axios.post(`${SERVER_API_URL}api/v1/users/reject/${stagedUserToDelete}`, null, { withCredentials: true })
      .then(() => loadUsers())
      .catch(err => setDeleteError(err.response?.data?.error || 'Hubo un error de conexión al eliminar el usuario'))
      .finally(() => {
        cancelDelete();
        setLoadingDelete(false);
      });
  };

  /**
   * Loads users
   * @function
   */
  const loadUsers = () => {
    setLoadingUsers(true);
    axios.get(`${SERVER_API_URL}api/v1/users/active`, { withCredentials: true })
      .then((response) => setUsersData(response.data.result))
      .catch(err => setLoadUserRequestsError(err.response?.data?.error || 'Hubo un error de conexión al cargar los usuarios'))
      .finally(() => setLoadingUsers(false))
  };

  /**
   * Loads users when component did mount
   */
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <Container>
        <Typography variant="h4"><UsersIcon /> Usuarios Activos</Typography>
        <br />
        {loadingUsers && <Loading />}
        {loadUserRequestError && <Alert severity="error">{loadUserRequestError}</Alert>}
        {!loadingUsers && !loadUserRequestError && (<>
          <Paper elevation={0}>
            <TextField
              placeholder="Busque por correo electrónico, nombre, rol, genero"
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
        {!loadingUsers && !loadUserRequestError && (users.length ?
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
                  <TableCell padding="checkbox"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{new Date(user.bornDate).toLocaleDateString()}</TableCell>
                    <TableCell>{user.rol}</TableCell>
                    <TableCell>
                      <IconButton title="Rechazar" onClick={stageUserToDelete(user._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <Alert severity="warning">No hay usuarios</Alert>
        )}
      </Container >

      <Dialog open={showDeleteConfirmation}>
        <DialogTitle>Atención</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar este usuario?
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