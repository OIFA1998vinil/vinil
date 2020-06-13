import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  marginTop: {
    marginTop: theme.spacing(3),
  },
  padding: {
    padding: theme.spacing(4),
  },
  noMarginTop: {
    marginTop: 0,
  },
}));