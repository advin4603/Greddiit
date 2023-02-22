import {
  Card,
  Text,
  Spacer,
  Input,
  Button,
  Grid,
  Badge,
  styled,
  Dropdown,
  Collapse,
  Link as LinkDisplay, User, Loading
} from "@nextui-org/react";
import {useMemo, useState, useContext} from "react";
import AddIcon from "../../icons/addIcon.jsx";
import backend from "../../backend/backend.js";
import useValidationForm from "../../hooks/validationForm.js";
import {oneWordLowerCaseValidator, requiredValidator} from "../../util/validation.js";
import FilterIcon from "../../icons/filterIcon.jsx";
import UsersIcon from "../../icons/usersIcon.jsx";
import PostIcon from "../../icons/postIcon.jsx";
import AgeIcon from "../../icons/ageIcon.jsx";
import NameIcon from "../../icons/nameIcon.jsx";
import useAuthFetchData from "../../hooks/fetchData.js";
import BlockIcon from "../../icons/blockIcon.jsx";
import {Link, useRevalidator} from "react-router-dom";
import {JWTContext} from "../../contexts/jwtContext.js";
import SignOutIcon from "../../icons/signOutIcon.jsx";
import Fuse from "fuse.js";
import {nFormatter} from "../../util/formatter.js";


const StyledButton = styled("button", {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  '&:active': {
    opacity: 0.8,
  }
});
const comparatorGetters = {
  "Followers": (nextCmp) => (a, b) => {
    if (a.followerCount === undefined) {
      a.followerCount = a.followers.length
      b.followerCount = b.followers.length
    }
    if (a.followerCount === b.followerCount)
      return nextCmp(a, b)
    return b.followerCount - a.followerCount
  },
  "Posts": (nextCmp) => (a, b) => {
    if (a.postCount === b.postCount)
      return nextCmp(a, b)
    return b.postCount - a.postCount
  },
  "Age": (nextCmp) => (a, b) => {
    if (new Date(a.createdAt) === new Date(b.createdAt))
      return nextCmp(a, b)
    return new Date(b.createdAt) - new Date(a.createdAt)
  },
  "Name (A-Z)": (nextCmp) => (a, b) => {
    return a.title.localeCompare(b.title)
  },
  "Name (Z-A)": (nextCmp) => (a, b) => {
    return b.title.localeCompare(a.title)
  }
}
const sorts = [
  ["Followers", <UsersIcon/>],
  ["Posts", <PostIcon/>],
  ["Age", <AgeIcon/>],
  ["Name (A-Z)", <NameIcon/>],
  ["Name (Z-A)", <NameIcon/>]
]

function JoinButton({refetch, subgreddiit}) {
  const [submittingJoin, setSubmittingJoin] = useState(false);
  return <Button
    color="success"
    css={{minWidth: "fit-content"}}
    light
    disabled={
      subgreddiit.requested ||
      subgreddiit.rejections
        .filter(
          ({rejectedUser, rejectionExpiry}) =>
            (rejectedUser.username === request.username
              && new Date() < rejectionExpiry)
        ).length > 0 ||
      submittingJoin
    }
    onPress={async () => {
      setSubmittingJoin(true)
      try {
        const response = await backend.post(`subgreddiits/${subgreddiit.title}/join`);
        if (response.status === 200)
          await refetch()
      } catch (e) {
        console.error(e)
      }
      setSubmittingJoin(false)
    }}
  >
    {
      submittingJoin ? <Loading color="currentColor"/>
        :
        <AddIcon size={30}/>
    }

  </Button>
}

function LeaveButton({refetch, subgreddiit}) {
  const [submittingLeave, setSubmittingLeave] = useState(false);
  return <Button
    color="error"
    css={{minWidth: "fit-content"}}
    light
    disabled={submittingLeave}
    onPress={async () => {
      setSubmittingLeave(true)
      try {
        const response = await backend.post(`subgreddiits/${subgreddiit.title}/leave`);
        if (response.status === 200)
          await refetch()
      } catch (e) {
        console.log(e)
      }
      setSubmittingLeave(false)
    }}
  >
    {
      submittingLeave ? <Loading color="currentColor"/>
        :
        <SignOutIcon size={30}/>
    }

  </Button>
}

const cardStyle = {width: "min(90%, 700px)", margin: "auto", padding: "0 2rem"}
export default function Explore() {
  const {username} = useContext(JWTContext);
  const [subgreddiits, setSubgreddiits] = useState({joinedSubgreddiits: [], notJoinedSubgreddiits: []})
  const {refetch} = useAuthFetchData(async () => {
    try {
      const response = await backend.get("subgreddiits")
      if (response.status === 200)
        setSubgreddiits(response.data)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const {data, validate, bindings: inputBindings, setData, setAllValidate} = useValidationForm({
    searchTerm: "",
    tag: ""
  })
  const tagError = oneWordLowerCaseValidator(data.tag, "Tag")
  const [tags, setTags] = useState([]);
  const addTag = (tag) => setTags((prevState) => Array.from(new Set([...prevState, tag])));
  const removeTag = (tag) => setTags((prevState) => prevState.filter((presentTags) => presentTags !== tag));

  const [selectedSorts, setSelectedSorts] = useState(new Set());
  const selectedSortsValue = useMemo(() => Array.from(selectedSorts).join(", "), [selectedSorts])

  const selectedComparatorGetters = [];
  for (const selectedSort of selectedSorts) {
    selectedComparatorGetters.push(comparatorGetters[selectedSort])
  }
  let comparator = undefined

  if (selectedComparatorGetters.length) {
    comparator = selectedComparatorGetters.pop()((a, b) => 1)
    selectedComparatorGetters.reverse()
    for (const selectedComparatorGetter of selectedComparatorGetters) {
      comparator = selectedComparatorGetter(comparator)
    }
  }


  const sortedSubgreddiits = useMemo(() => {
    let resultSubgreddiits;
    if (data.searchTerm) {
      const joinedFuse = new Fuse([...subgreddiits.joinedSubgreddiits], {keys: ["title"]})
      const notJoinedFuse = new Fuse([...subgreddiits.notJoinedSubgreddiits], {keys: ["title"]})
      resultSubgreddiits = {
        joinedSubgreddiits: joinedFuse.search(data.searchTerm).map((item) => item.item),
        notJoinedSubgreddiits: notJoinedFuse.search(data.searchTerm).map((item) => item.item)
      }
    } else {
      resultSubgreddiits = {
        joinedSubgreddiits: [...subgreddiits.joinedSubgreddiits],
        notJoinedSubgreddiits: [...subgreddiits.notJoinedSubgreddiits]
      }
    }
    if (tags.length) {
      const hashedTags = new Set(tags)
      resultSubgreddiits = {
        joinedSubgreddiits: subgreddiits.joinedSubgreddiits.filter((subgreddiit) => {
          let match = false
          subgreddiit.tags.forEach((tag) => {
            if (hashedTags.has(tag))
              match = true
          })
          return match
        }),
        notJoinedSubgreddiits: subgreddiits.notJoinedSubgreddiits.filter((subgreddiit) => {
          let match = false
          subgreddiit.tags.forEach((tag) => {
            if (hashedTags.has(tag))
              match = true
          })
          return match
        })
      }
    }

    if (comparator !== undefined) {
      resultSubgreddiits.joinedSubgreddiits.sort(comparator)
      resultSubgreddiits.notJoinedSubgreddiits.sort(comparator)
    }
    return resultSubgreddiits

  }, [subgreddiits, tags, selectedSorts, data]);
  return (
    <>
      <Spacer y={3}/>
      <Card style={cardStyle}>
        <Card.Header>
          <Text
            h1
            css={{
              textGradient: "90deg, $secondary 0%, $primary 100%",
            }}
          >
            Explore Subgreddiits
          </Text>
        </Card.Header>
        <Card.Body>
          <Spacer/>
          <Input bordered labelPlaceholder="Search For Subgreddiits" {...inputBindings.searchTerm}/>
          <Spacer y={2}/>
          <Input
            bordered
            helperColor="error"
            helperText={validate.tag ? tagError.helperText : ""}
            status={validate.tag ? (tagError.error ? "error" : "success") : "default"}
            labelPlaceholder="Add Tag"
            {...inputBindings.tag}
            contentRight={<Button
              disabled={tagError.error}
              auto
              light
              size={30}
              icon={<AddIcon size={25}/>}
              onPress={() => {
                addTag(data.tag)
                setData.tag("")
              }}
            />}
          />
          <Spacer/>
          <Grid.Container gap={1}>
            <Grid><Text>Tags:</Text></Grid>
            {tags.map((el) => {
              return (
                <Grid key={el}>
                  <StyledButton
                    aria-label="remove tag"
                    onClick={() => {
                      removeTag(el)
                      setData.tag("")
                    }}
                  >
                    <Badge variant="bordered" color="primary">{el}</Badge>
                  </StyledButton>
                </Grid>);
            })}
          </Grid.Container>
          <Grid.Container justify="flex-end">
            <Grid>
              <Dropdown>
                <Dropdown.Button style={{width: "min-content"}} flat
                                 icon={<FilterIcon/>}>{selectedSortsValue || "No Sorting"}</Dropdown.Button>
                <Dropdown.Menu
                  selectionMode="multiple"
                  selectedKeys={selectedSorts}
                  onSelectionChange={setSelectedSorts}
                  disabledKeys={selectedSorts.has("Name (A-Z)") ? sorts.map(sort => sort[0]).filter(
                    (sort) => sort !== "Name (A-Z)" && !selectedSorts.has(sort)
                  ) : (
                    selectedSorts.has("Name (Z-A)") ? sorts.map(sort => sort[0]).filter(
                        (sort) => sort !== "Name (Z-A)" && !selectedSorts.has(sort)
                      ) :
                      []
                  )}
                >
                  {
                    sorts.map(
                      (sort) => {
                        return <Dropdown.Item key={sort[0]} icon={sort[1]}>
                          {sort[0]}
                        </Dropdown.Item>
                      }
                    )
                  }
                </Dropdown.Menu>
              </Dropdown>
            </Grid>
          </Grid.Container>

        </Card.Body>
      </Card>
      <Spacer/>
      <Collapse shadow style={cardStyle} title="Joined Subgreddiits">
        {

          sortedSubgreddiits.joinedSubgreddiits.length === 0 ? (
            data.searchTerm.length !== 0 || tags.length !== 0 ?
              <Text h4>No Results Found</Text> : <Text h4>No Joined Subgreddiits</Text>) : null
        }
        {
          sortedSubgreddiits.joinedSubgreddiits.map((subgreddiit) => (
            <div key={subgreddiit.title}>
              <Card.Divider/>
              <Card.Header>
                <Grid.Container justify="space-between" alignItems="center">
                  <Grid>
                    <User
                      style={{paddingLeft: 0}}
                      size="lg"
                      src="https://static.wikia.nocookie.net/undertale/images/8/81/Waterfall_location_music_box.png"
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
                  {subgreddiit.moderator.username === username ?
                    null :
                    <LeaveButton refetch={refetch} subgreddiit={subgreddiit}/>

                  }
                </Grid.Container>

              </Card.Header>
              <Card.Body>
                <Text>{subgreddiit.description}</Text>
              </Card.Body>
              {
                subgreddiit.bannedKeywords.length ? <><Card.Body>
                  <Grid.Container gap={1}>
                    <Grid><Text>Banned Keywords:</Text></Grid>
                    {subgreddiit.bannedKeywords.map((el) => {
                      return <Grid key={el}><Badge variant="bordered" color="error">{el}</Badge></Grid>
                    })}
                  </Grid.Container>
                </Card.Body>
                </> : null
              }
              <Card.Footer>
                <Grid.Container justify="space-evenly">
                  <Grid>
                    <Badge color="primary" enableShadow disableOutline>
                      <UsersIcon size="20"/><Text
                      style={{marginLeft: "0.5rem"}}>{nFormatter(subgreddiit.followerCount ?? subgreddiit.followers.length, 1)}</Text>
                    </Badge>
                  </Grid>
                  <Grid>
                    <Badge color="secondary" enableShadow disableOutline>
                      <PostIcon size="20"/><Text
                      style={{marginLeft: "0.5rem"}}>{nFormatter(subgreddiit.postCount, 1)}</Text>
                    </Badge>
                  </Grid>
                </Grid.Container>
              </Card.Footer>
              <Spacer/>
              <Card.Divider/>
            </div>
          ))
        }
        <Card.Divider/>
        <Card.Footer/>

      </Collapse>
      <Spacer/>
      <Collapse shadow style={cardStyle} title="Not Joined Subgreddiits">
        {

          sortedSubgreddiits.notJoinedSubgreddiits.length === 0 ? (
            data.searchTerm.length !== 0 || tags.length !== 0 ?
              <Text h4>No Results Found</Text> : <Text h4>All Subgreddiits have been joined</Text>) : null
        }
        {
          sortedSubgreddiits.notJoinedSubgreddiits.map((subgreddiit) => (
            <div key={subgreddiit.title}>
              <Card.Divider/>
              <Card.Header>
                <Grid.Container justify="space-between" alignItems="center">
                  <Grid>
                    <User
                      style={{paddingLeft: 0}}
                      size="lg"
                      src="https://static.wikia.nocookie.net/undertale/images/8/81/Waterfall_location_music_box.png"
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
                    {
                      subgreddiit.blocked || subgreddiit.exFollower ?
                        <Button
                          color="error"
                          css={{minWidth: "fit-content"}}
                          light
                        >
                          <BlockIcon size={30}/>
                        </Button>
                        :
                        <JoinButton refetch={refetch} subgreddiit={subgreddiit}/>
                    }

                  </Grid>
                </Grid.Container>

              </Card.Header>
              <Card.Body>
                <Text>{subgreddiit.description}</Text>
              </Card.Body>
              <Card.Footer>
                <Grid.Container justify="space-evenly">
                  <Grid>
                    <Badge color="primary" enableShadow disableOutline>
                      <UsersIcon size="20"/><Text
                      style={{marginLeft: "0.5rem"}}>{nFormatter(subgreddiit.followerCount, 1)}</Text>
                    </Badge>
                  </Grid>
                  <Grid>
                    <Badge color="secondary" enableShadow disableOutline>
                      <PostIcon size="20"/><Text
                      style={{marginLeft: "0.5rem"}}>{nFormatter(subgreddiit.postCount, 1)}</Text>
                    </Badge>
                  </Grid>
                </Grid.Container>
              </Card.Footer>
              <Spacer/>

            </div>
          ))
        }
        <Card.Divider/>
        <Card.Footer/>
      </Collapse>
      <Spacer/>
    </>
  );
}