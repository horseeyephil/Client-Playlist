import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider } from '@apollo/client'
import client from './apollo-client'
import { MatchPlaylist, Playlist, Playlists } from './Playlist'

import './Style.scss'

function App() {
  return <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route path="/in/:username">
          <Playlists />
        </Route>
        <Route path="/list/:id" component={MatchPlaylist} />
        <Route path="/place/:id">
          <div>an individual restaurant</div>
        </Route>
        <Route path="/">
          <div>List of all users</div>
        </Route>
      </Switch>
    </Router>
  </ApolloProvider>
}

export default App;
