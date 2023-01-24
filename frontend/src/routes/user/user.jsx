import {useLoaderData, useRevalidator} from "react-router-dom";
import './user.css'
import {Card, Avatar, Text, Badge, Button, Input, Loading} from "@nextui-org/react";
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

export async function loader({params}) {
  if (params.username === "admin")
    return {
      username: "admin",
      firstName: "Ayan",
      lastName: "Datta",
      email: "advin4603@gmail.com",
      age: "20",
      contactNumber: "7036841181",
      profileLink: "https://static.wikia.nocookie.net/undertale/images/5/50/Mettaton_battle_box.gif"
    }

  if (params.username === "dummy")
    return {
      username: "dummy",
      firstName: "Dummy",
      lastName: "Dummy",
      email: "dummy@gmail.com",
      age: "25",
      contactNumber: "8036841181",
      profileLink: "https://static.wikia.nocookie.net/undertale/images/5/50/Mad_Dummy_battle.gif"
    }


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
      <div className="field-name">
        {fieldName}
      </div>
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
              css={{marginLeft: 10}}
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
              icon={<EditIcon fill="currentColor" filled/>}
            />
            <Button
              css={{marginLeft: 10}}
              onPress={() => {
                setValue(value)
              }}
              auto
              icon={<CancelIcon fill="currentColor"/>}
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
      <div className="field-name">
        {fieldName}
      </div>
      <div className="field-value">
        {value}
      </div>
    </div>
  )
    ;
}


function Fields({user}) {
  const revalidator = useRevalidator();
  const {username} = useContext(JWTContext);
  const isUser = username === user.username;
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


export default function User() {
  const user = useLoaderData();
  // Note that useLoaderData should not be directly put in state. Use a child component and set a key.

  return (
    <Card className="user-profile">
      <Card.Header className="user-profile-header">
        <div className="avatar-username">
          <Avatar zoomed pointer bordered color="gradient" src={user.profileLink} css={{width: 200, height: 200}}/>
          <div>
            <Text h1 className="username-user-page" css={{
              textGradient: "45deg, $blue600 -20%, $pink600 50%",
            }}>{`u/${user.username}`}</Text>
            <div className="user-count-bar">
              <Badge color="primary" enableShadow disableOutline>Followers: 1.200k</Badge>
              <Badge color="secondary" enableShadow disableOutline>Following: 200</Badge>
            </div>

          </div>

        </div>
      </Card.Header>
      <Card.Body>
        <Fields user={user} key={user.username}/>
      </Card.Body>
    </Card>
  )
    ;
}