import {Card, Text, Spacer, Grid} from "@nextui-org/react";

const cardStyle = {width: "min(90%, 700px)", margin: "auto", padding: "0 2rem"}

export default function Index() {
  return (<>
    <Spacer y={3}/>
    <Card style={cardStyle}>
      <Card.Header>
        <Grid.Container justify="center" gap={2}>
          <Grid>
            <Text h1 css={{
              marginBottom: "0"
            }}>Welcome</Text>
          </Grid>
          <Grid>
            <Text h1 css={{
              marginBottom: "0"
            }}>To</Text>
          </Grid>
          <Grid>
            <Text h1 css={{
              textGradient: "90deg, $secondary 0%, $primary 100%",
              marginBottom: "0"
            }}>Greddiit</Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body>
        <Text h3 align="center">A reddit clone made for a course assignment</Text>
        <Spacer y={2}/>
        <Text b align="center">Made by Ayan Datta</Text>
      </Card.Body>
    </Card>
  </>)
}