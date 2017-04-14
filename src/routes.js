import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './containers/App/App';
import PageAbout from './containers/PageAbout/PageAbout';
import PageFolders from './containers/PageFolders/PageFolders';
import PageSettings from './containers/PageSettings/PageSettings';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import PageEditFolder from './containers/PageEditFolder/PageEditFolder';
import PageFolderEntries from './containers/PageFolderEntries/PageFolderEntries';

export default () => {

  return (
    <Route path="/" component={App}>

      <IndexRoute component={PageFolders} />
      <Route path="folders/:id/edit" component={PageEditFolder} />
      <Route path="folders/:id/entries" component={PageFolderEntries} />
      <Route path="about" component={PageAbout} />
      <Route path="settings" component={PageSettings} />
      <Route path="*" component={PageNotFound} status={404} />
    </Route>
  );
};
