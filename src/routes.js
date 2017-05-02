import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './containers/App/App';
import PageAbout from './containers/PageAbout/PageAbout';
import PageFolders from './containers/PageFolders/PageFolders';
import PageSettings from './containers/PageSettings/PageSettings';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import PageEditFolder from './containers/PageEditFolder/PageEditFolder';
import PageEntries from './containers/PageEntries/PageEntries';
import PageAddEntry from './containers/PageAddEntry/PageAddEntry';
import PageEntry from './containers/PageEntry/PageEntry';
import PageEditEntry from './containers/PageEditEntry/PageEditEntry';

export default () => {

  return (
    <Route path="/" component={App}>

      <IndexRoute component={PageFolders} />
      <Route path="folders/:id/edit" component={PageEditFolder} />
      <Route path="folders/:id/entries" component={PageEntries} />
      <Route path="folders/:id/entries/add" component={PageAddEntry} />
      <Route path="folders/:folderId/entries/:entryId" component={PageEntry} />
      <Route path="folders/:folderId/entries/:entryId/edit" component={PageEditEntry} />
      <Route path="about" component={PageAbout} />
      <Route path="settings" component={PageSettings} />
      <Route path="*" component={PageNotFound} status={404} />
    </Route>
  );
};
