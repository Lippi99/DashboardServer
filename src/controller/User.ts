import { Response, Request, NextFunction } from "express";
import { UserModel } from "../model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signInValidate, signUpValidate } from "./Validate";

interface SignUp {
  email: string;
  name: string;
  password: string;
  birth: string;
  gender: string;
}

interface SignIn {
  email: string;
  password: string;
  name?: string;
}

export class User {
  async signUp(req: Request, res: Response) {
    // const { error } = signUpValidate(req.body);
    // if (error) return res.status(400).send(error.message);

    const salt = bcrypt.genSaltSync(14);

    let client: SignUp;
    client = {
      email: req.body.email,
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, salt),
      birth: req.body.birth,
      gender: req.body.gender,
    };

    try {
      const user = new UserModel(client);
      const userExists = await UserModel.findOne({ email: client.email });
      if (userExists) {
        return res.status(400).json({ conflict: "E-mail já registrado" });
      }
      await user.save();
      return res.status(200).json({ success: "Usuário criado com sucesso" });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  }

  async signIn(req: Request, res: Response) {
    const { error } = signInValidate(req.body);
    if (error) return res.status(400).send(error.message);

    let client: SignIn;
    client = {
      email: req.body.email,
      password: req.body.password,
    };

    try {
      const accountExists = await UserModel.findOne({
        email: client.email,
      });

      if (!accountExists) {
        return res.status(404).json({ error: "User or password invalid" });
      }

      const passwordUserMatch = bcrypt.compareSync(
        client.password,
        accountExists.password
      );
      if (!passwordUserMatch) {
        return res.status(404).json({ error: "User or password invalid" });
      }

      

      const token = jwt.sign(
        {
          id: accountExists._id,
          admin: accountExists.admin,
          name: accountExists.name,
          email: accountExists.email,
          gender: accountExists.gender,
          bith: accountExists.birth,
        },
        `${process.env.TOKEN_SECRET}`,
        {expiresIn: 86400}
      );

      const authData = {
        id: accountExists._id,
        email: accountExists.email,
        name: accountExists.name,
        bith: accountExists.birth,
        gender: accountExists.gender,
        admin: accountExists.admin,
      };


      const { name, admin, bith, email, gender, id } = authData;
      res.header("authorization", token);

      return res
        .status(200)
        .json({ name, admin, bith, email, gender, id, token });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  }

  async personalProfile(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (token) {
      return jwt.verify(
        token,
        `${process.env.TOKEN_SECRET}`,
        async (err, decodedToken) => {
          if (err) {
            next();
          } else {
            res.status(200).send(decodedToken);
          }
        },      
      );
    } else {
      res.status(404).send("erro");
    }
  }
}
