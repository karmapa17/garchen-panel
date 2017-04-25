import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {brandPrimary} from './appStyle';

export default getMuiTheme({
  appBar: {
    color: brandPrimary
  },
  palette: {
    primary1Color: brandPrimary
  },
  button: {
    minWidth: 50
  },
  tableRow: {
    height: 50
  },
  tableHeaderColumn: {
    height: 50,
    spacing: 14,
    verticalAlign: 'middle'
  },
  tableRowColumn: {
    fontSize: 40,
    spacing: 14
  }
});
