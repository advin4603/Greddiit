import {Card, Link as LinkDisplay, Spacer, Text, User as UserInfo, Grid} from "@nextui-org/react";
import {Link} from "react-router-dom";

function User({user, cardStyle, moderator}) {
  return (<>
      <Card style={cardStyle}>
        <Card.Body>
          <UserInfo
            size="lg"
            src={"https://static.wikia.nocookie.net/undertale/images/5/50/Mad_Dummy_battle.gif"}
            bordered
            color={moderator?"success": "primary"}
          >
            <LinkDisplay block color="primary" as={"div"}>
              <Link to={`/u/${user.username}`}>
                <Text color="primary">
                  {`/u/${user.username}`}
                </Text>
              </Link>
            </LinkDisplay>

          </UserInfo>
        </Card.Body>
      </Card>
      <Spacer />
    </>

  )
}

export default function Users({cardStyle, subgreddiit}) {

  return (<>
      {subgreddiit.followers.map((user) => (
        <User user={user} moderator={user.username === subgreddiit.moderator.username} cardStyle={cardStyle}/>))}
    </>
  );
}