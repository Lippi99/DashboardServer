import joi from "@hapi/joi";

interface SignUp {
  name: string;
  email: string;
  password: string;
}

interface SignIn {
  email: string;
  password: string;
}

export const signUpValidate = (data: SignUp) => {
  const schema = joi.object<SignUp>({
    name: joi.string().required().min(3).max(30),
    email: joi.string().required().min(10).max(50),
    password: joi.string().required().min(6).max(50),
  });

  return schema.validate(data);
}

export const signInValidate = (data: SignIn) => {
  const schema = joi.object<SignIn>({
    email: joi.string().required().min(10).max(50),
    password: joi.string().required().min(6).max(50),
  });

  return schema.validate(data);
}