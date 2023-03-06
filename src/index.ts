import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import userRouter from "./routes/user";
import cors from "cors";

const app = express();
dotenv.config();

const runMongo = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI as string);
    console.log("Conectado ao Mongo");
  } catch (error: unknown) {
    console.log("error", error);
  }
};
runMongo();

app.use(cors());
app.use("/user/api", express.json(), userRouter);

app.listen(`${process.env.PORT}`);
