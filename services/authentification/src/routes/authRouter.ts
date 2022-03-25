import * as express from "express";
import { UserAccount } from "../../../../databases/authentification/models/User";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import error501 from "../errors/error501";
import handleDataValidation from "../middleware/handleDataValidation";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt"
import ConnectionSchema from "../validateSchema/ConnectionSchema";

const authRouter = express.Router();

authRouter.post("/auth", async (req, res, next) => {

    const userFields = {
        login: req.body.login,
        password: req.body.password,
    };

    if (!handleDataValidation(ConnectionSchema, userFields, req, res, true)) return;

    try {
        const userAccount = await UserAccount.findOne(
            {
                attributes: ["id", "login", "password", "isAdmin"],
                where: { login: req.body.login }

            });

        if (!userAccount) {

            res.status(404).json({
                code: 404,
                message: `Aucun utilisateur pour l'identifiant ${userFields.login}`
            });
            return;
        }

        bcrypt.compare(userFields.password, userAccount.password, function (err, result) {
            if (result) {
                const token = jwt.sign(
                    {
                        id: userAccount.id,
                        mail: userAccount.isAdmin,
                    },
                    process.env.SECRETPASSWDTOKEN || "", { expiresIn: "2h" });
                res.status(200).json({ token });
            } else {
                res.status(403).json({
                    code: 403,
                    message: `Le mot de passe est incorrect`
                });
                return;
            }
        });

    } catch (error) {
        next(error);
    }

});

authRouter.post("/tokenVerify", async (req, res, next) => {

    let tokenData;
  
    jwt.verify(req.headers["authorization"] as string, process.env.SECRETPASSWDTOKEN || "", (err: any, decode: any) => {
      if (err) 
        res.status(403).json({
          code: 403,
          message: err.message
        });
  
       else tokenData = decode;
    });
  
    if (!tokenData) return;
  
    try {
      const user = await UserAccount.findOne(
        {
          attributes: [],
          // @ts-ignore
          where: { id: tokenData.id }
  
        });
  
      if (!user) {
  
        res.status(404).json({
          code: 404,
          // @ts-ignore
          message: `Utilisateur non trouvé`
        });
        return;
      }
  
      res.status(200).send();
  
    } catch (error) {
      next(error);
    }
  
  });

export default authRouter;