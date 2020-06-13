import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, Paper, Grid, Typography } from '@material-ui/core';
import useStyles from "../shared/styles/forms";

export default function AdminSignInPage() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} md={4} />
        <Grid item xs={12} md={4}>
          <Paper className={classes.padding}>
            <Typography
              className={classes.noMarginTop}
              variant="h5"
            >
              Adminstración
            </Typography>
            <form className={classes.marginTop} noValidate autoComplete="off">
              <div>
                <TextField
                  label="Correo Electrónico"
                  variant="outlined"
                  // helperText="Debe insertar un correo electrónico"
                  // error
                  fullWidth
                />
              </div>
              <div className={classes.marginTop}>
                <TextField
                  label="Contraseña"
                  variant="outlined"
                  // helperText="Debe insertar una contraseña"
                  // error
                  fullWidth
                />
              </div>
              <div className={classes.marginTop}>
                <Button variant="contained" color="primary" size="large" fullWidth>Iniciar Sesión</Button>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
