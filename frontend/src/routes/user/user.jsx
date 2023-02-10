import './user.css'

import {useLoaderData, useRevalidator} from "react-router-dom";
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
import {useContext, useEffect, useState} from "react";
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
              css={{marginLeft: 10, width: 30, height: 30}}
              disabled={error}
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
              auto
              color="success"
              icon={<EditIcon size={20} fill="currentColor" filled/>}
            />
            <Button
              css={{marginLeft: 10, width: 30, height: 30}}
              onPress={() => {
                setValue(value)
              }}
              auto
              icon={<CancelIcon size={20} fill="currentColor"/>}
              color="error"
            />
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
      auto
      icon={<CancelIcon size={20} fill="currentColor"/>}
      color="error"
      onPress={() => {
        setRemoving(true)
        try {
          backend.post(`users/${followerUsername}/${userIsFollower ? "unfollow" : "removeFollow"}`)
          revalidate();
        } catch (e) {
          setRemoving(false)
        }
      }}
    /></div>);
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

          <Card key={user.username} id="user-card" variant="bordered">
            <Card.Body id="user-card-body">
              <div id="modal-user-info-wrapper">
                <UserInfo
                  size="lg"
                  src={user.profileLink}
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

  return (<>
      <UserListModal revalidate={revalidator.revalidate} cancel={isUser} username={username} userIsFollower={false} users={user.followers}
                     title={`Followers of u/${user.username}`}
                     bindings={followerBindings}/>
      <UserListModal revalidate={revalidator.revalidate} cancel={isUser} username={username} userIsFollower users={user.following}
                     title={`Users Followed by u/${user.username}`}
                     bindings={followingBindings}/>
      <Card id="user-profile">
        <Card.Header id="user-profile-header">
          <div id="avatar-username">
            <Avatar zoomed pointer bordered color="gradient"
                    src={"https://static.wikia.nocookie.net/undertale/images/5/50/Mad_Dummy_battle.gif"}
                    css={{width: 200, height: 200}}/>
            <div>
              <Text h1 id="username-user-page" css={{
                textGradient: "90deg, $secondary 0%, $primary 100%",
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
              css={{width: "50%", margin: "auto", marginBottom: "1rem"}}
              disabled={followLoading}
              onPress={
                async () => {
                  try {
                    setFollowLoading(true)
                    await backend.post(`/users/${user.username}/${followed ? "unfollow" : "follow"}`)
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