import React from "react";
import useStyles from "../shared/styles/menu";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { Link } from "react-router-dom";
import { COLLAB_ADD_SONG, COLLAB_PENDING_SONGS } from "../../locations";
import { Typography } from "@material-ui/core";

export default function CollabLandingPage() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root} >
        <GridList cellHeight={190} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
            <Typography className={classes.center} variant="h4">
              Menú Principal Colaborador
            </Typography>
          </GridListTile>

          <GridListTile component={Link} to={COLLAB_ADD_SONG()}>
            <img src={"https://image.freepik.com/foto-gratis/primer-plano-disco-vinilo-negro-sobre-fondo-negro_23-2147889740.jpg"} />
            <GridListTileBar title={"Agregar Canciones"} />
          </GridListTile>

          <GridListTile component={Link} to={COLLAB_PENDING_SONGS()}>
            <img src={"https://image.freepik.com/foto-gratis/mano-sosteniendo-vinilo_23-2148171708.jpg"} />
            <GridListTileBar title={"Canciones"} />
          </GridListTile>
        </GridList>
      </div>
    </>
  );
}

