/**
 * AdminAddCollaborator component module
 * @module client/components/AdminAddCollaborator
 */

import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, Paper, Grid, Typography } from '@material-ui/core';
import useStyles from "../shared/styles/forms";
import { useForm } from 'react-hook-form';
import { post } from 'axios';
import { SERVER_API_URL } from '../../settings';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory } from 'react-router-dom';
import { ADMIN_COLLABORATORS } from '../../locations';

/**
 * Admin add collaborator page component
 * @function AdminAddCollaborator
 * @returns {JSX.Element} AdminAddCollaborator component template
 */
export default function AdminAddCollaborator() {
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
   * Hides success modal and redirects the user to ADMIN_COLLABORATORS location
   * @function exit
   */
  const exit = () => {
    setSuccess(false);
    history.push(ADMIN_COLLABORATORS());
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
   * @param {String} error Error message
   */
  const onFail = (error) => {
    setError(error);
    setLoading(false);
  };

  /**
   * Handles form submit event
   * @function onSubmit
   * @param {Object} data Form data
   */
  const onSubmit = (data) => {
    setLoading(true);
    post(`${SERVER_API_URL}api/v1/collaborators/insert`, data, { withCredentials: true })
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
                Agregar Colaborador
              </Typography>
              <form className={classes.marginTop} onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                <div>
                  <TextField
                    label="Correo electrónico"
                    name="email"
                    inputRef={form.register({ required: "Debe insertar una dirección de correo electrónico" })}
                    error={!!form.errors.email}
                    helperText={form.errors.email?.message}
                    variant="outlined"
                    fullWidth
                  />
                </div>
                <div className={classes.marginTop}>
                  <TextField
                    label="Nombre"
                    name="name"
                    inputRef={form.register({ required: "Debe insertar un nombre" })}
                    error={!!form.errors.name}
                    helperText={form.errors.name?.message}
                    variant="outlined"
                    fullWidth
                  />
                </div>
                <div className={classes.marginTop}>
                  <TextField
                    label="Apellido"
                    name="lastName"
                    inputRef={form.register({ required: "Debe insertar un apellido" })}
                    error={!!form.errors.lastName}
                    helperText={form.errors.lastName?.message}
                    variant="outlined"
                    fullWidth
                  />
                </div>
                <div className={classes.marginTop}>
                  <Button
                    disabled={loading}
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large">
                    {loading ? "Agregando" : "Agregar"}
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
            El colaborador ha sido agregador exitósamente
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
