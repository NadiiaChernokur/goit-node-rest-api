const RegisterHttpError = (error) => {
  if (error.message.includes("pattern")) {
    const error = new Error("Invalid email");
    error.status = 400;
    return error;
  }

  if (error.message.includes("length")) {
    const error = new Error("The password must contain at least 6 characters");
    error.status = 400;
    return error;
  }
};

export default RegisterHttpError;
