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
  Popover,
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
import CommentIcon from "../../icons/commentIcon.jsx";
import {nFormatter} from "../../util/formatter.js";
import FollowIcon from "../../icons/followIcon.jsx";
import UnfollowIcon from "../../icons/unfollowIcon.jsx";
import ReportIcon from "../../icons/reportIcon";
import SavePostIcon from "../../icons/savePostIcon";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "./posts.css"

dayjs.extend(relativeTime)

function CreateNewPostModal({bindings, closeModal, refetch, subgreddiitTitle, bannedKeywords}) {
  const {data, validate, bindings: inputBindings, setData, setAllValidate} = useValidationForm({
    title: "",
    post: ""
  })


  useEffect(() => {
    setData.title("")
    setData.post("")
    setError("")
    setAllValidate(false)
  }, [bindings])

  const titleError = requiredValidator(data.title, "title");
  const postError = requiredValidator(data.post, "post")

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  let hasBanned = false;
  if (bannedKeywords !== undefined)
    for (const bannedKeyword of bannedKeywords) {
      let regex = new RegExp(bannedKeyword, "i")
      if (regex.test(data.title) || regex.test(data.post))
        hasBanned = true;
    }

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
      {
        hasBanned ?
          <Popover>
            <Popover.Trigger>
              <Button disabled={titleError.error || postError.error || submitting}>Create</Button>
            </Popover.Trigger>
            <Popover.Content>
              <div style={{padding: "1rem"}}>
                <Grid.Container justify="center">
                  <Grid>
                    <Text b>Confirm</Text>
                  </Grid>
                </Grid.Container>
                <Grid.Container justify="center">
                  <Grid>
                    <Text style={{textAlign: "center"}}>Your post contains words banned by the moderator. These words
                      will be censored</Text>
                  </Grid>
                </Grid.Container>
                <Grid.Container justify="center">
                  <Grid>
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
                  </Grid>
                </Grid.Container>
              </div>
            </Popover.Content>
          </Popover> :
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

      }
    </Modal.Footer>
  </Modal>
}

function CreateNewReportModal({bindings, closeModal, post}) {
  const {data, validate, bindings: inputBindings, setData, setAllValidate} = useValidationForm({
    concern: ""
  })
  useEffect(() => {
    setData.concern("")
    setAllValidate(false)
  }, [bindings])

  const concernError = requiredValidator(data.concern, "concern");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return <Modal blur scroll width="min(80%, 700px)" closeButton {...bindings} aria-labelledby="create new subgreddiit"
                aria-describedby="create new subgreddiit"
                style={{paddingLeft: "2rem", paddingRight: "2rem"}}
  >
    <Modal.Header><Text h1>Report Post</Text></Modal.Header>
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
      <Textarea
        bordered
        helperColor="error"
        labelPlaceholder="Concern"
        helperText={validate.concern ? concernError.helperText : ""}
        status={validate.concern ? (concernError.error ? "error" : "success") : "default"}
        {...inputBindings.concern}
      />
      <Spacer/>
    </Modal.Body>

    <Modal.Footer>
      <Button
        disabled={concernError.error || submitting}
        onPress={async () => {
          try {
            setSubmitting(true);
            const response = await backend.post("reports", {...data, post: post._id})
            if (response.status === 200) {
              closeModal();
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
        Report
      </Button>
    </Modal.Footer>
  </Modal>
}

function Comment({post, comment, username, refetchComments}) {
  const isBlocked = comment.commentedBy._id === undefined;

  const upvoted = comment.upvotes.filter((upvote) => upvote.username === username).length !== 0
  const downvoted = comment.downvotes.filter((downvote) => downvote.username === username).length !== 0
  let votes = comment.upvotes.length - comment.downvotes.length;
  if (votes >= 0)
    votes = nFormatter(votes, 1);
  else
    votes = "-" + nFormatter(-votes, 1);
  const [voting, setVoting] = useState(false);

  return (<>
      <Card variant="bordered" style={{overflow: "initial"}}>
        <Card.Header>
          <User
            style={{paddingLeft: 0}}
            size="md"
            src={`${backend.defaults.baseURL}users/${comment.commentedBy.username}/profilePic`}
            bordered
          >
            {isBlocked ?
              <Text h5 color="error">
                Blocked User
              </Text> : <LinkDisplay block color="primary" as={"div"}>
                <Link to={`/u/${comment.commentedBy.username}`}>
                  <Text h5 color="primary">
                    {`u/${comment.commentedBy.username}`}
                  </Text>
                </Link>
              </LinkDisplay>}
          </User>
        </Card.Header>
        <Card.Body>
          <Text>
            {comment.comment}
          </Text>
          <Text b style={{textAlign: "right"}} size="$xs">{dayjs(comment.createdAt).fromNow()}</Text>
        </Card.Body>
        <Card.Divider/>
        <Card.Footer>
          <Grid.Container gap={1} alignItems="center">
            <Grid>
              <Button
                css={{minWidth: "fit-content"}}
                light={!upvoted}
                color="primary"
                icon={<UpvoteIcon/>}
                disabled={voting}
                onPress={async () => {
                  setVoting(true)
                  try {
                    if (upvoted)
                      await backend.delete(`comments/${comment._id}/vote`)
                    else
                      await backend.post(`comments/${comment._id}/upvote`)
                    await refetchComments();

                  } catch (e) {
                    console.error(e)
                  }
                  setVoting(false)
                }}
              />
            </Grid>
            <Grid>
              <Text b>
                {votes}
              </Text>

            </Grid>
            <Grid>
              <Button
                css={{minWidth: "fit-content"}}
                light={!downvoted}
                color="secondary"
                disabled={voting}
                onPress={async () => {
                  setVoting(true)
                  try {
                    if (downvoted)
                      await backend.delete(`comments/${comment._id}/vote`)
                    else
                      await backend.post(`comments/${comment._id}/downvote`)
                    await refetchComments();

                  } catch (e) {
                    console.error(e)
                  }
                  setVoting(false)
                }}
                icon={<DownvoteIcon/>}
              />
            </Grid>
          </Grid.Container>
        </Card.Footer>
      </Card>
    </>
  );
}

function Comments({post, modalBindings, username}) {
  const [comments, setComments] = useState([]);
  const {refetch: commentsRefetch} = useAuthFetchData(async () => {
    try {
      const response = await backend.get(`posts/${post._id}/comments`)
      if (response.status === 200)
        setComments(response.data)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const {data, validate, bindings: inputBindings, setData, setAllValidate} = useValidationForm({
    comment: ""
  })
  useEffect(() => {
    setData.comment("")
    setAllValidate(false)
  }, [modalBindings])

  const commentError = requiredValidator(data.comment, "comment");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
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
      <div id="comment-input">
        <Textarea
          rows={3}
          bordered
          helperColor="error"
          labelPlaceholder="Comment"
          helperText={validate.comment ? commentError.helperText : ""}
          status={validate.comment ? (commentError.error ? "error" : "success") : "default"}
          {...inputBindings.comment}
        />
        <Button
          light
          color="primary"
          icon={<CommentIcon/>}
          css={{minWidth: "fit-content"}}
          disabled={commentError.error || submitting}
          onPress={async () => {
            try {
              setSubmitting(true);
              const response = await backend.post("comments", {...data, commentedOn: post._id})
              if (response.status === 200) {
                setError("")
                await commentsRefetch();
                setSubmitting(false)
                setData.comment("")
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
        />
      </div>
      <Spacer/>
      {
        comments.map(comment => (
          <Comment username={username} post={post} key={comment._id} comment={comment}
                   refetchComments={commentsRefetch}/>
        ))
      }
      <Spacer/>
    </>
  );
}

function FullPostModal({
                         post,
                         refetchPost,
                         username,
                         savedPostsFetched,
                         saved,
                         savedPostsRefetch,
                         bindings,
                         showSubgreddiit = false,
                         upvoted,
                         downvoted,
                         voting,
                         setVoting,
                         poster,
                         setPoster,
                         saving,
                         setSaving,
                         followSubmitting,
                         setFollowSubmitting,
                         isBlocked,
                         votes
                       }) {
  return (
    <Modal
      style={{paddingLeft: "2rem", paddingRight: "2rem"}}
      width="min(80%, 700px)"
      closeButton
      blur
      scroll
      aria-labelledby={post.title}
      {...bindings}
    >
      <Modal.Header>
        <Grid.Container justify="space-between">
          <Grid>
            <User
              style={{paddingLeft: 0}}
              size="lg"
              src={showSubgreddiit?
                `${backend.defaults.baseURL}subgreddiits/${post.postedIn.title}/profilePic`:
                `${backend.defaults.baseURL}users/${post.postedBy.username}/profilePic`}
              bordered
            >

              {
                !showSubgreddiit ?
                  (isBlocked ?
                    <Text h4 color="error">
                      Blocked User
                    </Text> : <LinkDisplay block color="primary" as={"div"}>
                      <Link to={`/u/${post.postedBy.username}`}>
                        <Text h4 color="primary">
                          {`u/${post.postedBy.username}`}
                        </Text>
                      </Link>
                    </LinkDisplay>) : (<Grid.Container direction="column" alignItems="flex-start">
                      <Grid>
                        <LinkDisplay block color="secondary" as={"div"}>
                          <Link to={`/g/${post.postedIn.title}`}>
                            <Text h4 color="secondary">
                              {`g/${post.postedIn.title}`}
                            </Text>
                          </Link>
                        </LinkDisplay>
                      </Grid>
                      <Grid>
                        {(isBlocked ?
                          <LinkDisplay block color="error" as={"div"}>
                            <Text color="error">
                              Blocked User
                            </Text></LinkDisplay> : <LinkDisplay block color="primary" as={"div"}>
                            <Link to={`/u/${post.postedBy.username}`}>
                              <Text color="primary">
                                {`u/${post.postedBy.username}`}
                              </Text>
                            </Link>
                          </LinkDisplay>)}
                      </Grid>
                    </Grid.Container>
                  )
              }
            </User>
          </Grid>
          <Grid>
            {
              post.postedBy.username === username ?
                null :
                poster?.followers?.filter(follower => follower.username === username).length === 0 ?
                  <Button
                    light
                    color="success"
                    icon={<FollowIcon/>}
                    css={{minWidth: "fit-content"}}
                    disabled={followSubmitting}
                    onPress={async () => {
                      try {
                        const response = await backend.post(`users/${poster.username}/follow`)
                        if (response.status === 200)
                          refetchPoster();
                      } catch (e) {
                        console.error(e)
                      }
                    }}
                  />
                  :
                  <Button
                    light
                    color="error"
                    icon={<UnfollowIcon/>}
                    css={{minWidth: "fit-content"}}
                    disabled={followSubmitting}
                    onPress={async () => {
                      try {
                        const response = await backend.post(`users/${poster.username}/unfollow`)
                        if (response.status === 200)
                          refetchPoster();
                      } catch (e) {
                        console.error(e)
                      }
                    }}
                  />

            }
          </Grid>
        </Grid.Container>


      </Modal.Header>
      <Card.Divider/>
      <Modal.Body>
        <Text h3>{post.title}</Text>
        <Text>{post.post}</Text>
        <Text b style={{textAlign: "right"}} size="$xs">{dayjs(post.createdAt).fromNow()}</Text>
        <Grid.Container alignItems="center" justify="space-between">
          <Grid>
            <Grid.Container gap={1} alignItems="center">
              <Grid>
                <Button
                  css={{minWidth: "fit-content"}}
                  light={!upvoted}
                  color="primary"
                  icon={<UpvoteIcon/>}
                  disabled={voting}
                  onPress={async () => {
                    setVoting(true)
                    try {
                      if (upvoted)
                        await backend.delete(`posts/${post._id}/vote`)
                      else
                        await backend.post(`posts/${post._id}/upvote`)
                      await refetchPost();

                    } catch (e) {
                      console.error(e)
                    }
                    setVoting(false)
                  }}
                />
              </Grid>
              <Grid>
                <Text b>
                  {votes}
                </Text>

              </Grid>
              <Grid>
                <Button
                  css={{minWidth: "fit-content"}}
                  light={!downvoted}
                  color="secondary"
                  disabled={voting}
                  onPress={async () => {
                    setVoting(true)
                    try {
                      if (downvoted)
                        await backend.delete(`posts/${post._id}/vote`)
                      else
                        await backend.post(`posts/${post._id}/downvote`)
                      await refetchPost();

                    } catch (e) {
                      console.error(e)
                    }
                    setVoting(false)
                  }}
                  icon={<DownvoteIcon/>}
                />
              </Grid>
            </Grid.Container>
          </Grid>
          {
            !showSubgreddiit ?
              <Grid>
                <Button
                  disabled={!savedPostsFetched || saving}
                  css={{minWidth: "fit-content"}}
                  light={!saved}
                  color="success"
                  icon={<SavePostIcon/>}
                  onPress={async () => {
                    setSaving(true)
                    try {
                      let response
                      if (saved)
                        response = await backend.delete(`users/${username}/savedPosts`, {
                          data: {
                            postID: post._id,
                            subgreddiitTitle: post.postedIn.title
                          }
                        })
                      else
                        response = await backend.post(`users/${username}/savedPosts`, {
                          postID: post._id,
                          subgreddiitTitle: post.postedIn.title
                        })
                      await savedPostsRefetch()
                    } catch (e) {
                      console.error(e)
                    }
                    setSaving(false)
                  }}
                />
              </Grid> :
              null
          }

        </Grid.Container>
        <Comments username={username} post={post} modalBindings={bindings}/>
      </Modal.Body>
    </Modal>
  )
}

export function PostCard({
                           post,
                           cardStyle,
                           refetch,
                           username,
                           savedPostsFetched,
                           saved,
                           savedPostsRefetch,
                           showSubgreddiit = false
                         }) {

  const {setVisible: setVisibleFullPost, bindings: fullPostModalBindings} = useModal();
  const upvoted = post.upvotes.filter((upvote) => upvote.username === username).length !== 0
  const downvoted = post.downvotes.filter((downvote) => downvote.username === username).length !== 0
  let votes = post.upvotes.length - post.downvotes.length;
  if (votes >= 0)
    votes = nFormatter(votes, 1);
  else
    votes = "-" + nFormatter(-votes, 1);
  const [voting, setVoting] = useState(false);
  const [poster, setPoster] = useState({});
  const [saving, setSaving] = useState(false);
  const [followSubmitting, setFollowSubmitting] = useState(true);
  const isBlocked = post.postedBy._id === undefined;
  const {refetch: refetchPoster} = useAuthFetchData(async () => {
    if (isBlocked)
      return
    try {
      const response = await backend.get(`users/${post.postedBy.username}`)
      if (response.status === 200) {
        setPoster(response.data)
        setFollowSubmitting(false)
      }
    } catch (e) {
      console.error(e)
    }

  }, [])
  const {setVisible: setCreateReportVisible, bindings: createReportBindings} = useModal();


  return (<>
      <FullPostModal
        post={post}
        refetchPost={refetch}
        username={username}
        savedPostsFetched={savedPostsFetched}
        saved={saved}
        savedPostsRefetch={savedPostsRefetch}
        bindings={fullPostModalBindings}
        showSubgreddiit={showSubgreddiit}
        upvoted={upvoted}
        downvoted={downvoted}
        voting={voting}
        setVoting={setVoting}
        poster={poster}
        setPoster={setPoster}
        saving={saving}
        setSaving={setSaving}
        followSubmitting={followSubmitting}
        setFollowSubmitting={setFollowSubmitting}
        isBlocked={isBlocked}
        votes={votes}
      />
      <CreateNewReportModal
        bindings={createReportBindings}
        closeModal={() => {
          setCreateReportVisible(false)
        }}
        post={post}
      />
      <Card style={cardStyle}>
        <Card.Header>
          <Grid.Container justify="space-between">
            <Grid>
              <User
                style={{paddingLeft: 0}}
                size="lg"
                src={showSubgreddiit?
                  `${backend.defaults.baseURL}subgreddiits/${post.postedIn.title}/profilePic`:
                  `${backend.defaults.baseURL}users/${post.postedBy.username}/profilePic`}
                bordered
              >

                {
                  !showSubgreddiit ?
                    (isBlocked ?
                      <Text h4 color="error">
                        Blocked User
                      </Text> : <LinkDisplay block color="primary" as={"div"}>
                        <Link to={`/u/${post.postedBy.username}`}>
                          <Text h4 color="primary">
                            {`u/${post.postedBy.username}`}
                          </Text>
                        </Link>
                      </LinkDisplay>) : (<Grid.Container direction="column">
                        <Grid>
                          <LinkDisplay block color="secondary" as={"div"}>
                            <Link to={`/g/${post.postedIn.title}`}>
                              <Text h4 color="secondary">
                                {`g/${post.postedIn.title}`}
                              </Text>
                            </Link>
                          </LinkDisplay>
                        </Grid>
                        <Grid>
                          {(isBlocked ?
                            <LinkDisplay block color="error" as={"div"}>
                              <Text color="error">
                                Blocked User
                              </Text></LinkDisplay> : <LinkDisplay block color="primary" as={"div"}>
                              <Link to={`/u/${post.postedBy.username}`}>
                                <Text color="primary">
                                  {`u/${post.postedBy.username}`}
                                </Text>
                              </Link>
                            </LinkDisplay>)}
                        </Grid>
                      </Grid.Container>
                    )
                }
              </User>
            </Grid>
            <Grid>
              {
                post.postedBy.username === username ?
                  null :
                  poster?.followers?.filter(follower => follower.username === username).length === 0 ?
                    <Button
                      light
                      color="success"
                      icon={<FollowIcon/>}
                      css={{minWidth: "fit-content"}}
                      disabled={followSubmitting}
                      onPress={async () => {
                        try {
                          const response = await backend.post(`users/${poster.username}/follow`)
                          if (response.status === 200)
                            refetchPoster();
                        } catch (e) {
                          console.error(e)
                        }
                      }}
                    />
                    :
                    <Button
                      light
                      color="error"
                      icon={<UnfollowIcon/>}
                      css={{minWidth: "fit-content"}}
                      disabled={followSubmitting}
                      onPress={async () => {
                        try {
                          const response = await backend.post(`users/${poster.username}/unfollow`)
                          if (response.status === 200)
                            refetchPoster();
                        } catch (e) {
                          console.error(e)
                        }
                      }}
                    />

              }
            </Grid>
          </Grid.Container>


        </Card.Header>
        <Card.Divider/>
        <Card.Body>
          <Text h3>{post.title}</Text>
          <Text>{post.post}</Text>
          <Text b style={{textAlign: "right"}} size="$xs">{dayjs(post.createdAt).fromNow()}</Text>
        </Card.Body>
        <Card.Divider></Card.Divider>
        <Card.Footer>
          <Grid.Container alignItems="center" justify="space-between">
            <Grid>
              <Grid.Container gap={1} alignItems="center">
                <Grid>
                  <Button
                    css={{minWidth: "fit-content"}}
                    light={!upvoted}
                    color="primary"
                    icon={<UpvoteIcon/>}
                    disabled={voting}
                    onPress={async () => {
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
                  <Text b>
                    {votes}
                  </Text>

                </Grid>
                <Grid>
                  <Button
                    css={{minWidth: "fit-content"}}
                    light={!downvoted}
                    color="secondary"
                    disabled={voting}
                    onPress={async () => {
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
                    icon={<DownvoteIcon/>}
                  />
                </Grid>
              </Grid.Container>
            </Grid>
            {post.postedBy.username === username ? null :
              <Grid>
                <Button
                  css={{minWidth: "fit-content"}}
                  light
                  color="error"
                  icon={<ReportIcon/>}
                  onPress={() => {
                    setCreateReportVisible(true)
                  }}
                />
              </Grid>
            }
            <Grid>
              <Button
                disabled={!savedPostsFetched || saving}
                css={{minWidth: "fit-content"}}
                light={!saved}
                color="success"
                icon={<SavePostIcon/>}
                onPress={async () => {
                  setSaving(true)
                  try {
                    let response
                    if (saved)
                      response = await backend.delete(`users/${username}/savedPosts`, {
                        data: {
                          postID: post._id,
                          subgreddiitTitle: post.postedIn.title
                        }
                      })
                    else
                      response = await backend.post(`users/${username}/savedPosts`, {
                        postID: post._id,
                        subgreddiitTitle: post.postedIn.title
                      })
                    await savedPostsRefetch()
                  } catch (e) {
                    console.error(e)
                  }
                  setSaving(false)
                }}
              />
            </Grid>
            <Grid>
              <Button
                css={{minWidth: "fit-content"}}
                light
                color="primary"
                icon={<CommentIcon/>}
                onPress={() => {
                  setVisibleFullPost(true);
                }}
              />
            </Grid>


          </Grid.Container>

        </Card.Footer>
      </Card></>
  );
}

export default function Posts({cardStyle, subgreddiitTitle, bannedKeywords}) {
  const {username} = useContext(JWTContext);
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

  const [savedPostsFetched, setSavedPostsFetched] = useState(false);
  const [savedPostsIDs, setSavedPostsIDs] = useState([]);

  const savedPostsIDsSet = new Set(savedPostsIDs);

  const {refetch: savedPostsRefetch} = useAuthFetchData(async () => {
    setSavedPostsFetched(false)
    try {
      const response = await backend.get(`users/${username}/savedPosts`)
      if (response.status === 200) {
        setSavedPostsIDs(response.data)
        setSavedPostsFetched(true)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const {setVisible: setCreateNewVisible, bindings: createNewBindings} = useModal();

  return (<>
      <CreateNewPostModal
        bannedKeywords={bannedKeywords}
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
            <Text h3 style={{marginBottom: "0"}}>Create A New Post</Text><AddIcon/>
          </div>
        </Card.Body>
      </Card>
      <Spacer/>
      {posts.map((el) => (<div key={el._id}>
        <PostCard username={username} savedPostsFetched={savedPostsFetched} saved={savedPostsIDsSet.has(el._id)}
                  savedPostsRefetch={savedPostsRefetch} cardStyle={cardStyle} post={el} refetch={refetch}/>
        <Spacer/>
      </div>))}
    </>
  )
}