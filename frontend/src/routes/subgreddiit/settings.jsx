import {Badge, Card, Grid, Input, Spacer, Text, Textarea, Button, styled, Tooltip} from "@nextui-org/react";
import useValidationForm from "../../hooks/validationForm.js";
import {useEffect, useRef, useState} from "react";
import {requiredValidator, oneWordValidator, oneWordLowerCaseValidator} from "../../util/validation.js";
import EditIcon from "../../icons/editIcon.jsx";
import AddIcon from "../../icons/addIcon.jsx";
import {useNavigate, useRevalidator} from "react-router-dom";
import backend from "../../backend/backend.js";


const StyledButton = styled("button", {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  '&:active': {
    opacity: 0.8,
  }
});

export default function Settings({cardStyle, subgreddiit}) {
  const {data, validate, bindings: inputBindings, setData, setAllValidate} = useValidationForm({
    title: subgreddiit.title,
    description: subgreddiit.description,
    bannedKeyword: "",
    tag: ""
  })

  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const titleError = requiredValidator(data.title, "title");
  const descriptionError = requiredValidator(data.description, "description")
  const bannedKeywordError = oneWordValidator(data.bannedKeyword, "Banned Keyword")
  const tagError = oneWordLowerCaseValidator(data.tag, "Tag")


  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittingTag, setSubmittingTag] = useState(false);
  const [submittingBannedKeyword, setSubmittingBannedKeyword] = useState(false);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      return
    }
    const file = files[0]
    const formData = new FormData();
    formData.append("image", file)
    try {
      const response = await backend.post(`subgreddiits/${subgreddiit.title}/profilePic`, formData)
      if (response.status === 200)
        revalidator.revalidate()
    } catch (e) {
      console.error(e)
    }
  }

  const inputRef = useRef(null);


  return (<>
      <Card style={cardStyle}>
        <Card.Header>
          <Text h2>
            Edit Subgreddiit
          </Text>
        </Card.Header>
        <Card.Body>
          <input multiple={false} accept="image/*" type="file" ref={inputRef} style={{display: "none"}}
                 onChange={handleImageUpload}/>
          <Button onPress={() => {
            inputRef.current.click()
          }}>Change Profile Picture</Button>
          <Spacer/>
          {
            error ?
              <>
                <Badge enableShadow disableOutline color="error">
                  {error}
                </Badge>
                <Spacer/>
              </>
              :
              null
          }
          <Spacer/>
          <Input
            bordered
            helperColor="error"
            helperText={validate.title ? titleError.helperText : ""}
            status={validate.title ? (titleError.error ? "error" : "success") : "default"}
            labelPlaceholder="Title"
            {...inputBindings.title}
          />
          <Spacer y={2}/>
          <Textarea
            bordered
            helperColor="error"
            labelPlaceholder="Description"
            helperText={validate.description ? descriptionError.helperText : ""}
            status={validate.description ? (descriptionError.error ? "error" : "success") : "default"}
            {...inputBindings.description}
          />
          <Spacer y={1}/>
          <Button
            auto
            disabled={titleError.error || descriptionError.error}
            icon={<EditIcon size={20}/>}
            onPress={async () => {
              setSubmitting(false)
              try {

                const response = await backend.patch(`subgreddiits/${subgreddiit.title}`, {
                  title: data.title,
                  description: data.description
                })
                if (response.status === 200) {
                  if (subgreddiit.title !== data.title)
                    navigate(`/g/${data.title}`)
                  else
                    revalidator.revalidate();
                }
              } catch (e) {
                if ((e.response?.status === 400 || e.response?.status === 403) && e.response?.data.errors) {
                  setError(e.response.data.errors[0])
                } else {
                  setError("Something went wrong")
                }
              }
              setSubmitting(false)
            }}
          >
            Edit
          </Button>
          <Spacer y={2}/>
          <Input
            bordered
            helperColor="error"
            helperText={validate.bannedKeyword ? bannedKeywordError.helperText : ""}
            status={validate.bannedKeyword ? (bannedKeywordError.error ? "error" : "success") : "default"}
            labelPlaceholder="Add Banned Keyword"
            {...inputBindings.bannedKeyword}
            contentRight={
              <Button
                auto
                light
                disabled={bannedKeywordError.error || submittingBannedKeyword}
                size={30}
                icon={<AddIcon size={25}/>}
                onPress={async () => {
                  setSubmittingBannedKeyword(true)
                  try {
                    const response = await backend.post(`subgreddiits/${subgreddiit.title}/bannedKeywords`, {bannedKeyword: data.bannedKeyword})
                    if (response.status === 200) {
                      revalidator.revalidate();
                    }
                  } catch (e) {
                    console.error(e)
                  }
                  setSubmittingBannedKeyword(false)
                }}
              />
            }
          />
          <Spacer y={1}/>
          <Grid.Container gap={1}>
            <Grid><Text>Banned Keywords:</Text></Grid>
            {subgreddiit.bannedKeywords.map((el) => {
              return (
                <Grid key={el}>
                  <Tooltip content="Remove Keyword">
                    <StyledButton
                      aria-label="remove banned keyword"
                      onClick={async () => {
                        try {
                          const response = await backend.delete(`subgreddiits/${subgreddiit.title}/bannedKeywords`, {data: {bannedKeyword: el}})
                          if (response.status === 200) {
                            revalidator.revalidate();
                          }
                        } catch (e) {
                          console.error(e)
                        }
                      }}
                    >
                      <Badge variant="bordered" color="error">{el}</Badge>
                    </StyledButton>
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid.Container>

          <Spacer y={2}/>
          <Input
            bordered
            helperColor="error"
            helperText={validate.tag ? tagError.helperText : ""}
            status={validate.tag ? (tagError.error ? "error" : "success") : "default"}
            labelPlaceholder="Add Tag"
            {...inputBindings.tag}
            contentRight={<Button
              disabled={tagError.error || submittingTag}
              auto
              light
              size={30}
              icon={<AddIcon size={25}/>}
              onPress={async () => {
                setSubmittingTag(true)
                try {
                  const response = await backend.post(`subgreddiits/${subgreddiit.title}/tags`, {tag: data.tag})
                  if (response.status === 200) {
                    revalidator.revalidate();
                  }
                } catch (e) {
                  console.error(e)
                }
                setSubmittingTag(false)
              }}
            />}
          />
          <Spacer y={1}/>
          <Grid.Container gap={1}>
            <Grid><Text>Tags:</Text></Grid>
            {subgreddiit.tags.map((el) => {
              return (
                <Grid key={el}>
                  <Tooltip content="Remove Tag">
                    <StyledButton
                      aria-label="remove tag"
                      onClick={async () => {
                        try {
                          const response = await backend.delete(`subgreddiits/${subgreddiit.title}/tags`, {data: {tag: el}})
                          if (response.status === 200) {
                            revalidator.revalidate();
                          }
                        } catch (e) {
                          console.error(e)
                        }
                      }}
                    >
                      <Badge variant="bordered" color="primary">{el}</Badge>
                    </StyledButton>
                  </Tooltip>
                </Grid>);
            })}
          </Grid.Container>

        </Card.Body>
      </Card>
      <Spacer/>
    </>
  );
}