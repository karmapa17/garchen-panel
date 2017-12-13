import React, {Component, PropTypes} from 'react';
import {addRouteHistory, clearRouteHistory} from './../redux/modules/main';

export default function bindAppHistory(Target) {

  return class InjectedBindAppHistory extends Component {

    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    static propTypes = {
      push: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired
    };

    componentWillMount() {
      this.context.store.dispatch(addRouteHistory(this.props.location.pathname));
    }

    render() {
      const {push} = this.props;
      const goBack = () => {
        const {store} = this.context;
        const routeHistory = store.getState().main.get('routeHistory');

        if (routeHistory.length > 1) {
          const [firstRouteHistory] = routeHistory;
          this.context.store.dispatch(clearRouteHistory());
          push(firstRouteHistory);
        }
      };
      return <Target {...this.props} goBack={goBack} />;
    }
  };
}
