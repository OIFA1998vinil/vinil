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
    alignItems: 'center',
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
    width: "250px"
  }
}));