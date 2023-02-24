import {
  Card,
  Text,
  Spacer,
  useModal,
  Modal,
  Input,
  Textarea,
  Button,
  Badge,
  User,
  Link as LinkDisplay,
  Grid
} from "@nextui-org/react";
import AddIcon from "../../icons/addIcon.jsx";
import UsersIcon from "../../icons/usersIcon.jsx";
import "./mySubgreddiits.css";
import useValidationForm from "../../hooks/validationForm.js";
import {requiredValidator} from "../../util/validation.js";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import backend from "../../backend/backend.js";
import useAuthFetchData from "../../hooks/fetchData.js";
import CancelIcon from "../../icons/cancelIcon.jsx";
import PostIcon from "../../icons/postIcon.jsx";
import {nFormatter} from "../../util/formatter.js";
import Fuse from 'fuse.js'

const cardStyle = {width: "min(90%, 700px)", margin: "auto", padding: "0 2rem"}

function CreateNewSubgreddiitModal({bindings}) {
  const navigate = useNavigate();
  const {data, validate, bindings: inputBindings, setData, setAllValidate} = useValidationForm({
    title: "",
    description: ""
  })
  useEffect(() => {
    setData.title("")
    setData.description("")
    setAllValidate(false)
  }, [bindings])

  const titleError = requiredValidator(data.title, "title");
  const descriptionError = requiredValidator(data.description, "description")

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return <Modal blur scroll width="min(80%, 700px)" closeButton {...bindings} aria-labelledby="create new subgreddiit"
                aria-describedby="create new subgreddiit"
                style={{paddingLeft: "2rem", paddingRight: "2rem"}}
  >
    <Modal.Header><Text h1>Create a new Subgreddiit</Text></Modal.Header>
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
        labelPlaceholder="Description"
        helperText={validate.description ? descriptionError.helperText : ""}
        status={validate.description ? (descriptionError.error ? "error" : "success") : "default"}
        {...inputBindings.description}
      />
      <Spacer/>
    </Modal.Body>

    <Modal.Footer>
      <Button
        disabled={titleError.error || descriptionError.error || submitting}
        onPress={async () => {
          try {
            setSubmitting(true);
            const response = await backend.post("subgreddiits", data)
            if (response.status === 200) {
              navigate(`/g/${data.title}`)
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

function SubgreddiitCard({subgreddiit, refetch}) {
  const [deleting, setDeleting] = useState(false)
  return (
    <Card style={cardStyle}>
      <Card.Header>
        <Grid.Container justify="space-between">
          <Grid>
            <User
              style={{paddingLeft: 0}}
              size="lg"
              src={`${backend.defaults.baseURL}subgreddiits/${subgreddiit.title}/profilePic`}

              bordered
            >
              <LinkDisplay block color="primary" as={"div"}>
                <Link to={`/g/${subgreddiit.title}`}>
                  <Text h4 color="primary">
                    {`g/${subgreddiit.title}`}
                  </Text>
                </Link>
              </LinkDisplay>

            </User>
          </Grid>
          <Grid>
            <Button
              auto
              color="error"
              light
              disabled={deleting}
              onPress={async () => {
                setDeleting(true)
                try {
                  await backend.delete(`subgreddiits/${subgreddiit.title}`)
                  await refetch()
                } catch (e) {
                  console.error(e)
                  setDeleting(false)
                }
              }}
            >
                <CancelIcon size={30} fill="currentColor"/>
            </Button>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body>
        <Text>{subgreddiit.description}</Text>
      </Card.Body>
      <Card.Divider/>
      {
        subgreddiit.bannedKeywords.length ? <><Card.Body>
          <Grid.Container gap={1}>
            <Grid><Text>Banned Keywords:</Text></Grid>
            {subgreddiit.bannedKeywords.map((el) => {
              return <Grid key={el}><Badge variant="bordered" color="error">{el}</Badge></Grid>
            })}
          </Grid.Container>
        </Card.Body>
          <Card.Divider/></> : null
      }

      <Card.Footer><Grid.Container justify="space-evenly">
        <Grid>
          <Badge color="primary" enableShadow disableOutline>
            <UsersIcon size="20"/><Text
            style={{marginLeft: "0.5rem"}}>{nFormatter(subgreddiit.followers.length, 1)}</Text>
          </Badge>
        </Grid>
        <Grid>
          <Badge color="secondary" enableShadow disableOutline>
            <PostIcon size="20"/><Text style={{marginLeft: "0.5rem"}}>{nFormatter(subgreddiit.postCount, 1)}</Text>
          </Badge>
        </Grid>
      </Grid.Container></Card.Footer>
    </Card>
  );
}

function SubgreddiitList() {
  const [subgreddiits, setSubgreddiits] = useState([]);
  const {refetch} = useAuthFetchData(async () => {
    try {
      const moderatedSubgreddiits = await backend.get("subgreddiits/moderated");
      setSubgreddiits(moderatedSubgreddiits.data)
    } catch (e) {
      console.error(e)
    }
  }, [])


  return <>
    {subgreddiits.map((el) => {
      return (<div key={el.title}>
          <Spacer/>
          <SubgreddiitCard refetch={refetch} subgreddiit={el}/>
        </div>
      );
    })}
  </>
}

export default function MySubgreddiits() {

  const {setVisible: setCreateNewVisible, bindings: createNewBindings} = useModal();

  return <>
    <CreateNewSubgreddiitModal bindings={createNewBindings}/>
    <Card style={{...cardStyle, margin: "5rem auto auto auto"}}>
      <Card.Body><Text css={{
        textGradient: "90deg, $secondary 0%, $primary 100%",
      }} h1>My Subgreddiits</Text></Card.Body>
    </Card>
    <Spacer/>
    <Card isHoverable isPressable style={cardStyle} onPress={() => {
      setCreateNewVisible(true)
    }}>
      <Card.Body>
        <div id="create-new-row">
          <Text h3 style={{marginBottom: "0"}}>Create A New Subgreddiit</Text><AddIcon/>
        </div>
      </Card.Body>
    </Card>
    <SubgreddiitList/>
    <Spacer/>
  </>
}