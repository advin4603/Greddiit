import {useLoaderData, useRevalidator} from "react-router-dom";
import './user.css'
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
  Link as LinkDisplay
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

export async function loader({params}) {
  let admin = {
    username: "admin",
    firstName: "Ayan",
    lastName: "Datta",
    email: "advin4603@gmail.com",
    age: "20",
    contactNumber: "7036841181",
    profileLink: "https://static.wikia.nocookie.net/undertale/images/5/50/Mettaton_battle_box.gif"
  }

  let dummy = {
    username: "dummy",
    firstName: "Dummy",
    lastName: "Dummy",
    email: "dummy@gmail.com",
    age: "25",
    contactNumber: "8036841181",
    profileLink: "https://static.wikia.nocookie.net/undertale/images/5/50/Mad_Dummy_battle.gif",
    followers: [admin],
    following: [admin]
  }

  let test = {
    username: "test",
    firstName: "Test",
    lastName: "Ing",
    email: "test@gmail.com",
    age: "27",
    contactNumber: "8036841181",
    profileLink: "https://static.wikia.nocookie.net/undertale/images/0/05/Flowey_battle_talk.gif",
    followers: [admin],
    following: [admin]
  }

  admin.followers = [dummy, test]
  admin.following = [dummy, test]
  if (params.username === "admin")
    return admin

  if (params.username === "dummy")
    return dummy

  if (params.username === "test")
    return test


  throw new Response("", {
    status: 404,
    statusText: "User Not Found"
  })

}


function EditableField({fieldName, value, bindings, setValue, inputData, submitCallback, validator, validate}) {
  const [submitting, setSubmitting] = useState(false);

  const {error, helperText} = validator(inputData)

  return (
    <div className="info-field">
      <Text h3 className="field-name">
        {fieldName}
      </Text>
      <div className="profile-input-field">
        <Input css={{maxWidth: 200}} helperText={validate ? helperText : ""}
               helperColor={validate ? (error ? "error" : "success") : "default"}
               color={validate ? (error ? "error" : "success") : "default"} aria-label={fieldName} underlined
               className="field-value" {...bindings} />
        {submitting ?
          <Loading css={{marginLeft: 10}}/>
          :
          <>
            <Button
              css={{marginLeft: 10, width: 30, height: 30}}
              disabled={error}
              onPress={() => {
                setSubmitting(true)
                setTimeout(() => {
                  // TODO make request to change data
                  // submit inputData
                  submitCallback()
                  setSubmitting(false)
                }, 1000)
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
    <div className="info-field">
      <Text h3 className="field-name">
        {fieldName}
      </Text>
      <Text h3 className="field-value field-value-viewing">
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

  return (<>
      <DataField
        fieldName="First Name" value={user.firstName} inputData={data.firstName} setValue={setData.firstName}
        bindings={bindings.firstName}
        submitCallback={revalidator.revalidate}
        validator={firstNameValidator}
        validate={validate.firstName}
      />
      <DataField
        fieldName="Last Name" value={user.lastName} inputData={data.lastName} setValue={setData.lastName}
        bindings={bindings.lastName}
        submitCallback={revalidator.revalidate}
        validator={lastNameValidator}
        validate={validate.lastName}
      />
      <DataField
        fieldName="Email" value={user.email} inputData={data.email} setValue={setData.email}
        bindings={bindings.email}
        submitCallback={revalidator.revalidate}
        validator={emailValidator}
        validate={validate.email}
      />
      <DataField
        fieldName="Age" value={user.age} inputData={data.age} setValue={setData.age}
        bindings={{...bindings.age, type: "number"}}
        submitCallback={revalidator.revalidate}
        validator={ageValidator}
        validate={validate.age}
      />
      <DataField
        fieldName="Contact Number" inputData={data.contactNumber} value={user.contactNumber}
        setValue={setData.contactNumber} bindings={bindings.contactNumber}
        submitCallback={revalidator.revalidate}
        validator={contactNumberValidator}
        validate={validate.contactNumber}
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

function UserListModal({title, bindings, users, cancel = false}) {
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
      <Modal.Body className="modal-body-container">
        {users.map((user) => (

          <Card key={user.username} className="user-card" variant="bordered">
            <Card.Body className="user-card-body">
              <div className="modal-user-info-wrapper">
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
                <div className="modal-cancel-btn-wrapper">
                  <Button
                    auto
                    icon={<CancelIcon size={20} fill="currentColor"/>}
                    color="error"
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  /></div> : null
              }

            </Card.Body>
          </Card>

        ))}
      </Modal.Body>
    </Modal>
  );
}

function nFormatter(num, digits) {
  const lookup = [
    {value: 1, symbol: ""},
    {value: 1e3, symbol: "k"},
    {value: 1e6, symbol: "M"},
    {value: 1e9, symbol: "G"},
    {value: 1e12, symbol: "T"},
    {value: 1e15, symbol: "P"},
    {value: 1e18, symbol: "E"}
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function (item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

function UserProfile({user}) {
  const {username} = useContext(JWTContext);
  const isUser = username === user.username;
  const {setVisible: setFollowersVisible, bindings: followerBindings} = useModal();
  const {setVisible: setFollowingVisible, bindings: followingBindings} = useModal();

  let followed = false;
  for (const follower of user.followers) {
    if (follower.username === username)
      followed = true
  }

  return (<>
  <UserListModal cancel={isUser} users={user.followers} title={`Followers of u/${user.username}`}
                 bindings={followerBindings}/>
  <UserListModal cancel={isUser} users={user.following} title={`Users Following u/${user.username}`}
                 bindings={followingBindings}/>
  <Card className="user-profile">
    <Card.Header className="user-profile-header">
      <div className="avatar-username">
        <Avatar zoomed pointer bordered color="gradient" src={user.profileLink} css={{width: 200, height: 200}}/>
        <div>
          <Text h1 className="username-user-page" css={{
            textGradient: "90deg, $secondary 0%, $primary 100%",
          }}>{`u/${user.username}`}</Text>
          <div className="user-count-bar">
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
      <Button color="success" auto css={{width: "50%", margin: "auto", marginBottom: "1rem"}} disabled={followed} auto>
        {followed?
          "Following": "Follow"}
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