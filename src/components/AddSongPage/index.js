import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, Paper, Grid, Typography, InputLabel } from '@material-ui/core';
import useStyles from "../shared/styles/forms";
import { DropzoneArea } from 'material-ui-dropzone'
import "./styles.css";
import MultiSelect from '../shared/components/MultiSelect';

export default function AddSongPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} md={3} />
        <Grid item xs={12} md={6}>
          <Paper className={classes.padding}>
            <Typography
              className={classes.noMarginTop}
              variant="h5"
            >
              Agregar Canción
            </Typography>
            <form className={classes.marginTop} noValidate autoComplete="off">
              <div>
                <TextField
                  label="Título"
                  variant="outlined"
                  // helperText="Debe insertar un correo electrónico"
                  // error
                  fullWidth
                />
              </div>
              <div className={classes.marginTop}>
                <TextField
                  label="Año"
                  variant="outlined"
                  // helperText="Debe insertar una contraseña"
                  // error
                  fullWidth
                />
              </div>
              <div className={classes.marginTop}>
                <InputLabel>Canción</InputLabel>
                <DropzoneArea
                  dropzoneText="Arrastre un archivo .mp3 o haga click aquí para buscarlo"
                  filesLimit={1}
                  showAlerts={false}
                  previewText=""
                  showPreviewsInDropzone={false}
                  dropzoneClass="drop-zone"
                  acceptedFiles={['audio/mpeg', 'audio/mp3']}
                  dropzoneParagraphClass="drop-zone-text"
                />
              </div>
              <div className={classes.marginTop}>
                <InputLabel>Portada</InputLabel>
                <DropzoneArea
                  dropzoneText="Arrastre un archivo de imagen (.jpg, .png) o haga click aquí para buscarlo"
                  acceptedFiles={['image/jpeg', 'image/png']}
                  filesLimit={1}
                  showAlerts={false}
                  showPreviewsInDropzone={false}
                  previewText=""
                  dropzoneClass="drop-zone"
                  dropzoneParagraphClass="drop-zone-text"
                />
              </div>
              <div className={classes.marginTop}>
                <MultiSelect
                  label="Géneros"
                  options={[
                    "Salsa",
                    "Rock",
                    "Jazz",
                    "HipHop",
                    "Arjona",
                    "El Buki",
                    "Gospel",
                    "Trap",
                    "Sinfonola"
                  ]}
                />
              </div>
              <div className={classes.marginTop}>
                <Button variant="contained" color="primary" size="large">Guardar</Button>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
