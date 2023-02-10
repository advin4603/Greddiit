import {
  Badge,
  Button,
  Card,
  Input,
  Link as LinkDisplay,
  Modal,
  Spacer,
  Text,
  Textarea,
  useModal, User, Grid
} from "@nextui-org/react";
import UpvoteIcon from "../../icons/upvoteIcon.jsx";
import DownvoteIcon from "../../icons/downvoteIcon.jsx";
import AddIcon from "../../icons/addIcon.jsx";
import {Link, useNavigate} from "react-router-dom";
import useValidationForm from "../../hooks/validationForm.js";
import {requiredValidator} from "../../util/validation.js";
import backend from "../../backend/backend.js";
import {useContext, useEffect, useState} from "react";
import useAuthFetchData from "../../hooks/fetchData.js";
import {JWTContext} from "../../contexts/jwtContext.js";

function CreateNewPostModal({bindings, closeModal, refetch, subgreddiitTitle}) {
  const {data, validate, bindings: inputBindings, setData, setAllValidate} = useValidationForm({
    title: "",
    post: ""
  })


  useEffect(() => {
    setData.title("")
    setData.post("")
    setAllValidate(false)
  }, [bindings])

  const titleError = requiredValidator(data.title, "title");
  const postError = requiredValidator(data.post, "post")

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return <Modal blur scroll width="min(80%, 700px)" closeButton {...bindings} aria-labelledby="create new subgreddiit"
                aria-describedby="create new subgreddiit"
                style={{paddingLeft: "2rem", paddingRight: "2rem"}}
  >
    <Modal.Header><Text h1>Create A New Post</Text></Modal.Header>
    <Modal.Body>
      {error ?
        <>
          <Spacer/>
          <Badge enableShadow disableOutline color="error">
            {error}
          </Badge>
        </>
        :
        null
      }
      <Spacer/>
      <Input
        bordered
        helperColor="error"
        helperText={validate.title ? titleError.helperText : ""}
        status={validate.title ? (titleError.error ? "error" : "success") : "default"}
        labelPlaceholder="Title"
        {...inputBindings.title}
      />
      <Spacer/>
      <Textarea
        bordered
        helperColor="error"
        labelPlaceholder="Post"
        helperText={validate.post ? postError.helperText : ""}
        status={validate.post ? (postError.error ? "error" : "success") : "default"}
        {...inputBindings.post}
      />
      <Spacer/>
    </Modal.Body>

    <Modal.Footer>
      <Button
        disabled={titleError.error || postError.error || submitting}
        onPress={async () => {
          try {
            setSubmitting(true);
            const response = await backend.post("posts", {...data, postedIn: subgreddiitTitle})
            if (response.status === 200) {
              closeModal();
              refetch();
              setSubmitting(false)
            }
          } catch (e) {
            if ((e.response?.status === 400 || e.response?.status === 403) && e.response?.data.errors) {
              setError(e.response.data.errors[0])
              setSubmitting(false)
            } else {
              setError("Something went wrong")
              setSubmitting(false)
            }
          }
        }
        }
      >
        Create
      </Button>
    </Modal.Footer>
  </Modal>
}

function PostCard({post, cardStyle, refetch}) {
  const {username} = useContext(JWTContext);
  const upvoted = post.upvotes.filter((upvote)=>upvote.username===username).length !== 0
  const downvoted = post.downvotes.filter((downvote)=>downvote.username===username).length !== 0

  const [voting, setVoting] = useState(false);
  return (
    <Card style={cardStyle}>
      <Card.Header>
        <User
          style={{paddingLeft: 0}}
          size="lg"
          src="https://static.wikia.nocookie.net/undertale/images/8/81/Waterfall_location_music_box.png"
          bordered
        >
          <LinkDisplay block color="primary" as={"div"}>
            <Link to={`/u/${post.postedBy.username}`}>
              <Text h4 color="primary">
                {`u/${post.postedBy.username}`}
              </Text>
            </Link>
          </LinkDisplay>

        </User>
      </Card.Header>
      <Card.Divider/>
      <Card.Body>
        <Text h3>{post.title}</Text>
        <Text>{post.post}</Text>
      </Card.Body>
      <Card.Divider></Card.Divider>
      <Card.Footer>
        <Grid.Container>
          <Grid>
            <Button
              auto
              light={!upvoted}
              color="primary"
              icon={<UpvoteIcon />}
              disabled={voting}
              onPress={async()=>{
                setVoting(true)
                try {
                  if (upvoted)
                    await backend.delete(`posts/${post._id}/vote`)
                  else
                    await backend.post(`posts/${post._id}/upvote`)
                  await refetch();

                } catch (e) {
                  console.error(e)
                }
                setVoting(false)
              }}
            />
          </Grid>
          <Grid>
            <Button
              auto

              light={!downvoted}
              color="secondary"
              disabled={voting}
              onPress={async ()=>{
                setVoting(true)
                try {
                  if (downvoted)
                    await backend.delete(`posts/${post._id}/vote`)
                  else
                    await backend.post(`posts/${post._id}/downvote`)
                  await refetch();

                } catch (e) {
                  console.error(e)
                }
                setVoting(false)
              }}
              icon={<DownvoteIcon />}
            />
          </Grid>
        </Grid.Container>
      </Card.Footer>
    </Card>
  );
}

export default function Posts({cardStyle, subgreddiitTitle}) {
  const [posts, setPosts] = useState([]);

  const {refetch} = useAuthFetchData(async () => {
    try {
      const response = await backend.get(`posts/subgreddiits/${subgreddiitTitle}`)
      if (response.status === 200) {
        setPosts(response.data)
      }
    } catch (e) {
      console.error(e)
    }
  }, []);
  const {setVisible: setCreateNewVisible, bindings: createNewBindings} = useModal();

  return (<>
      <CreateNewPostModal
        bindings={createNewBindings}
        closeModal={() => {
          setCreateNewVisible(false)
        }}
        subgreddiitTitle={subgreddiitTitle}
        refetch={refetch}
      />
      <Card isHoverable isPressable style={cardStyle} onPress={() => {
        setCreateNewVisible(true)
      }}>
        <Card.Body>
          <div id="create-new-row">
            <Text h3>Create A New Post</Text><AddIcon/>
          </div>
        </Card.Body>
      </Card>
      <Spacer/>
      {posts.map((el) => (<div key={el._id}>
        <PostCard cardStyle={cardStyle} post={el} refetch={refetch}/>
        <Spacer/>
      </div>))}
    </>
  )
}