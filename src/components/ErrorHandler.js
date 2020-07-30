import React, { Component } from 'react';
import { Button, Typography } from '@material-ui/core';
import SadIcon from "@material-ui/icons/SentimentVeryDissatisfied";

export default class ErrorHandler extends Component {
  state = {
    error: false
  }

  reloadPage() {
    window.location = window.location.href;
  }

  render() {
    const { error } = this.state;
    return error ? (
      <div style={{ display: 'flex', height: "400px", alignContent: "center", justifyContent: "center", textAlign: "center" }}>
        <div>
          <Typography variant="h1">
            <SadIcon style={{ fontSize: '34px' }} />
          </Typography>
          <Typography variant="h5">
            Lo sentimos, ha occurrido un error inesperado...
            </Typography>
          <br />
          <Button onClick={this.reloadPage} variant="contained" color="primary" size="large">
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    )
      :
      this.props.children
  }

  componentDidCatch() {
    localStorage.clear();
    this.setState({ error: true });
  }
}