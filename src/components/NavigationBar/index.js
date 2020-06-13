import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useStyles from "./styles";
import { Button, List, ListItem, IconButton } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import VinilIcon from "@material-ui/icons/AlbumOutlined";
import { Link } from 'react-router-dom';
import { HOME_PAGE, ADMIN_SIGN_IN, SIGN_IN, ADD_SONG } from '../../locations';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/actions';
import { ADMIN, USER } from '../../constants/roles';
import { selectAuth } from '../../redux/selectors';

export default function NavigationBar() {
  const dispatch = useDispatch();
  const adminAuth = useSelector(selectAuth(ADMIN));
  const userAuth = useSelector(selectAuth(USER));

  const hasSignIn = !!(adminAuth || userAuth);

  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);

  const onSignOutClick = () => {
    dispatch(signOut());
  }

  return (
    <>
      <div className={clsx(classes.grow, classes.marginBottom)}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={() => setShowMenu(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h5">
              <VinilIcon /> Vinil
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Button component={Link} to={HOME_PAGE()} color="inherit">Inicio</Button>
              <Button component={Link} to={SIGN_IN()} color="inherit">Iniciar Sesión</Button>
              <Button component={Link} to={ADMIN_SIGN_IN()} color="inherit">Admin Iniciar Sesión</Button>
              <Button component={Link} to={ADD_SONG()} color="inherit">Agregar Canción</Button>
              {hasSignIn && <Button onClick={onSignOutClick} variant="outlined" color="inherit">Cerrar Sesión</Button>}
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <Drawer open={showMenu} onClose={() => setShowMenu(false)}>
        <div className={classes.menu} onClick={() => setShowMenu(false)}>
          <List>
            <ListItem button component={Link} to={HOME_PAGE()} color="inherit">Inicio</ListItem>
            <ListItem button component={Link} to={SIGN_IN()} color="inherit">Iniciar Sesión</ListItem>
            <ListItem button component={Link} to={ADMIN_SIGN_IN()} color="inherit">Admin Iniciar Sesión</ListItem>
            <ListItem button component={Link} to={ADD_SONG()} color="inherit">Agregar Canción</ListItem>
            {hasSignIn && <ListItem button color="inherit" onClick={onSignOutClick}>Cerrar Sesión</ListItem>}
          </List>
        </div>
      </Drawer>
    </>
  );
}
