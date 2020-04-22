import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ApolloProvider } from '@apollo/client'
import client from './apollo-client'
import { MatchPlaylist, MatchPlaylists } from './Playlist'

import axios from 'axios'

import { GoogleLogin } from 'react-google-login'

import './Style.scss'

const onSuccess = async data => {
  const res = await axios.post('http://localhost:4000/api/auth/google/token', 
    { access_token: data.tokenObj.access_token },
    { withCredentials: true }
  ).catch(console.log)
}

function App() {
  const [rootState, setState] = useState({ authedUser: {} })

  const getAuthedUser = async () => {
    const { data } = await axios.get('http://localhost:4000/api/auth/loggedin', 
      { withCredentials: 'include' })

    setState({ authedUser: data })
  }

  useEffect(() => { getAuthedUser()}, [])

  return <ApolloProvider client={client}>
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={console.log}
        cookiePolicy={'single_host_origin'}
      />
    </div>
    <Router>
      <div>
        <Link to={`/in/${rootState.authedUser.username}`}>
          {rootState.authedUser.username}
        </Link>
        <p>{rootState.authedUser.email}</p>
        <p>{rootState.authedUser.id}</p>
      </div>
      <Switch>
        <Route path="/in/:username" component={
          props => <MatchPlaylists {...props} authedUser={rootState.authedUser} />
        } />
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
