import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './containers/App/App';
import PageAbout from './containers/PageAbout/PageAbout';
import PageFolderList from './containers/PageFolderList/PageFolderList';
import PageSettings from './containers/PageSettings/PageSettings';
import PageNotFound from './containers/PageNotFound/PageNotFound';

export default () => {

  return (
    <Route path="/" component={App}>

      <IndexRoute component={PageFolderList} />
      <Route path="about" component={PageAbout} />
      <Route path="settings" component={PageSettings} />
      <Route path="*" component={PageNotFound} status={404} />
    </Route>
  );
};
