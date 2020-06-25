import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useStyles from "./styles";
import { List, ListItem, IconButton, Container, ListSubheader, Divider, Button } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import VinilIcon from "@material-ui/icons/Radio";
import { Link } from 'react-router-dom';
import { HOME_PAGE, ADMIN_SIGN_IN, SIGN_IN, ADD_SONG, ADMIN_LANDING, ADMIN_SONGS, ADMIN_REQUESTS_USERS } from '../../locations';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { post } from "axios";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { signOut } from '../../redux/actions';
import { ADMIN, USER } from '../../constants/roles';
import { selectAuth } from '../../redux/selectors';
import { API_URL } from '../../settings';

export default function NavigationBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const adminAuth = useSelector(selectAuth(ADMIN));
  const userAuth = useSelector(selectAuth(USER));
  const [error, setError] = useState(null);
  const [isAdminSigningOut, setIsAdminSigningOut] = useState(false);

  const cleanError = () => setError(null);

  const onAdminSignOutClick = (event) => {
    event.stopPropagation();
    setIsAdminSigningOut(true);
    post(`${API_URL}api/v1/admin/sign-out`, null, { withCredentials: true })
      .then(() => {
        dispatch(signOut([ADMIN]));
        setShowMenu(false);
      })
      .catch(error => setError(error.response?.data?.error || 'Hubo un error de conexión'))
      .finally(() => setIsAdminSigningOut(false));
  };

  return (
    <>
      <div className={clsx(classes.grow, classes.marginBottom)}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton onClick={() => setShowMenu(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h5">
              <VinilIcon /> Vinil
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Drawer open={showMenu} onClose={() => setShowMenu(false)}>
        <div className={classes.menu} onClick={() => setShowMenu(false)}>
          <Container>
            <Typography className={clsx(classes.title, classes.titleMenu)} variant="h5">
              <VinilIcon /> Vinil
            </Typography>
          </Container>
          <List>
            {
              userAuth ?
                <>
                  <ListItem button component={Link} to={HOME_PAGE()} color="inherit">Inicio</ListItem>
                  <ListItem button component={Link} to={HOME_PAGE()} color="inherit">Cerrar Sesión</ListItem>
                </>
                :
                <ListItem button component={Link} to={SIGN_IN()} color="inherit">Iniciar Sesión</ListItem>
            }
          </List>
          <Divider />
          <List subheader={
            <ListSubheader>
              Administración
            </ListSubheader>
          }>
            {adminAuth ?
              <>
                <ListItem button component={Link} to={ADMIN_LANDING()} color="inherit">Inicio</ListItem>
                <ListItem button component={Link} to={ADMIN_SONGS()} color="inherit">Canciones</ListItem>
                <ListItem button component={Link} to={ADD_SONG()} color="inherit">Agregar Canción</ListItem>
                <ListItem button component={Link} to={ADMIN_REQUESTS_USERS()} color="inherit">Solicitudes de Usuarios</ListItem>
                <ListItem button color="inherit" onClick={onAdminSignOutClick} disabled={isAdminSigningOut}>{isAdminSigningOut ? "Cerrando sesión..." : "Cerrar Sesión"}</ListItem>
              </>
              :
              <ListItem button component={Link} to={ADMIN_SIGN_IN()} color="inherit">Admin Iniciar Sesión</ListItem>
            }
          </List>
        </div>
      </Drawer>

      <Dialog open={!!error} onClose={cleanError} maxWidth="xs" fullWidth>
        <DialogTitle>Lo sentimos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanError} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
