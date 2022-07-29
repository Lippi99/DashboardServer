import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const tokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({error: 'Access Denied'});
  } 
  try {
    const userVerified = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
    req.user = userVerified;
    next();
  } catch (error) {
    res.status(401).json({error: 'Access Denied'});
  }
}