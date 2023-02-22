import backend from "../../backend/backend.js";
import {createSearchParams, Link, useLoaderData, useNavigate, useRevalidator} from "react-router-dom";
import {Avatar, Card, Spacer, Text, Grid, Button, Badge, Link as LinkDisplay} from "@nextui-org/react";
import PostIcon from "../../icons/postIcon.jsx";
import UsersIcon from "../../icons/usersIcon.jsx";
import {useContext, useState} from "react";
import RequestsIcon from "../../icons/requestsIcon.jsx";
import StatsIcon from "../../icons/statsIcon.jsx";
import ReportIcon from "../../icons/reportIcon.jsx";
import SettingsIcon from "../../icons/settingsIcon.jsx";
import Posts from "./posts.jsx";
import Users from "./users.jsx";
import Settings from "./settings.jsx";
import Requests from "./requests.jsx";
import Reports from "./reports.jsx";
import {JWTContext} from "../../contexts/jwtContext.js";
import {nFormatter} from "../../util/formatter.js";
import useAuthFetchData from "../../hooks/fetchData.js";

export async function loader({params, request}) {
  try {
    const response = await backend.get(`subgreddiits/${params.subgreddiitTitle}`)
    if (response.status === 200) {
      const url = new URL(request.url);
      let tab = url.searchParams.get("tab");
      if (tab === null)
        tab = "Posts"
      return {subgreddiit: response.data, tab}
    }
  } catch (e) {
    console.error(e)
    throw new Response("", {
      status: 404,
      statusText: "Subgreddiit Not Found"
    })
  }
}


const cardStyle = {width: "min(90%, 900px)", margin: "auto", padding: "0 2rem"}

function SubgredditInfo({subgreddiit, tab}) {
  const {username} = useContext(JWTContext);
  const revalidator = useRevalidator();
  const navigate = useNavigate()
  let tabs, notJoined;
  if (subgreddiit.moderator.username === username) {
    tabs = [
      [<PostIcon/>, "Posts", <Posts cardStyle={cardStyle} subgreddiitTitle={subgreddiit.title}/>],
      [<UsersIcon/>, "Users", <Users cardStyle={cardStyle} subgreddiit={subgreddiit}/>],
      [<RequestsIcon/>, "Join Requests", <Requests cardStyle={cardStyle} subgreddiit={subgreddiit}/>],
      [<StatsIcon/>, "Stats", <></>],
      [<ReportIcon/>, "Reports", <Reports subgreddiit={subgreddiit} cardStyle={cardStyle}/>],
      [<SettingsIcon/>, "Settings", <Settings cardStyle={cardStyle} subgreddiit={subgreddiit}/>]
    ];
    notJoined = false
  } else if (subgreddiit.followers !== undefined) {
    tabs = [
      [<PostIcon/>, "Posts", <Posts cardStyle={cardStyle} subgreddiitTitle={subgreddiit.title}/>],
      [<UsersIcon/>, "Users", <Users cardStyle={cardStyle} subgreddiit={subgreddiit}/>]
    ];
    notJoined = false

  } else {
    tabs = []
    notJoined = true;
  }
  const [submittingJoin, setSubmittingJoin] = useState(false);
  if (!tabs.filter((tabEl) => (tabEl[1] === tab)).length)
    tab = "Posts"

  return (<>
      <Spacer y={3}/>
      <Card style={cardStyle}>
        <Card.Header>
          <Grid.Container justify="center" alignItems="center" gap={2}>
            <Grid>
              <Avatar
                zoomed
                pointer
                bordered
                color="gradient"
                src={"https://static.wikia.nocookie.net/undertale/images/5/50/Mad_Dummy_battle.gif"}
                css={{width: 150, height: 150}}
              />
            </Grid>
            <Grid>
              <Text
                h2
                style={{wordBreak: "break-all"}}
                css={{
                  textGradient: "90deg, $secondary 0%, $primary 100%",
                }}
              >
                g/{subgreddiit.title}
              </Text>
              <Badge color="primary" disableOutline enableShadow>
                <UsersIcon style={{marginRight: "0.5rem"}}
                           size={20}/> {nFormatter(subgreddiit.followerCount ?? subgreddiit.followers.length, 1)}
              </Badge>

            </Grid>
          </Grid.Container>
        </Card.Header>
        <Card.Divider></Card.Divider>
        <Card.Body>
          <Text b>
            {subgreddiit.description}
          </Text>
        </Card.Body>
      </Card>
      <Spacer/>
      {
        notJoined ?
          <>
            <Card style={cardStyle}>
              <Card.Body>
                <Grid.Container justify="center" gap={1} alignItems="center">
                  <Grid>
                    <Text b>
                      Moderator:
                    </Text>
                  </Grid>
                  <Grid>
                    <LinkDisplay block color="primary" as={"div"}>
                      <Link to={`/u/${subgreddiit.moderator.username}`}>
                        <Text b color="primary">
                          {`u/${subgreddiit.moderator.username}`}
                        </Text>
                      </Link>
                    </LinkDisplay>
                  </Grid>
                </Grid.Container>
                {
                  subgreddiit.blocked ?
                    <Text style={{textAlign: "center"}} h4 color="error">You have been blocked from this
                      subgreddiit</Text> : (
                      subgreddiit.exFollower ?
                        <Text style={{textAlign: "center"}} h4 color="error">You have left this
                          subgreddiit and cannot join again</Text> :
                        (
                          !subgreddiit.requested && subgreddiit.rejections.filter(({rejectionExpiry}) => (new Date() < rejectionExpiry)).length === 0 ?
                            <Button
                              color="success"
                              auto
                              disabled={submittingJoin}
                              onPress={async () => {
                                setSubmittingJoin(true)
                                try {
                                  const response = await backend.post(`subgreddiits/${subgreddiit.title}/join`);
                                  if (response.status === 200)
                                    revalidator.revalidate();
                                } catch (e) {
                                  console.log(e)
                                }
                                setSubmittingJoin(false)
                              }}
                            >
                              Send Join Request
                            </Button> :
                            <Button color="success" disabled auto>Requested</Button>
                        )
                    )

                }

              </Card.Body>
            </Card>
          </>
          :
          <>
            <Card style={cardStyle}>
              <Card.Body>
                <Grid.Container justify="space-evenly">
                  {
                    tabs.map((el) => {
                      return (
                        <Grid key={el[1]}>
                          <Button
                            light={el[1] !== tab}
                            auto
                            icon={el[0]}
                            color="primary"
                            onPress={() => {
                              navigate({
                                pathname: `/g/${subgreddiit.title}`,
                                search: `?${createSearchParams([["tab", el[1]]])}`
                              })
                            }}
                          >
                            {el[1]}
                          </Button>
                        </Grid>
                      );
                    })
                  }
                </Grid.Container>
              </Card.Body>
            </Card>
            <Spacer/>
            {
              tabs.filter((el) => (el[1] == tab))[0][2]
            }
          </>
      }

    </>
  );
}

export default function Subgreddiit() {
  const {subgreddiit, tab} = useLoaderData();
  return (<SubgredditInfo key={subgreddiit._id} tab={tab} subgreddiit={subgreddiit}/>)
}