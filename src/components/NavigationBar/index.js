/* eslint-disable jsx-a11y/alt-text */

/**
 * NavigationBar component module
 * @module client/components/NavigationBar
 */

import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useStyles from "./styles";
import { List, ListItem, IconButton, Container, ListSubheader, Divider, Button, ListItemIcon, ListItemText } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { Link } from 'react-router-dom';
import { HOME_PAGE, ADMIN_SIGN_IN, SIGN_IN, ADD_SONG, ADMIN_LANDING, ADMIN_SONGS, ADMIN_REQUESTS_USERS, ADMIN_USERS, COLLAB_SIGN_IN, ADMIN_COLLABORATORS, ADMIN_ADD_COLLABORATORS, COLLAB_LANDING } from '../../locations';
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
import { ADMIN, USER, COLLABORATOR } from '../../constants/roles';
import { selectAuth } from '../../redux/selectors';
import { API_URL } from '../../settings';
import HomeIcon from "@material-ui/icons/Home";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import SignOutIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import GroupIcon from "@material-ui/icons/Group";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ContactsIcon from "@material-ui/icons/Contacts";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";


/**
 * Navigation bar component
 * @function CollabSignInPage
 * @returns {JSX.Element} NavigationBar component template
 */
export default function NavigationBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const adminAuth = useSelector(selectAuth(ADMIN));
  const userAuth = useSelector(selectAuth(USER));
  const collabAuth = useSelector(selectAuth(COLLABORATOR));

  const [error, setError] = useState(null);
  const [isCollabSigningOut, setIsCollabSigningOut] = useState(false);
  const [isAdminSigningOut, setIsAdminSigningOut] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  /**
   * Hides error modal
   * @function
   */
  const cleanError = () => setError(null);

  /**
   * Performs collaborator sign out
   * @function
   * @param {Event} event Click event
   */
  const onColabSignOutClick = (event) => {
    event.stopPropagation();
    setIsCollabSigningOut(true);
    post(`${API_URL}api/v1/collaborators/sign-out`, null, { withCredentials: true })
      .then(() => {
        dispatch(signOut([COLLABORATOR]));
        setShowMenu(false);
      })
      .catch(error => setError(error.response?.data?.error || 'Hubo un error de conexión'))
      .finally(() => setIsCollabSigningOut(false));
  };

  /**
   * Performs admin sign out
   * @function
   * @param {Event} event Click event
   */
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

  /**
   * Performs users sign out
   * @function
   * @param {Event} event Click event
   */
  const onSignOutClick = (event) => {
    event.stopPropagation();
    setIsSigningOut(true);
    post(`${API_URL}api/v1/users/sign-out`, null, { withCredentials: true })
      .then(() => {
        dispatch(signOut([USER]));
        setShowMenu(false);
      })
      .catch(error => setError(error.response?.data?.error || 'Hubo un error de conexión'))
      .finally(() => setIsSigningOut(false));
  };

  return (
    <>
      <div className={clsx(classes.grow, classes.marginBottom)}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton onClick={() => setShowMenu(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <img src={process.env.PUBLIC_URL + '/vinilLogo.png'} className={classes.imagen} />
            <Typography className={classes.title} variant="h5"> Vinil</Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Drawer open={showMenu} onClose={() => setShowMenu(false)}>
        <div className={classes.menu} onClick={() => setShowMenu(false)}>
          <Container>
            <div className={classes.divLogo}>
              <img src={process.env.PUBLIC_URL + '/vinilLogo.png'} className={classes.imagen2} />
            </div>
            <br></br>
            <Typography className={clsx(classes.title, classes.titleMenu)} variant="h5">Vinil</Typography>
          </Container>
          <List>
            {
              userAuth ?
                <>
                  <ListItem button component={Link} to={HOME_PAGE()} color="inherit">
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inicio" />
                  </ListItem>
                  <ListItem button color="inherit" onClick={onSignOutClick} disabled={isSigningOut}>
                    <ListItemIcon>
                      <SignOutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                  </ListItem>
                </>
                :
                <ListItem button component={Link} to={SIGN_IN()} color="inherit">
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Iniciar Sesión" />
                </ListItem>
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
                <ListItem button component={Link} to={ADMIN_LANDING()} color="inherit">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Inicio" />
                </ListItem>
                <ListItem button component={Link} to={ADMIN_SONGS()} color="inherit">
                  <ListItemIcon>
                    <LibraryMusicIcon />
                  </ListItemIcon>
                  <ListItemText primary="Canciones" />
                </ListItem>
                <ListItem button component={Link} to={ADD_SONG()} color="inherit">
                  <ListItemIcon>
                    <LibraryAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Agregar Canción" />
                </ListItem>
                <ListItem button component={Link} to={ADMIN_USERS()} color="inherit">
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                </ListItem>
                <ListItem button component={Link} to={ADMIN_REQUESTS_USERS()} color="inherit">
                  <ListItemIcon>
                    <GroupAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Solicitudes de Usuarios" />
                </ListItem>
                <ListItem button component={Link} to={ADMIN_COLLABORATORS()} color="inherit">
                  <ListItemIcon>
                    <ContactsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Colaboradores" />
                </ListItem>
                <ListItem button component={Link} to={ADMIN_ADD_COLLABORATORS()} color="inherit">
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Agregar Colaborador" />
                </ListItem>
                <ListItem button color="inherit" onClick={onAdminSignOutClick} disabled={isAdminSigningOut}> <ListItemIcon>
                  <SignOutIcon />
                </ListItemIcon>{isAdminSigningOut ? "Cerrando sesión..." : "Cerrar Sesión"}
                </ListItem>
              </>
              :
              <ListItem button component={Link} to={ADMIN_SIGN_IN()} color="inherit">
                <ListItemIcon>
                  <VerifiedUserIcon />
                </ListItemIcon>
                <ListItemText primary="Admin Iniciar Sesión" />
              </ListItem>
            }
          </List>
          <Divider />
          <List subheader={
            <ListSubheader>
              Colaboradores
            </ListSubheader>
          }>
            {collabAuth ?
              <>
                <ListItem button component={Link} to={COLLAB_LANDING()} color="inherit">Inicio</ListItem>
                <ListItem button color="inherit" onClick={onColabSignOutClick} disabled={isCollabSigningOut}>{isCollabSigningOut ? "Cerrando sesión..." : "Cerrar Sesión"}</ListItem>
              </>
              :
              <ListItem button component={Link} to={COLLAB_SIGN_IN()} color="inherit">
                <ListItemIcon>
                  <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Colab Iniciar Sesión" />
              </ListItem>
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
