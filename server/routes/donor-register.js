import express from "express";
import { donorRegister, getAllDonors } from "../controller/donor.js";

const router = express.Router();

router.post("/donor/register", donorRegister);
router.get("/donor/all", getAllDonors);

export default router;
