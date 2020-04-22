import React from 'react'
import { Link } from "react-router-dom"
import { Form, Field } from 'react-final-form'
import { gql, useQuery, useMutation } from '@apollo/client'

const GET_USER_PLAYLISTS = gql`query getUserPlaylists($username: String!) { 
  user(username: $username) {
    id email
    playlists {
      id title description
    }
  }
}`
const CREATE_PLAYLIST = gql`
  mutation CPlaylist($creatorId: Int! $title: String! $description: String!) {
    createPlaylist(title: $title description: $description creatorId: $creatorId) {
      title description creator { name }
    }
  }
`
export const MatchPlaylists = props => {
  const username = props.match.params.username
  const { data, loading } = useQuery(GET_USER_PLAYLISTS, { variables: { username }})
  if(loading) return <div>Loading</div>
  return <Playlists playlists={data.user.playlists} authedUser={props.authedUser} />
}

const Playlists = props => {
  return <div>
    {props.playlists.map(playlist => <li>
      <Link to={`/list/${playlist.id}`}>{playlist.title}</Link>
      <p>{playlist.description}</p>
    </li>)}
    <PlaylistCreate authedUser={props.authedUser} />
  </div>
}

const PlaylistCreate = props => {
  const [sendPlaylist, { data }] = useMutation(CREATE_PLAYLIST)

  const onSubmit = fieldData => {
    const variables = { ...fieldData, creatorId: props.authedUser.id }
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