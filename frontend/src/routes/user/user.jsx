import './user.css'

import {unstable_usePrompt, useLoaderData, useRevalidator} from "react-router-dom";
import {
  Card,
  Avatar,
  Text,
  Badge,
  Button,
  Input,
  Loading,
  styled,
  useModal,
  Modal,
  User as UserInfo,
  Link as LinkDisplay, Spacer
} from "@nextui-org/react";
import {JWTContext} from "../../contexts/jwtContext.js";
import {useContext, useEffect, useRef, useState} from "react";
import useValidationForm from "../../hooks/validationForm.js";
import {
  contactNumberValidator,
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  ageValidator
} from "../../util/validation.js";
import EditIcon from "../../icons/editIcon.jsx";
import CancelIcon from "../../icons/cancelIcon.jsx";
import {Link} from "react-router-dom";
import backend from "../../backend/backend.js";
import {nFormatter} from "../../util/formatter.js";
import FollowIcon from "../../icons/followIcon.jsx";
import UnfollowIcon from "../../icons/unfollowIcon.jsx";

export async function loader({params}) {

  try {
    const response = await backend.get(`users/${params.username}`)
    if (response.status === 200)
      return response.data
  } catch (e) {
    throw new Response("", {
      status: 404,
      statusText: "User Not Found"
    })
  }


}


function EditableField({
                         username,
                         fieldName,
                         value,
                         bindings,
                         setValue,
                         inputData,
                         submitCallback,
                         validator,
                         validate,
                         fieldSubmitName,
                         setError
                       }) {
  const [submitting, setSubmitting] = useState(false);

  const {error, helperText} = validator(inputData)

  return (
    <div id="info-field">
      <Text h3 id="field-name">
        {fieldName}
      </Text>
      <div id="profile-input-field">
        <Input css={{maxWidth: 200}} helperText={validate ? helperText : ""}
               helperColor={validate ? (error ? "error" : "success") : "default"}
               color={validate ? (error ? "error" : "success") : "default"} aria-label={fieldName} underlined
               id="field-value" {...bindings} />
        {submitting ?
          <Loading css={{marginLeft: 10}}/>
          :
          <>
            <Button
              disabled={error}
              light
              onPress={async () => {
                setSubmitting(true)
                let submitData = {}
                submitData[fieldSubmitName] = inputData
                try {
                  const response = await backend.patch(`users/${username}`, submitData)
                  if (response.status === 200) {
                    submitCallback?.()
                    setSubmitting(false)
                  }
                } catch (e) {
                  if ((e.response?.status === 400 || e.response?.status === 403) && e.response?.data.errors) {
                    setError(e.response.data.errors[0])
                    setSubmitting(false)
                  } else {
                    setError("Something went wrong")
                    setSubmitting(false)
                  }

                }
              }}
              css={{minWidth: "fit-content"}}
              color="success"
            >
              <EditIcon size={30} fill="currentColor" filled/>
            </Button>
            <Button
              css={{minWidth: "fit-content"}}
              onPress={() => {
                setValue(value)
              }}
              light
              icon
              color="error"
            >
              <CancelIcon size={30} fill="currentColor"/>
            </Button>
          </>
        }

      </div>
    </div>
  );
}

function Field({fieldName, value}) {
  return (
    <div id="info-field">
      <Text h3 id="field-name">
        {fieldName}
      </Text>
      <Text h3 id="field-value-viewing">
        {value}
      </Text>
    </div>
  )
    ;
}


function Fields({user, isUser}) {
  const revalidator = useRevalidator();
  const {bindings, setData, data, validate} = useValidationForm({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    age: user.age,
    contactNumber: user.contactNumber
  });

  const DataField = isUser ? EditableField : Field;
  const [error, setError] = useState("")

  let changed = !(data.firstName === user.firstName
    && data.lastName === user.lastName
    && data.email === user.email
    && data.age === user.age
    && data.contactNumber === user.contactNumber)

  unstable_usePrompt({when: changed, message: "You have unsaved changes. Navigate to a different page?"})

  return (<>
      {error ?
        <>
          <Badge style={{margin: "auto"}} enableShadow disableOutline color="error">
            {error}
          </Badge>
          <Spacer y={3}/>
        </>
        :
        null
      }
      <DataField
        fieldName="First Name" value={user.firstName} inputData={data.firstName} setValue={setData.firstName}
        bindings={bindings.firstName}
        fieldSubmitName="firstName"
        submitCallback={revalidator.revalidate}
        validator={firstNameValidator}
        validate={validate.firstName}
        username={user.username}
        setError={setError}
      />
      <DataField
        fieldName="Last Name" value={user.lastName} inputData={data.lastName} setValue={setData.lastName}
        bindings={bindings.lastName}
        fieldSubmitName="lastName"
        submitCallback={revalidator.revalidate}
        validator={lastNameValidator}
        validate={validate.lastName}
        username={user.username}
        setError={setError}
      />
      <DataField
        fieldName="Email" value={user.email} inputData={data.email} setValue={setData.email}
        bindings={bindings.email}
        fieldSubmitName="email"
        submitCallback={revalidator.revalidate}
        validator={emailValidator}
        validate={validate.email}
        username={user.username}
        setError={setError}
      />
      <DataField
        fieldName="Age" value={user.age} inputData={data.age} setValue={setData.age}
        bindings={{...bindings.age, type: "number"}}
        fieldSubmitName="age"
        submitCallback={revalidator.revalidate}
        validator={ageValidator}
        validate={validate.age}
        username={user.username}
        setError={setError}
      />
      <DataField
        fieldName="Contact Number" inputData={data.contactNumber} value={user.contactNumber}
        setValue={setData.contactNumber} bindings={bindings.contactNumber}
        submitCallback={revalidator.revalidate}
        fieldSubmitName="contactNumber"
        validator={contactNumberValidator}
        validate={validate.contactNumber}
        username={user.username}
        setError={setError}
      /></>
  );
}

const StyledButton = styled("button", {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  '&:active': {
    opacity: 0.8,
  }
});

function UserRemoveButton({username, followerUsername, userIsFollower, revalidate}) {
  const [removing, setRemoving] = useState(false)

  return (<div id="modal-cancel-btn-wrapper">
    <Button
      disabled={removing}
      css={{minWidth: "fit-content"}}
      color="error"
      light
      onPress={async () => {
        setRemoving(true)
        try {
          await backend.post(`users/${followerUsername}/${userIsFollower ? "unfollow" : "removeFollow"}`)
          revalidate();
        } catch (e) {
          setRemoving(false)
        }
      }}
    >
      <CancelIcon size={30} fill="currentColor"/>
    </Button></div>);
}

function UserListModal({revalidate, title, bindings, users, userIsFollower, username, cancel = false}) {

  return (
    <Modal
      blur
      scroll
      width="min(80%, 700px)"
      aria-labelledby={title}
      aria-describedby={title}
      closeButton
      {...bindings}
    >
      <Modal.Header>
        <Text id="modal-title" h1>
          {title}
        </Text>
      </Modal.Header>
      <Modal.Body id="modal-body-container">
        {users.map((user) => (

          <Card key={user.username} style={{overflow: "initial"}} variant="bordered">
            <Card.Body id="user-card-body">
              <div id="modal-user-info-wrapper">
                <UserInfo
                  size="lg"
                  src={`${backend.defaults.baseURL}users/${user.username}/profilePic`}
                  bordered
                >
                  <LinkDisplay block color="primary" as={"div"}>
                    <Link to={`/u/${user.username}`}>
                      <Text color="primary">
                        {`/u/${user.username}`}
                      </Text>
                    </Link>
                  </LinkDisplay>

                </UserInfo>
              </div>

              {cancel ?
                <UserRemoveButton revalidate={revalidate} username={username} followerUsername={user.username}
                                  userIsFollower={userIsFollower}/> : null
              }

            </Card.Body>
          </Card>

        ))}
      </Modal.Body>
    </Modal>
  );
}


function UserProfile({user}) {
  const revalidator = useRevalidator();
  const {username} = useContext(JWTContext);
  const isUser = username === user.username;
  const {setVisible: setFollowersVisible, bindings: followerBindings} = useModal();
  const {setVisible: setFollowingVisible, bindings: followingBindings} = useModal();

  let followed = false;
  for (const follower of user.followers) {
    if (follower.username === username)
      followed = true
  }

  const [followLoading, setFollowLoading] = useState(false);
  const handleImageUpload = async(e) => {
    const files = e.target.files;
    if (files.length === 0) {
      return
    }
    const file = files[0]
    const formData = new FormData();
    formData.append("image", file)
    try {
      const response = await backend.post("users/profilePic", formData)
      if (response.status===200)
        revalidator.revalidate()
    } catch (e) {
      console.error(e)
    }
  }

  const inputRef = useRef(null);

  return (<>
      <input multiple={false} accept="image/*" type="file" ref={inputRef} style={{display: "none"}} onChange={handleImageUpload}/>
      <UserListModal revalidate={revalidator.revalidate} cancel={isUser} username={username} userIsFollower={false}
                     users={user.followers}
                     title={`Followers of u/${user.username}`}
                     bindings={followerBindings}/>
      <UserListModal revalidate={revalidator.revalidate} cancel={isUser} username={username} userIsFollower
                     users={user.following}
                     title={`Users Followed by u/${user.username}`}
                     bindings={followingBindings}/>
      <Card id="user-profile">
        <Card.Header id="user-profile-header">
          <div id="avatar-username">
            <Avatar
              zoomed={isUser}
              pointer={isUser}
              bordered
              onClick={isUser?async()=>{
                inputRef.current.click()
              }:undefined}
              color="gradient"
              src={`${backend.defaults.baseURL}users/${user.username}/profilePic`}
              css={{width: 200, height: 200}}
            />
            <div>
              <Text h2 id="username-user-page" css={{
                textGradient: "90deg, $secondary 0%, $primary 100%"
              }}>{`u/${user.username}`}</Text>
              <div id="user-count-bar">
                <StyledButton users={user.followers} onClick={() => {
                  setFollowersVisible(true)
                }}>
                  <Badge color="primary" enableShadow
                         disableOutline>Followers: {nFormatter(user.followers.length, 1)}</Badge>
                </StyledButton>
                <StyledButton users={user.following} onClick={() => {
                  setFollowingVisible(true)
                }}>
                  <Badge color="secondary" enableShadow
                         disableOutline>Following: {nFormatter(user.following.length, 1)}</Badge>
                </StyledButton>
              </div>

            </div>

          </div>
        </Card.Header>
        <Card.Body>
          {!isUser ?
            <Button
              color={followed ? "error" : "success"}
              auto
              icon={followed ? <UnfollowIcon/> : <FollowIcon/>}
              css={{width: "50%", margin: "auto", marginBottom: "1rem"}}
              disabled={followLoading}
              onPress={
                async () => {
                  try {
                    setFollowLoading(true)
                    await backend.post(`users/${user.username}/${followed ? "unfollow" : "follow"}`)
                    revalidator.revalidate();
                    setFollowLoading(false)
                  } catch (e) {
                    console.error(e)
                    setFollowLoading(false)
                  }
                }
              }
            >
              {followed ?
                "Unfollow" : "Follow"}
            </Button>
            :
            null
          }

          <Fields isUser={isUser} user={user} key={user.username}/>
        </Card.Body>
      </Card>
    </>
  )
    ;
}

export default function User() {
  // Note that useLoaderData should not be directly put in state. Use a child component and set a key.
  const user = useLoaderData();
  return <UserProfile key={user.username} user={user}/>
}