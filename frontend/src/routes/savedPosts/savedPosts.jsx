import {Card, Text, Spacer} from "@nextui-org/react";
import backend from "../../backend/backend.js";
import {useLoaderData, useRevalidator} from "react-router-dom";
import useAuthFetchData from "../../hooks/fetchData.js";
import {useState} from "react";
import {PostCard} from "../subgreddiit/posts.jsx";
import {useContext} from "react";
import {JWTContext} from "../../contexts/jwtContext.js";

const cardStyle = {width: "min(90%, 900px)", margin: "auto", padding: "0 2rem"}

export async function loader({params, request}, {username}) {
  try {
    const response = await backend.get(`users/${username}/savedPosts`)
    if (response.status === 200) {
      return response.data
    }
  } catch (e) {
    console.error(e)
    throw new Response("", {
      status: 404,
      statusText: "Not Found"
    })
  }
}

function SavedPost({id}) {
  const [post, setPost] = useState(undefined);
  const {username} = useContext(JWTContext);
  const revalidator = useRevalidator();
  const {refetch} = useAuthFetchData(async () => {
    try {
      const response = await backend.get(`posts/${id}`)
      if (response.status === 200)
        setPost(response.data)
    } catch (e) {
      if (e.response?.status !== 401)
        console.error(e)
    }
  }, [])
  if (post === undefined)
    return null

  return (
    <>
      <PostCard
        post={post}
        cardStyle={cardStyle}
        username={username}
        savedPostsFetched={true}
        saved
        refetch={refetch}
        savedPostsRefetch={revalidator.revalidate}
        showSubgreddiit
      />
      <Spacer />
    </>
  )
}

export default function SavedPosts() {
  const savedPostIDs = useLoaderData()
  return (
    <>
      <Card style={{...cardStyle, margin: "5rem auto auto auto"}}>
        <Card.Body>
          <Text css={{
            textGradient: "90deg, $secondary 0%, $primary 100%",
          }} h1>
            Saved Posts
          </Text>
        </Card.Body>
      </Card>
      <Spacer/>
      {
        savedPostIDs.map(id =>
          <SavedPost id={id} key={id}/>
        )
      }
    </>
  );
}