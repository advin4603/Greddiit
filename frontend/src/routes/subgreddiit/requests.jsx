import {Card, Link as LinkDisplay, Text, User as UserInfo, Spacer, Grid, Button} from "@nextui-org/react";
import {Link, useRevalidator} from "react-router-dom";
import AddIcon from "../../icons/addIcon.jsx";
import CancelIcon from "../../icons/cancelIcon.jsx";
import {useState} from "react";
import backend from "../../backend/backend.js";

function FollowRequest({followRequester, subgreddiit, isRejected = false}) {
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  return (<>
    <Card.Divider/>
    <Spacer y={0.5}/>
    <Grid.Container alignItems="center" justify="space-between">
      <Grid>
        <UserInfo
          size="lg"
          src={`${backend.defaults.baseURL}users/${followRequester.username}/profilePic`}
          bordered
        >
          <LinkDisplay block color="primary" as={"div"}>
            <Link to={`/u/${followRequester.username}`}>
              <Text color="primary">
                {`/u/${followRequester.username}`}
              </Text>
            </Link>
          </LinkDisplay>
        </UserInfo>
      </Grid>
      {!isRejected ?
        <Grid>
          <Grid.Container>
            <Grid>
              <Button
                color="success"
                light
                auto
                disabled={submitting}
                icon={<AddIcon/>}
                onPress={async () => {
                  setSubmitting(true)
                  try {
                    const response = await backend.post(`subgreddiits/${subgreddiit.title}/approveJoin`, {username: followRequester.username})
                    setSubmitting(false)
                    if (response.status === 200) {
                      revalidator.revalidate();
                    }
                  } catch (e) {
                    console.error(e)
                    setSubmitting(false)
                  }
                }}
              />
            </Grid>
            <Grid>
              <Button
                color="error"
                light
                disabled={submitting}
                auto
                icon={<CancelIcon/>}
                onPress={async () => {
                  setSubmitting(true)
                  try {
                    const response = await backend.post(`subgreddiits/${subgreddiit.title}/rejectJoin`, {username: followRequester.username})
                    setSubmitting(false)
                    if (response.status === 200) {
                      revalidator.revalidate();
                    }
                  } catch (e) {
                    console.error(e)
                    setSubmitting(false)
                  }
                }}
              />
            </Grid>
          </Grid.Container>
        </Grid> : null
      }

    </Grid.Container>

    <Spacer y={0.5}/>
  </>);
}

export default function Requests({cardStyle, subgreddiit}) {

  const rejectedUsers = Array.from(new Set(subgreddiit.rejectedUsers.map(({rejectedUser}) => (rejectedUser))))

  return (
    <>
      <Card style={cardStyle}>
        <Card.Body>
          <Text h3>Join Requests</Text>
          <Spacer y={0.5}/>
          {
            subgreddiit.followRequests.length === 0 ?
              <Text>No Join Requests</Text> : null
          }
          {
            subgreddiit.followRequests.map((followRequester) => (
              <div key={followRequester.username}>
                <FollowRequest subgreddiit={subgreddiit} followRequester={followRequester}/>
              </div>
            ))
          }
          <Card.Divider/>
          <Spacer y={0.5}/>
        </Card.Body>
      </Card>
      <Spacer/>
      <Card style={cardStyle}>
        <Card.Body>
          <Text h3>Rejected Requests</Text>
          <Spacer y={0.5}/>
          {
            rejectedUsers.length === 0 ?
              <Text>No Rejected Requests</Text> : null
          }
          {
            rejectedUsers.map((followRequester) => (
              <div key={followRequester.username}>
                <FollowRequest isRejected subgreddiit={subgreddiit} followRequester={followRequester}/>
              </div>
            ))
          }
          <Card.Divider/>
          <Spacer y={0.5}/>
        </Card.Body>
      </Card>
    </>
  );
}