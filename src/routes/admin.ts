import express from "express";
import { tokenValidation } from "../controller/Auth";
const router = express.Router();


router.get("/", tokenValidation, (req, res) => {

  const admin = req.user.admin;

  if (admin) {
    res.status(200).send("Rota só para admin");
  } else {
    res.status(401).json({ error: 'Not admin: Acesso negado' });
  }
});

router.get("/free", tokenValidation, (req, res) => {
  return res.send("Rota vista para quem está logado");
})

export default router;