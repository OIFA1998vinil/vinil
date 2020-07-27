/**
 * CollabAddSongPage component module
 * @module client/components/CollabAddSongPage
 */

import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, Paper, Grid, Typography } from '@material-ui/core';
import useStyles from "../shared/styles/forms";
import MultiSelect from '../shared/components/MultiSelect';
import { useForm, Controller } from 'react-hook-form';
import FileZone from '../shared/components/FileZone';
import { post } from 'axios';
import { SERVER_API_URL } from '../../settings';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory } from 'react-router-dom';
import { COLLAB_PENDING_SONGS } from '../../locations';
import "./styles.css";

/**
 * Collab add song page component
 * @function CollabAddSongPage
 * @returns {JSX.Element} CollabAddSongPage component template
 */
export default function CollabAddSongPage() {
  const classes = useStyles();
  const history = useHistory();

  /**
   * Use React Hook Form to manage forms see: [React Hook Form documentation]{@link https://react-hook-form.com/get-started}
   */
  const form = useForm();

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Hides success modal and redirects the user to COLLAB_PENDING_SONGS location
   * @function exit
   */
  const exit = () => {
    setSuccess(false);
    history.push(COLLAB_PENDING_SONGS());
  };

  /**
   * Hides error modal
   * @function cleanError
   */
  const cleanError = () => {
    setError(null);
  };

  /**
   * Shows success modal
   * @function onSuccess
   */
  const onSuccess = () => {
    setSuccess(true);
  };

  /**
   * Shows error modal
   * @function onFail
   * @param {String} error Error message
   */
  const onFail = (error) => {
    setError(error);
    setLoading(false);
  };

  /**
   * Sends song information to the api
   * @function onSubmit
   * @param {Object} data Form data
   */
  const onSubmit = (data) => {
    setLoading(true);
    var formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (['song', 'thumbnail'].includes(key)) {
        formData.append(key, value[0])
      } else {
        formData.append(key, value)
      }
    });
    post(`${SERVER_API_URL}api/v1/actions/stage/insert-song`, formData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response) => onSuccess(response.data.result))
      .catch(error => onFail(error.response?.data?.error || 'Hubo un error de conexión'));
  };

  return (
    <>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} md={3} />
          <Grid item xs={12} md={6}>
            <Paper className={classes.padding}>
              <Typography className={classes.noMarginTop} variant="h5">
                Agregar Canción
              </Typography>
              <form className={classes.marginTop} onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                <div>
                  <TextField
                    label="Título"
                    name="title"
                    inputRef={form.register({ required: "Debe insertar una título" })}
                    error={!!form.errors.title}
                    helperText={form.errors.title?.message}
                    variant="outlined"
                    fullWidth />
                </div>
                <div className={classes.marginTop}>
                  <TextField
                    label="Año"
                    name="year"
                    type="number"
                    inputRef={form.register({
                      required: "Debe insertar un año",
                      validate(val) {
                        const number = parseFloat(val);
                        if (Number.isNaN(number)) {
                          return "Debe insertar un número";
                        }
                        if (number > new Date().getFullYear()) {
                          return "Debe insertar un año válido";
                        }
                      }
                    })}
                    error={!!form.errors.year}
                    helperText={form.errors.year?.message}
                    variant="outlined"
                    fullWidth />
                </div>
                <div className={classes.marginTop}>
                  <Controller
                    name="song"
                    control={form.control}
                    rules={{
                      validate(value) {
                        if (!value || !value.length) {
                          return "Debe agregar una canción";
                        }
                      }
                    }}
                    as={
                      <FileZone
                        label="Canción"
                        error={!!form.errors.song}
                        legend="Arrastre un archivo .mp3 o haga click aquí para buscarlo"
                        acceptedFiles={['audio/mpeg', 'audio/mp3']}
                        helperText={form.errors.song?.message} />
                    } />
                </div>
                <div className={classes.marginTop}>
                  <Controller
                    name="thumbnail"
                    control={form.control}
                    rules={{
                      validate(value) {
                        if (!value || !value.length) {
                          return "Debe agregar una portada";
                        }
                      }
                    }}
                    as={
                      <FileZone
                        label="Portada"
                        error={!!form.errors.thumbnail}
                        legend="Arrastre un archivo de imagen (.jpg, .png) o haga click aquí para buscarlo"
                        acceptedFiles={['image/jpeg', 'image/png']}
                        helperText={form.errors.thumbnail?.message} />
                    } />
                </div>
                <div className={classes.marginTop}>
                  <Controller
                    name="genres"
                    control={form.control}
                    rules={{
                      validate(value) {
                        if (!value || !value.length) {
                          return "Debe elegir al menos 1 género";
                        }
                      }
                    }}
                    as={
                      <MultiSelect
                        label="Géneros"
                        error={!!form.errors.genres}
                        helperText={form.errors.genres?.message}
                        options={[
                          "Salsa",
                          "Jazz",
                          "Folk",
                          "HipHop",
                          "Música clásica",
                          "Rock and Roll",
                          "Gospel",
                          "Soul",
                          "Rock",
                          "Disco",
                          "Funk",
                          "Pop",
                          "Reggae",
                          "Flamenco",
                          "Instrumental",
                          "Ranchera",
                          "Calypso",
                          "Cha cha cha",
                          "Mambo",
                          "Surf",
                          "Merecumbé",
                          "Merengue",
                          "Ska",
                          "Charleston",
                          "Ragtime",
                          "Swing",
                          "Bebop",
                          "Doo wop",
                          "Balada",
                          "Latino",
                          "Cumbia",
                          "Bolero",
                          "Ranchera"
                        ]} />
                    } />
                </div>
                <div className={classes.marginTop}>
                  <Button
                    disabled={loading}
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large">
                    {loading ? "Guardando" : "Guardar"}
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
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

      <Dialog open={!!success} onClose={exit} maxWidth="xs" fullWidth>
        <DialogTitle>Información</DialogTitle>
        <DialogContent>
          <DialogContentText>
            La canción ha sido agregada exitósamente, sin embargo debe ser aprovada por un administrador antes de aparecer en la aplicación
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={exit} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
