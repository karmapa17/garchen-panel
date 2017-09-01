import React, {Component, PropTypes} from 'react';
import CircularProgress from 'material-ui/CircularProgress';

export default function resolve(func) {

  return (Target) => {

    return class InjectedResolve extends Component {

      constructor(props) {
        super(props);
        this.state = {isResolved: null};
      }

      static contextTypes = {
        store: PropTypes.object.isRequired
      };

      componentWillMount() {

        func(this.context.store, this.props)
          .then(() => {
            this.setState({isResolved: true});
          })
          .catch((err) => {
            console.error('error rejected:', err);
            this.setState({isResolved: false});
          });
      }

      render() {
        const {isResolved} = this.state;

        if (isResolved) {
          return <Target {...this.props} />;
        }
        if (false === isResolved) {
          return <div>Sorry, the page could not be loaded.</div>;
        }
        return (
          <CircularProgress mode="indeterminate" size={80}
            style={{textAlign: 'center', marginTop: '80px', marginRight: 'auto', marginLeft: 'auto', display: 'block'}} />
        );
      }
    };
  };
}
