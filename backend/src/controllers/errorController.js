const errorController = (error, request, response, next) => {
  try {
    if (error.name === "ValidationError")
      return handleValidationError(error, response)
  } catch (err) {
    console.error(err)
    return response.status(500).send("An unknown error has occurred.")
  }
  console.error(error)
  return response.status(500).send("An unknown error occurred")
}

function handleValidationError(error, response) {
  const fields = Object.values(error.errors).map(el => el.path);
  let errors = Object.values(error.errors).map(el => el.message)
  const code = 400;

  return response.status(code).send({errors, fields})
}

module.exports = errorController