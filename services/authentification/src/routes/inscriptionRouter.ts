import * as express from "express";
import { UserAccount } from "../../../../databases/authentification/models/UserAccount";
import axios from "axios";
import handleDataValidation from "../middleware/handleDataValidation";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import InscriptionSchema from "../validateSchema/InscriptionSchema";

const inscriptionRouter = express.Router();

inscriptionRouter.post("/", async (req, res, next) => {

  const userFields = {
    default_mail: req.body.default_mail,
    login: req.body.login,
    password: req.body.password,
    username: req.body.username,
  };

  if (!handleDataValidation(InscriptionSchema, userFields, req, res, true)) return;

  const validateFieldsAuth = {
    login: userFields.login,
    password: await bcrypt.hash(userFields.password, 10),
  };

  const validateFieldsProfile = {
    default_event_mail: userFields.default_mail,
    username: userFields.username,
  };

  try {
    const user = await UserAccount.create({ ...validateFieldsAuth });

    try {
      // @ts-ignore
      validateFieldsAuth.id = user.id;
      await axios.post(process.env.API_MAIN_URL + "/user", validateFieldsProfile);

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