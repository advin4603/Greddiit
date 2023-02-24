import {Card, Text, Spacer, Grid} from "@nextui-org/react";
import {LineChart, XAxis, YAxis, CartesianGrid, Line, PieChart, Pie, Tooltip} from "recharts";
import {useMemo, useState} from "react";
import useAuthFetchData from "../../hooks/fetchData.js";
import backend from "../../backend/backend.js";


export default function Stats({cardStyle, subgreddiit}) {

  const subgreddiitGrowth = useMemo(() => {
    const creationDate = new Date(new Date(subgreddiit.createdAt).toDateString()).toLocaleDateString('en-GB')
    let growthDictionary = {}
    growthDictionary[creationDate] = {date: creationDate, count: 1}
    for (const log of subgreddiit.logs) {
      const date = new Date(new Date(log.timestamp).toDateString()).toLocaleDateString('en-GB')
      if (log.logType === "join") {

        if (!growthDictionary[date])
          growthDictionary[date] = {date, count: 0}

        growthDictionary[date].count++;
      } else if (log.logType === "leave" || log.logType === "block") {
        if (!growthDictionary[date])
          growthDictionary[date] = {date, count: 0}

        growthDictionary[date].count--;
      }
    }
    let subgreddiitGrowth = Object.values(growthDictionary);
    for (let i = 1; i < subgreddiitGrowth.length; i++) {
      subgreddiitGrowth[i].count += subgreddiitGrowth[i - 1].count
    }
    return subgreddiitGrowth
  }, [subgreddiit])

  const [posts, setPosts] = useState([]);

  useAuthFetchData(async () => {
    try {
      const response = await backend.get(`posts/subgreddiits/${subgreddiit.title}`)
      if (response.status === 200) {
        setPosts(response.data)
      }
    } catch (e) {
      console.error(e)
    }
  }, []);

  const postCount = useMemo(() => {
    let growthDictionary = {}
    for (const post of posts) {
      const date = new Date(new Date(post.createdAt).toDateString()).toLocaleDateString('en-GB')
      if (!growthDictionary[date])
        growthDictionary[date] = {date, count: 0}
      growthDictionary[date].count++;
    }
    return Object.values(growthDictionary)
  }, [posts])

  const visitCount = useMemo(() => {

    let growthDictionary = {}

    for (const log of subgreddiit.logs) {
      const date = new Date(new Date(log.timestamp).toDateString()).toLocaleDateString('en-GB')
      if (log.logType === "visit") {
        if (!growthDictionary[date])
          growthDictionary[date] = {date, count: 0}

        growthDictionary[date].count++;
      }
    }
    return Object.values(growthDictionary)
  }, [subgreddiit])

  const reportCount = useMemo(() => {

    let count = 0

    for (const log of subgreddiit.logs) {
      if (log.logType === "report")
        count++;

    }
    return count
  }, [subgreddiit])

  const deletedPostsCount = useMemo(() => {

    let count = 0

    for (const log of subgreddiit.logs) {
      if (log.logType === "deletePost")
        count++;
    }
    return count
  }, [subgreddiit])


  return (
    <>

      <Card style={cardStyle}>
        <Card.Header>
          <Text h3>
            Subgreddiit Growth (Members over time)
          </Text>
        </Card.Header>
        <Card.Body>
          <Grid.Container alignItems="center" justify="center">
            <Grid>
              <LineChart width={500} height={300} data={subgreddiitGrowth}>
                <XAxis dataKey="date"/>
                <YAxis allowDecimals={false}/>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <Line type="linear" dataKey="count" stroke="var(--nextui-colors-secondary)"/>
              </LineChart>

            </Grid>
          </Grid.Container>
        </Card.Body>

      </Card>

      <Spacer/>
      <Card style={cardStyle}>
        <Card.Header>
          <Text h3>
            New Posts per day
          </Text>
        </Card.Header>
        <Card.Body>
          <Grid.Container alignItems="center" justify="center">
            <Grid>
              {
                postCount.length === 0 ?
                  <><Text b>No Posts yet</Text><Spacer/></> :
                  <LineChart width={500} height={300} data={postCount}>
                    <XAxis dataKey="date"/>
                    <YAxis allowDecimals={false}/>
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                    <Line type="linear" dataKey="count" stroke="var(--nextui-colors-secondary)"/>
                  </LineChart>
              }
            </Grid>
          </Grid.Container>
        </Card.Body>
      </Card>
      <Spacer/>
      <Card style={cardStyle}>
        <Card.Header>
          <Text h3>
            Visitors per day
          </Text>
        </Card.Header>
        <Card.Body>
          <Grid.Container alignItems="center" justify="center">
            <Grid>
              <LineChart width={500} height={300} data={visitCount}>
                <XAxis dataKey="date"/>
                <YAxis allowDecimals={false}/>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <Line type="linear" dataKey="count" stroke="var(--nextui-colors-secondary)"/>
              </LineChart>

            </Grid>
          </Grid.Container>
        </Card.Body>
      </Card>
      <Spacer/>
      <Card style={cardStyle}>
        <Card.Header>
          <Text h3>
            Reports vs Deleted Posts based on Reports
          </Text>
        </Card.Header>
        <Card.Body>
          <Grid.Container alignItems="center" justify="center">
            <Grid>
              {
                reportCount === 0 ?
                  <><Text b>No Reported Posts</Text><Spacer/></>

                  :
                  <PieChart width={500} height={300}>
                    <Pie
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      fill="var(--nextui-colors-secondary)"
                      data={
                        [
                          {name: "Reports", value: reportCount},
                          {
                            name: "Deleted Posts based on Reports",
                            value: deletedPostsCount
                          }
                        ]
                      }
                      outerRadius={150}
                    />
                    <Tooltip/>
                  </PieChart>
              }


            </Grid>
          </Grid.Container>
        </Card.Body>
      </Card>
      <Spacer/>
    </>
  )
}