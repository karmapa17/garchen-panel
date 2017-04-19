import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './containers/App/App';
import PageAbout from './containers/PageAbout/PageAbout';
import PageFolders from './containers/PageFolders/PageFolders';
import PageSettings from './containers/PageSettings/PageSettings';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import PageEditFolder from './containers/PageEditFolder/PageEditFolder';
import PageFolderEntries from './containers/PageFolderEntries/PageFolderEntries';
import PageAddFolderEntry from './containers/PageAddFolderEntry/PageAddFolderEntry';
import PageFolderEntry from './containers/PageFolderEntry/PageFolderEntry';
import PageEditFolderEntry from './containers/PageEditFolderEntry/PageEditFolderEntry';

export default () => {

  return (
    <Route path="/" component={App}>

      <IndexRoute component={PageFolders} />
      <Route path="folders/:id/edit" component={PageEditFolder} />
      <Route path="folders/:id/entries" component={PageFolderEntries} />
      <Route path="folders/:id/entries/add" component={PageAddFolderEntry} />
      <Route path="folders/:folderId/entries/:entryId" component={PageFolderEntry} />
      <Route path="folders/:folderId/entries/:entryId/edit" component={PageEditFolderEntry} />
      <Route path="about" component={PageAbout} />
      <Route path="settings" component={PageSettings} />
      <Route path="*" component={PageNotFound} status={404} />
    </Route>
  );
};
