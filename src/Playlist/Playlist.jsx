import React from 'react'
import { Link } from "react-router-dom"
import { Form, Field } from 'react-final-form'
import { gql, useQuery, useMutation } from '@apollo/client'

const GET_PLAYLIST = gql`
  query playlist($id: Int!) {
    playlist(id: $id) {
      id title description
      rankedMembers {
        id rankPosition review 
        restaurant {
          name
        }
      }
    }
  }
`
const BUILD_PLAYLIST = gql`
  mutation BuildPlaylist(
    $playlistId: Int! $rankPosition: Int $review: String!
    $restaurantName: String! $restaurantAddress: String!
  ) {
    createMemberWithRestaurant(
      playlistId: $playlistId
      rankedMember: { rankPosition: $rankPosition review: $review }
      restaurant: { name: $restaurantName address: $restaurantAddress }
    ) {
      review restaurant { name }
    }
  }
`
export const MatchPlaylist = ({ match }) => {
  const id = +match.params.id
  const { data, loading } = useQuery(GET_PLAYLIST, { variables: { id }})

  if(loading) return <div>Loading</div>

  return <Playlist {...data.playlist} />
}

const Playlist = props => {
  return <div>
    <h1>{props.title}</h1>
    <p>{props.description}</p>
    {props.rankedMembers.map(
      member => <li>
        <h1>{member.rankPosition}</h1>
        <Link to={`/place/${member.id}`}>{member.restaurant.name}</Link>
        <p>{member.review}</p>
      </li>
    )}
    <PlaylistPopulate id={props.id} />
  </div>
}

const PlaylistPopulate = props => {
  const [buildPlaylist, { data }] = useMutation(BUILD_PLAYLIST)
  const onSubmit = values => {
    const variables = {...values, playlistId: +props.id, rankPosition: +values.rankPosition }
    console.log(variables, typeof variables.playlistId, typeof variables.rankPosition)
    const res = buildPlaylist({ variables })
    console.log('success ', res)
  }

  return  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Field name="restaurantName" component="input" placeholder="Restaurant Name"/>
        <Field name="restaurantAddress" component="input" placeholder="Address"/>
        <Field name="review" component="input" placeholder="Why did it make the list?" />
        <label>Ranking</label>
        <Field name="rankPosition" component="input" />
        <button type="submit">Submit</button>
      </form>)}
  />
}

export default Playlist