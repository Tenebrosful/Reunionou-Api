import * as express from "express";
import { Admin } from "../../database/models/Admin";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import { iadmin, iallAdmins } from "../responseInterface/adminResponse";

const adminRouter = express.Router();

adminRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows: admins } = await Admin.findAndCountAll(
      {
        attributes: ["id", "username", "createdAt", "updatedAt"]
      });

    const result: iallAdmins = {
      admins: [],
      count,
    };

    admins.forEach(admin => result.admins.push({
      createdAt: admin.createdAt,
      id: admin.id,
      updatedAt: admin.updatedAt,
      username: admin.username,
    }));

    res.status(200).json(result);
  } catch (e) { next(e); }

});

adminRouter.all("/", error405(["GET"]));

adminRouter.get("/:id", async (req, res, next) => {
  try {
    const admin = await Admin.findOne(
      {
        attributes: ["id", "username", "createdAt", "updatedAt"],
        where: {
          id: req.params.id
        }
      });

    if (!admin) { error404(req, res, `L'administrateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const result: iadmin = {
      createdAt: admin.createdAt,
      id: admin.id,
      updatedAt: admin.updatedAt,
      username: admin.username,
    };

    res.status(200).json(result);
  } catch (e) { next(e); }
});

adminRouter.all("/:id", error405(["GET"]));

export default adminRouter;