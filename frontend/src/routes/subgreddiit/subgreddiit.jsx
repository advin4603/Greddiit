import backend from "../../backend/backend.js";
import {useLoaderData} from "react-router-dom";
import {Avatar, Card, Spacer, Text, Grid, Button} from "@nextui-org/react";
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
import {JWTContext} from "../../contexts/jwtContext.js";

export async function loader({params}) {
  try {
    const response = await backend.get(`subgreddiits/${params.subgreddiitTitle}`)
    if (response.status === 200)
      return response.data
  } catch (e) {
    console.log(e)
    throw new Response("", {
      status: 404,
      statusText: "Subgreddiit Not Found"
    })
  }
}



const cardStyle = {width: "min(90%, 900px)", margin: "auto", padding: "0 2rem"}

function SubgredditInfo({subgreddiit}) {
  const {username} = useContext(JWTContext);
  let tabs;
  if (subgreddiit.moderator.username === username)
    tabs = [
      [<PostIcon />, "Posts", <Posts cardStyle={cardStyle} subgreddiitTitle={subgreddiit.title}/>],
      [<UsersIcon />, "Users", <Users cardStyle={cardStyle} subgreddiit={subgreddiit}/>],
      [<RequestsIcon />, "Join Requests", <></>],
      [<StatsIcon />, "Stats", <></>],
      [<ReportIcon />, "Reports", <></>],
      [<SettingsIcon />, "Settings", <Settings cardStyle={cardStyle} subgreddiit={subgreddiit}/>]
    ];
  else
    tabs = [
      [<PostIcon />, "Posts", <Posts cardStyle={cardStyle} subgreddiitTitle={subgreddiit.title}/>],
      [<UsersIcon />, "Users", <Users cardStyle={cardStyle} subgreddiit={subgreddiit}/>]
    ];

  const [tab, setTab] = useState("Posts");

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
      <Card style={cardStyle}>
        <Card.Body>
          <Grid.Container justify="space-evenly">
            {
              tabs.map((el)=> {
                return (
                  <Grid key={el[1]}>
                    <Button
                      light={el[1]!==tab}
                      auto
                      icon={el[0]}
                      color="primary"
                      onPress={()=>{setTab(el[1])}}
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
      <Spacer />
      {
        tabs.filter((el)=>(el[1]==tab))[0][2]
      }
    </>
  );
}

export default function Subgreddiit() {
  const subgreddiit = useLoaderData();

  return (<SubgredditInfo key={subgreddiit._id} subgreddiit={subgreddiit}/>)
}