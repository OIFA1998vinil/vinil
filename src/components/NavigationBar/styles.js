import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  marginBottom: {
    marginBottom: theme.spacing(4),
  },
  menu: {
    width: "200px"
  }
}));