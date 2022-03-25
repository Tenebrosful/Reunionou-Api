import * as express from "express";
import { UserAccount } from "../../../../databases/authentification/models/UserAccount";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import error501 from "../errors/error501";
import axios from "axios"
import handleDataValidation from "../middleware/handleDataValidation";
import UserSchema from "../validateSchema/InscriptionSchema"
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt"
import InscriptionSchema from "../validateSchema/InscriptionSchema";

const inscriptionRouter = express.Router();

inscriptionRouter.post("/", async (req, res, next) => {

  const userFields = {
    login: req.body.login,
    password: req.body.password,
    username: req.body.username,
    default_mail: req.body.default_mail,
  };

  if (!handleDataValidation(InscriptionSchema, userFields, req, res, true)) return;

  const validateFieldsAuth = {
    login: userFields.login,
    password: await bcrypt.hash(userFields.password, 10),
  };

  const validateFieldsProfile = {
    username: userFields.username,
    default_event_mail: userFields.default_mail
  }

  let user: UserAccount;

  try {
    const user = await UserAccount.create({ ...validateFieldsAuth });

    try {
      // @ts-ignore
      validateFieldsAuth.id = user.id
      const response = await axios.post(process.env.API_MAIN_URL + '/user', validateFieldsProfile)

      const token = jwt.sign(
        {
          id: user.id,
          isAdmin: user.isAdmin
        },
        process.env.SECRETPASSWDTOKEN || "", { expiresIn: "1h" });

        res.status(201).json({token});
    } catch (e) {
      user.destroy({ force: true });
      next(e);
    }
  } catch (e) { next(e); }

});

export default inscriptionRouter;