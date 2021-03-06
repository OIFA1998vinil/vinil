import {
  makeStyles
} from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  center: {
    textAlign: 'center'
  },
  colaborador: {
    textAlign: 'center',
    float: 'bottom'
  }

}));