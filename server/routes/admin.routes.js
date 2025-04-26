import express from "express";
import {
  adminLogin,
  adminSginup,
  deleteDonor,
} from "../controller/admin.controller.js";

const router = express.Router();

router.post("/admin/signup", adminSginup);
router.post("/admin/login", adminLogin);
router.delete("/admin/delete/:donorId", deleteDonor);
export default router;
