import {Card, Link as LinkDisplay, Spacer, Text, User as UserInfo, Grid} from "@nextui-org/react";
import {Link} from "react-router-dom";
import backend from "../../backend/backend.js";

function User({user, cardStyle, moderator}) {
  return (<div>

      <UserInfo
        size="lg"
        src={`${backend.defaults.baseURL}users/${user.username}/profilePic`}
        bordered
        color={moderator ? "success" : "primary"}
      >
        <LinkDisplay block color="primary" as={"div"}>
          <Link to={`/u/${user.username}`}>
            <Text color="primary">
              {`/u/${user.username}`}
            </Text>
          </Link>
        </LinkDisplay>

      </UserInfo>

      <Spacer/>
    </div>

  )
}

export default function Users({cardStyle, subgreddiit}) {

  return (<>
      <Card style={cardStyle}>
        <Card.Header>
          <Text h3>Followers</Text>
        </Card.Header>
        <Card.Body>
          {subgreddiit.followers.map((user) => (
            <User key={user.username} user={user} moderator={user.username === subgreddiit.moderator.username}
                  cardStyle={cardStyle}/>))}
        </Card.Body>
      </Card>
      <Spacer/>
      <Card style={cardStyle}>
        <Card.Header>
          <Text h3>Blocked Users</Text>
        </Card.Header>
        <Card.Body>
          {subgreddiit.blockedUsers.length === 0 ?
            <Text b>No Blocked Users</Text> :
            null
          }
          {subgreddiit.blockedUsers.map((user) => (
            <User key={user.username} user={user} moderator={user.username === subgreddiit.moderator.username}
                  cardStyle={cardStyle}/>))}
        </Card.Body>

      </Card>
      <Spacer />
      <Card style={cardStyle}>
        <Card.Header>
          <Text h3>Ex-Followers</Text>
        </Card.Header>
        <Card.Body>
          {subgreddiit.exFollowers.length === 0 ?
            <Text b>No Ex-Followers</Text> :
            null
          }
          {subgreddiit.exFollowers.map((user) => (
            <User key={user.username} user={user} moderator={user.username === subgreddiit.moderator.username}
                  cardStyle={cardStyle}/>))}
        </Card.Body>

      </Card>
      <Spacer/>
    </>
  );
}