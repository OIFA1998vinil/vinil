import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  },
  titleMenu: {
    marginTop: "20px",
    justifyContent: "center",
    color: theme.palette.primary
  },
  marginBottom: {
    marginBottom: theme.spacing(4),
  },
  menu: {
    width: "250px",
    marginBottom: "20px"
  },
  imagen: {
    width: 32,
    height: 32,
    margin: 5
  },
  imagen2: {
    width: 60,
    height: 60,
    margin: 10
  },
  divLogo: {
    position: "absolute",
    right: "20 px",
    top: "5px"

  }

}));