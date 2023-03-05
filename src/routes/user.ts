import express from "express";
import { tokenValidation } from "../controller/Auth";
import { User } from "../controller/User";
import { Dashboard } from "../controller/Dashboard";

const router = express.Router();

let user = new User();
let dashboard = new Dashboard();

router.post("/register", user.signUp);
router.post("/login", user.signIn);
router.get("/me", tokenValidation, user.personalProfile);
router.get("/users", dashboard.filter);
router.get("/gender", dashboard.gender);

export default router;
