import getMuiTheme from 'material-ui/styles/getMuiTheme';

const brandPrimary = '#0c353b';

export default getMuiTheme({
  fontFamily: 'inherit',
  appBar: {
    color: brandPrimary,
    height: 54
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
