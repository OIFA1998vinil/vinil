/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import useStyles from "../shared/styles/menu";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { Link } from "react-router-dom";
import { ADMIN_SONGS, ADD_SONG, ADMIN_USERS, ADMIN_REQUESTS_USERS } from "../../locations";
import { Typography } from "@material-ui/core";

export default function AdminLandingPage() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
            <Typography className={classes.center} variant="h4">
              Menú principal
            </Typography>
          </GridListTile>

          <GridListTile component={Link} to={ADMIN_SONGS()}>
            <img src={"https://image.freepik.com/foto-gratis/primer-plano-disco-vinilo-negro-sobre-fondo-negro_23-2147889740.jpg"} />
            <GridListTileBar title={"Canciones"} />
          </GridListTile>

          <GridListTile component={Link} to={ADD_SONG()}>
            <img src={"https://image.freepik.com/foto-gratis/mano-sosteniendo-vinilo_23-2148171708.jpg"} />
            <GridListTileBar title={"Agregar Canción"} />
          </GridListTile>

          <GridListTile component={Link} to={ADMIN_USERS()}>
            <img src={"https://image.freepik.com/foto-gratis/hombre-senior-primer-plano-registro-musica_23-2148362810.jpg"} />
            <GridListTileBar title={"Usuarios"} />
          </GridListTile>

          <GridListTile component={Link} to={ADMIN_REQUESTS_USERS()}>
            <img src={"https://image.freepik.com/foto-gratis/pila-disco-vinilo-sobre-fondo-negro_23-2147889742.jpg"} />
            <GridListTileBar title={"Solicitudes de usuarios"} />
          </GridListTile>
        </GridList>
      </div>
    </>
  );
}
