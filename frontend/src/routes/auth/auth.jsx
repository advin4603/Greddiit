import './auth.css'

import {Card, Text, Input, Spacer, Button} from "@nextui-org/react";

import {useContext, useState, useRef, useEffect} from "react";
import useValidationForm from "../../hooks/validationForm.js";
import logoName from '../../assets/logoName.svg'
import {createSearchParams, useLoaderData, useNavigate} from "react-router-dom";
import {JWTContext} from "../../contexts/jwtContext.js";
import {
  ageValidator, confirmPasswordValidator,
  contactNumberValidator,
  emailValidator,
  firstNameValidator, lastNameValidator, passwordValidator, requiredValidator,
  usernameValidator
} from "../../util/validation.js";



export function loader({request}) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");
  if (mode === "signup")
    return {createNew: true}

  return {createNew: false}
}

function SignIn({setJWT, navigate}) {
  const {data, setAllValidate, validate, bindings, setData} = useValidationForm({username: "", password: ""})

  const usernameError = requiredValidator(data.username, "Username")
  const passwordError = requiredValidator(data.password, "Password")

  return (<>
    <Input
      bordered
      labelPlaceholder="Username"
      status={validate.username ? (usernameError.error ? "error" : "success") : "default"}
      helperText={validate.username ? usernameError.helperText : ""}
      helperColor="error"
      {...bindings.username}
    />
    <Spacer y={3}/>
    <Input.Password
      bordered
      clearable
      labelPlaceholder="Password"
      status={validate.password ? (passwordError.error ? "error" : "success") : "default"}
      helperText={validate.password ? passwordError.helperText : ""}
      helperColor="error"
      {...bindings.password}
    />
    <Spacer y={3}/>
    <Button disabled={usernameError.error || passwordError.error} shadow color="gradient" onPress={() => {
      setAllValidate(true)
      if (data.username === "admin" && data.password === "admin")
        setJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.Xs1l2H7ui_yqE-GlQ2GARQ5ZpjuS8B8xQaooy89Q8y8")
      navigate("/u/admin")
    }}>Sign In</Button>
  </>);
}

function SignUp({setJWT, navigate}) {
  const {data, setData, validate, setAllValidate, bindings} = useValidationForm({
    firstName: "", lastName: "", username: "", email: "", age: "", contactNumber: "", password: "", confirmPassword: ""
  })

  const firstNameError = firstNameValidator(data.firstName)
  const lastNameError = lastNameValidator(data.lastName)
  const usernameError = usernameValidator(data.username)
  const emailError = emailValidator(data.email)
  const ageError = ageValidator(data.age)
  const contactNumberError = contactNumberValidator(data.contactNumber)
  const passwordError = passwordValidator(data.password)
  const confirmPasswordError = confirmPasswordValidator(data.password, data.confirmPassword)

  const getStatus = (val, err) => val ? (err ? "error" : "success") : "default"

  return (<>
    <div id="field-row">
      <Input
        bordered
        labelPlaceholder={"First Name"}
        status={getStatus(validate.firstName, firstNameError.error)}
        helperText={validate.firstName ? firstNameError.helperText : ""}
        helperColor="error"
        {...bindings.firstName}
      />
      <Input
        bordered
        labelPlaceholder={"Last Name"}
        status={getStatus(validate.lastName, lastNameError.error)}
        helperText={validate.lastName ? lastNameError.helperText : ""}
        helperColor="error"
        {...bindings.lastName}
      />
    </div>
    <Spacer y={3}/>
    <Input
      bordered
      labelPlaceholder="Username"
      status={getStatus(validate.username, usernameError.error)}
      helperText={validate.username ? usernameError.helperText : ""}
      helperColor="error"
      {...bindings.username}
    />
    <Spacer y={3}/>
    <Input
      bordered
      labelPlaceholder="Email"
      status={getStatus(validate.email, emailError.error)}
      helperText={validate.email ? emailError.helperText : ""}
      helperColor="error"
      {...bindings.email}
    />
    <Spacer y={3}/>
    <div id="field-row">
      <Input
        bordered
        type="Number"
        labelPlaceholder="Age"
        status={getStatus(validate.age, ageError.error)}
        helperText={validate.age ? ageError.helperText : ""}
        helperColor="error"
        {...bindings.age}
      />
      <Input
        bordered
        labelPlaceholder="Contact Number"
        status={getStatus(validate.contactNumber, contactNumberError.error)}
        helperText={validate.contactNumber ? contactNumberError.helperText : ""}
        helperColor="error"
        {...bindings.contactNumber}
      />
    </div>
    <Spacer y={3}/>
    <Input.Password
      bordered
      clearable
      labelPlaceholder="Password"
      status={getStatus(validate.password, passwordError.error)}
      helperText={validate.password ? passwordError.helperText : ""}
      helperColor="error"
      {...bindings.password}
    />
    <Spacer y={3}/>
    <Input.Password
      bordered
      clearable
      labelPlaceholder="Confirm Password"
      status={getStatus(validate.confirmPassword, confirmPasswordError.error)}
      helperText={validate.confirmPassword ? confirmPasswordError.helperText : ""}
      helperColor="error"
      {...bindings.confirmPassword}
    />
    <Spacer y={3}/>
    <Button
      shadow
      color="gradient"
      disabled={firstNameError.error
        || lastNameError.error
        || usernameError.error
        || emailError.error
        || ageError.error
        || contactNumberError.error
        || passwordError.error
        || confirmPasswordError.error}
    >
      Sign Up
    </Button>
  </>);
}


export default function Auth() {
  const {createNew} = useLoaderData();
  const navigate = useNavigate();
  const {setJWT} = useContext(JWTContext);


  return (<div id="auth-form">
    <Card>
      <Card.Header id="auth-header">
        <div id="auth-logo-wrapper">
          <img id="auth-logo" src={logoName} alt="logo"/>
        </div>
      </Card.Header>
      <Card.Body id="auth-body">
        <Text h2>{createNew ? "Sign Up" : "Sign In"}</Text>
        <Spacer y={2}/>
        {createNew ? <SignUp navigate={navigate} setJWT={setJWT}/> : <SignIn navigate={navigate} setJWT={setJWT}/>}
        <Spacer/>
      </Card.Body>
      <Card.Divider/>
      <Card.Footer id="auth-footer">
        <Button
          light
          color="primary"
          auto
          onPress={() => {
            navigate({pathname: "/auth", search: `?${createSearchParams([['mode', createNew ? 'signin' : 'signup']])}`})
          }}
        >
          {createNew ? "Already have an account? Sign In!" : "Don't have an account? Sign Up!"}
        </Button>
      </Card.Footer>
    </Card>
  </div>);
}