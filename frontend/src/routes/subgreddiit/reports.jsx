import useAuthFetchData from "../../hooks/fetchData.js";
import {useEffect, useState} from "react";
import backend from "../../backend/backend.js";
import {Card, Link as LinkDisplay, Spacer, Text, User, Collapse, Grid, Button} from "@nextui-org/react";
import {Link} from "react-router-dom";

function CountDownButton({children, initialCount, onPress, disabled, light}) {
  const [count, setCount] = useState(initialCount)
  const [countingDown, setCountingDown] = useState(false)
  const [interval, setCountInterval] = useState(null);

  useEffect(() => {
    if (count === 0) {
      onPress?.()
      clearInterval(interval)
      setCountInterval(null)
      setCount(initialCount)
      setCountingDown(false)
    }
  }, [count])

  return (
    countingDown ?
      <Button light={light} color="error" size="sm" onPress={() => {
        if (interval !== null) {
          clearInterval(interval)
          setCountInterval(null)
        }
        setCount(initialCount)
        setCountingDown(false)
      }}

      >Cancel in {count} seconds</Button>
      :
      <Button light={light} color="error" disabled={disabled} size="sm" onPress={() => {
        setCountingDown(true)
        setCountInterval(setInterval(() => {
          setCount(prev => prev - 1);
        }, 1000))
      }}>{...children}</Button>
  )
}


function Report({report, subgreddiit, cardStyle, refetch}) {
  const reported = subgreddiit.followers.filter(follower => follower._id === report.post.postedBy)[0]
  const bannedReported = subgreddiit.blockedUsers.filter(follower => follower._id === report.post.postedBy)[0]
  const [submitting, setSubmitting] = useState(false);
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
            <Link to={`/u/${report.reporter.username}`}>
              <Text h4 color="primary">
                {`u/${report.reporter.username}`}
              </Text>
            </Link>
          </LinkDisplay>
        </User>
      </Card.Header>
      <Card.Body>
        <Text b>Concern:</Text>
        <Text>{report.concern}</Text>
      </Card.Body>
      <Card.Body>
        <Collapse title="View Post" bordered>

          <Card.Header>
            <User
              style={{paddingLeft: 0}}
              size="lg"
              src="https://static.wikia.nocookie.net/undertale/images/8/81/Waterfall_location_music_box.png"
              bordered
            >
              <LinkDisplay block color="primary" as={"div"}>
                <Link to={`/u/${reported?.username ?? bannedReported.username}`}>
                  <Text h4 color="primary">
                    {`u/${reported?.username ?? bannedReported.username}`}
                  </Text>
                </Link>
              </LinkDisplay>
            </User>
          </Card.Header>
          <Card.Body>
            <Text h3>{report.post.title}</Text>
            <Text>{report.post.post}</Text>
          </Card.Body>

        </Collapse>
      </Card.Body>
      <Card.Footer>
        <Grid.Container gap={2} justify="space-between">
          <Grid>
            <Button
              size="sm"
              color="warning"
              light={report.ignored}
              disabled={report.blocked || report.ignored || submitting}
              onPress={async () => {
                setSubmitting(true)
                try {
                  await backend.post(`reports/${report._id}/ignore`)
                  await refetch();
                } catch (e) {
                  console.error(e)
                }
                setSubmitting(false)
              }}
            >{report.ignored ? "Ignored" : "Ignore"}
            </Button>
          </Grid>
          <Grid>
            <CountDownButton
              initialCount={3}
              light={report.blocked}
              disabled={bannedReported !== undefined || report.blocked || report.ignored || submitting}
              onPress={async () => {
                setSubmitting(true)
                try {
                  await backend.post(`reports/${report._id}/block`)
                  await refetch();
                } catch (e) {
                  console.error(e)
                }
                setSubmitting(false)

              }}
            >
              {report.blocked ?
                "User Blocked" : "Block User"
              }

            </CountDownButton>
          </Grid>
          <Grid>
            <Button
              size="sm"
              color="error"
              disabled={report.blocked || report.ignored || submitting}
              onPress={async () => {
                setSubmitting(true)
                try {
                  await backend.post(`reports/${report._id}/deletePost`)
                  await refetch();
                } catch (e) {
                  console.error(e)
                }
                setSubmitting(false)
              }}
            >
              Delete Post
            </Button>
          </Grid>
        </Grid.Container>
      </Card.Footer>
    </Card>
  );
}

export default function Reports({subgreddiit, cardStyle}) {
  const [reports, setReports] = useState([]);
  const [handledReports, unhandledReports] = [reports.filter(report => report.ignored || report.blocked),
    reports.filter(report => !(report.ignored || report.blocked))]
  const {refetch} = useAuthFetchData(async () => {
    try {
      const response = await backend.get(`/subgreddiits/${subgreddiit.title}/reports`)
      if (response.status === 200)
        setReports(response.data)
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (<>
    <Card style={cardStyle}>
      <Card.Header>
        <Text h3>Unhandled Reports</Text>
      </Card.Header>
      {
        unhandledReports.length === 0 ?
          <Card.Body>
            <Text h5>No Unhandled Reports</Text>
          </Card.Body>
          : null
      }
    </Card>
    <Spacer/>
    {
      unhandledReports.map(
        (report) =>
          <div key={report._id}>
            <Report report={report} subgreddiit={subgreddiit} cardStyle={cardStyle} refetch={refetch}/>
            <Spacer/>
          </div>
      )
    }
    <Card style={cardStyle}>
      <Card.Header>
        <Text h3>Handled Reports</Text>
      </Card.Header>
      {
        handledReports.length === 0 ?
          <Card.Body>
            <Text h5>No Handled Reports</Text>
          </Card.Body>
          : null
      }
    </Card>
    <Spacer/>
    {
      handledReports.map(
        (report) =>
          <div key={report._id}>
            <Report report={report} subgreddiit={subgreddiit} cardStyle={cardStyle} refetch={refetch}/>
            <Spacer/>
          </div>
      )
    }
  </>);
}