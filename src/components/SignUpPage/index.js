import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, Paper, Grid, Typography } from '@material-ui/core';
import useStyles from "../shared/styles/forms";
import { useForm, Controller } from 'react-hook-form';
import { post } from "axios";
import { API_URL } from '../../settings';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/selectors';
import { USER } from '../../constants/roles';
import { Redirect, useHistory, Link } from 'react-router-dom';
import { ADMIN_LANDING, SIGN_IN } from '../../locations';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import clsx from 'clsx';
export default function SignUpPage() {
  const history = useHistory();
  const auth = useSelector(selectAuth(USER));
  const classes = useStyles();
  const form = useForm();

  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const cleanInfo = () => {
    setInfo(null);
    history.push(SIGN_IN());
  };

  const cleanError = () => {
    setError(null);
  };

  const onSuccess = () => {
    setInfo("La solicitud se ha enviado exitósamente")
  };

  const onFail = (error) => {
    setError(error);
    setLoading(false);
  };

  const onSubmit = (data) => {
    setLoading(true);
    post(`${API_URL}api/v1/users/sign-up`, data, { withCredentials: true })
      .then((response) => onSuccess(response.data.result))
      .catch(error => onFail(error.response?.data?.error || 'Hubo un error de conexión'));
  };


  if (!!auth) {
    return <Redirect to={ADMIN_LANDING()} />
  }

  return (
    <>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} md={3} />
          <Grid item xs={12} md={6}>
            <Paper className={classes.padding}>
              <Typography className={classes.noMarginTop} variant="h5">
                Solicitar Registro
              </Typography>
              <form className={classes.marginTop} onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                <div>
                  <TextField
                    label="Correo Electrónico"
                    autoComplete="new-email"
                    name="email"
                    inputRef={form.register({
                      required: "Debe insertar un correo electrónico",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Debe insertar un correo electrónico válido"
                      }
                    })}
                    variant="outlined"
                    error={!!form.errors.email}
                    helperText={form.errors.email?.message}
                    fullWidth
                  />
                </div>
                <div className={classes.marginTop}>
                  <TextField
                    label="Contraseña"
                    name="password"
                    autoComplete="new-password"
                    type="password"
                    inputRef={form.register({ required: "Debe insertar una contraseña" })}
                    variant="outlined"
                    error={!!form.errors.password}
                    helperText={form.errors.password?.message}
                    fullWidth
                  />
                </div>
                <div className={classes.marginTop}>
                  <TextField
                    label="Nombre"
                    name="name"
                    inputRef={form.register({ required: "Debe insertar un nombre" })}
                    variant="outlined"
                    error={!!form.errors.name}
                    helperText={form.errors.name?.message}
                    fullWidth
                  />
                </div>
                <div className={classes.marginTop}>
                  <TextField
                    label="Apellido"
                    name="lastName"
                    inputRef={form.register({ required: "Debe insertar un apellido" })}
                    variant="outlined"
                    error={!!form.errors.lastName}
                    helperText={form.errors.lastName?.message}
                    fullWidth
                  />
                </div>
                <div className={classes.marginTop}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="gender-label" error={!!form.errors.gender}>
                      Género
                    </InputLabel>
                    <Controller
                      name="gender"
                      rules={{ required: "Debe seleccionar un género" }}
                      control={form.control}
                      as={
                        <Select labelId="gender-label" label="Género" error={!!form.errors.gender}>
                          <MenuItem value="Masculino">Masculino</MenuItem>
                          <MenuItem value="Femenino">Femenino</MenuItem>
                        </Select>
                      } />
                    <FormHelperText error={!!form.errors.gender}>
                      {form.errors.gender?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className={classes.marginTop}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                    <Controller
                      name="bornDate"
                      control={form.control}
                      as={
                        <KeyboardDatePicker
                          inputVariant="outlined"
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          label="Fecha de Nacimiento"
                          invalidDateMessage="Fecha inválida"
                          animateYearScrolling
                          maxDate={new Date()}
                          fullWidth
                        />
                      }
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className={classes.marginTop}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="rol-label" error={!!form.errors.rol}>
                      Rol
                    </InputLabel>
                    <Controller
                      name="rol"
                      rules={{ required: "Debe seleccionar un rol" }}
                      control={form.control}
                      as={
                        <Select labelId="rol-label" label="Rol" error={!!form.errors.rol}>
                          <MenuItem value="Cuidador">Cuidador</MenuItem>
                          <MenuItem value="Paciente">Paciente</MenuItem>
                          <MenuItem value="Otro">Otro</MenuItem>
                        </Select>
                      }
                    />
                    <FormHelperText error={!!form.errors.rol}>
                      {form.errors.rol?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className={classes.marginTop}>
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth>
                    {loading ? "Creando solicitud" : "Solicitar registro"}
                  </Button>
                </div>
                <div className={clsx(classes.marginTop, classes.center)}>
                  ¿Ya tiene una cuenta? <Link to={SIGN_IN()}>Iniciar Sesión</Link>
                </div>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <br /><br />
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
      <Dialog open={!!info} onClose={cleanInfo} maxWidth="xs" fullWidth>
        <DialogTitle>Información</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {info}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanInfo} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
