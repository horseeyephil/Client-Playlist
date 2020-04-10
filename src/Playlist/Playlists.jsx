import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { Form, Field } from 'react-final-form'
import { gql, useMutation } from '@apollo/client'
import client from '../apollo-client'

const query = gql`{ 
  user(username: "stav") {
    id email
    playlists {
      id title description
    }
  }
}`
const CREATE_PLAYLIST = gql` 
  mutation CPlaylist($title: String! $description: String!) {
    createPlaylist(title: $title description: $description creatorId: 1) {
      title description creator { name}
    }
  }
`
const Playlists = props => {
  const [state, setState] = useState([])
  useEffect(_ => {
    client.query({ query }).then(({ data }) => {
      console.log(data)
      setState(data.user.playlists)
    })
  }, [])
  return <div>
    {state.map(playlist => <li>
      <Link to={`/list/${playlist.id}`}>{playlist.title}</Link>
      <p>{playlist.description}</p>
    </li>)}
    <PlaylistCreate />
  </div>
}

const PlaylistCreate = props => {
  const [sendPlaylist, { data }] = useMutation(CREATE_PLAYLIST)

  const onSubmit = variables => {
    const res = sendPlaylist({ variables })
  }

  return <Form
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Field name="title" component="input" placeholder="Start a new list!" />
        <Field name="description" component="input" placeholder="What's this list about?" />
        <button type="submit">Submit</button>
      </form>)}
  />
}

export default Playlists