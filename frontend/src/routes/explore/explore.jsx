import {Card, Text, Spacer, Input, Button, Grid, Badge, styled} from "@nextui-org/react";
import {useState} from "react";
import AddIcon from "../../icons/addIcon.jsx";
import backend from "../../backend/backend.js";
import useValidationForm from "../../hooks/validationForm.js";
import {oneWordLowerCaseValidator, requiredValidator} from "../../util/validation.js";


const StyledButton = styled("button", {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  '&:active': {
    opacity: 0.8,
  }
});

const cardStyle = {width: "min(90%, 700px)", margin: "auto", padding: "0 2rem"}
export default function Explore() {
  const {data, validate, bindings: inputBindings, setData, setAllValidate} = useValidationForm({
    searchTerm: "",
    tag: ""
  })
  const tagError = oneWordLowerCaseValidator(data.tag, "Tag")

  const [tags, setTags] = useState([]);
  const addTag = (tag) => setTags((prevState) => Array.from(new Set([...prevState, tag])));
  const removeTag = (tag) => setTags((prevState) => prevState.filter((presentTags) => presentTags !== tag));

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
                    onClick={()=>{
                      removeTag(el)
                      setData.tag("")
                    }}
                  >
                    <Badge variant="bordered" color="primary">{el}</Badge>
                  </StyledButton>
                </Grid>);
            })}
          </Grid.Container>
        </Card.Body>
      </Card>
    </>
  );
}