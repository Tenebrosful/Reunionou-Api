import * as express from "express";
import { UserAccount } from "../../../../databases/authentification/models/UserAccount";
import error405 from "../errors/error405";
import handleDataValidation from "../middleware/handleDataValidation";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import error401 from "../errors/error401";
import AuthSchema from "../validateSchema/AuthSchema";
import error404 from "../errors/error404";

const authRouter = express.Router();

authRouter.post("/", async (req, res, next) => {

    const userFields = {
        login: req.body.login,
        password: req.body.password,
    };

    if (!handleDataValidation(AuthSchema, userFields, req, res, true)) return;

    try {
        const userAccount = await UserAccount.findOne(
            {
                attributes: ["id", "login", "password", "isAdmin"],
                where: { login: req.body.login }

            });

        if (!userAccount) {

            error401(req, res, "Combinaison identifiant mot de passe invalide");
            return;
        }

        bcrypt.compare(userFields.password, userAccount.password, function (err, result) {
            if (result) {
                userAccount.update({last_connexion: Date.now()});
                const token = jwt.sign(
                    {
                        id: userAccount.id,
                        isAdmin: userAccount.isAdmin,
                        last_connexion: userAccount.last_connexion,
                    },
                    process.env.SECRETPASSWDTOKEN || "", { expiresIn: "2h" });
                res.status(200).json({ token });
            } else {
                error401(req, res, "Combinaison identifiant mot de passe invalide");
                return;
            }
        });

    } catch (error) {
        next(error);
    }

});

authRouter.all("/", error405(["POST"]));

authRouter.post("/tokenverify", async (req, res, next) => {

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
                attributes: [ "id" ],
                // @ts-ignore
                where: { id: tokenData.id }

            });

        if (!user) {

            error404(req, res, "Token invalide");
            return;
        }

        res.status(200).send();

    } catch (error) {
        next(error);
    }

});

authRouter.all("/tokenverify", error405(["POST"]));

export default authRouter;