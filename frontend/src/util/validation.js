
export const requiredValidator = (value, fieldName) => {
  let valueError = {error: false, helperText: ""}
  if (value.length === 0) valueError = {error: true, helperText: `${fieldName} is required`}
  return valueError
}

export const emailValidator = (value) => {
  let emailError = {error: false, helperText: ""}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) emailError = {error: true, helperText: "Invalid Email"}
  if (value.length === 0) emailError = {error: true, helperText: "Email is required"}

  return emailError
}

export const usernameValidator = (value) => {
  let usernameError = {error: false, helperText: ""}
  if (value.length === 0) usernameError = {error: true, helperText: "Username is required"}

  return usernameError
}

export const firstNameValidator = (value) => {
  let firstNameError = {error: false, helperText: ""}
  if (value.length === 0) firstNameError = {error: true, helperText: "First Name is required"}

  return firstNameError
}

export const lastNameValidator = (value) => {
  let lastNameError = {error: false, helperText: ""}
  if (value.length === 0) lastNameError = {error: true, helperText: "Last Name is required"}

  return lastNameError
}

export const ageValidator = (value) => {
  let ageError = {error: false, helperText: ""}
  if (+value <= 12) ageError = {error: true, helperText: "You must be older than 12"}
  if (value.length === 0) ageError = {error: true, helperText: "Age is required"}

  return ageError
}

export const contactNumberValidator = (value) => {
  let contactNumberError = {error: false, helperText: ""}

  const contactNumberRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  if (!contactNumberRegex.test(value)) contactNumberError = {
    error: true,
    helperText: "Invalid Contact Number "
  }
  if (value.length === 0) contactNumberError = {error: true, helperText: "Contact Number is required "}

  return contactNumberError
}

export const passwordValidator = (value) => {
  let passwordError = {error: false, helperText: ""}
  if (value.length < 8) passwordError = {error: true, helperText: "Password must contain atleast 8 characters"}

  return passwordError
}

export const confirmPasswordValidator = (value, confirmValue) => {
  let confirmPasswordError = {error: false, helperText: ""}
  const passwordError = passwordValidator(value)
  if (passwordError.error) confirmPasswordError = {error: true, helperText: ""}
  if (confirmValue !== value) confirmPasswordError = {error: true, helperText: "Passwords do not match"}
  if (confirmValue.length === 0) confirmPasswordError = {
    error: true,
    helperText: "Password Confirmation is required"
  }

  return confirmPasswordError
}

export const oneWordValidator = (value, fieldName) => {
  let valueError = {error: false, helperText: ""}
  const oneWordRegex = /^\S+$/;
  if (!oneWordRegex.test(value)) valueError = {error: true, helperText : `${fieldName} must contain one word`}
  if (value.length === 0) valueError = {error: true, helperText: `${fieldName} is required`}
  return valueError
}


export const oneWordLowerCaseValidator = (value, fieldName) => {
  let valueError = {error: false, helperText: ""}
  const oneWordRegex = /^[^A-Z\s]+$/;
  if (!oneWordRegex.test(value)) valueError = {error: true, helperText : `${fieldName} must contain one word and no Uppercase characters.`}
  if (value.length === 0) valueError = {error: true, helperText: `${fieldName} is required`}
  return valueError
}
