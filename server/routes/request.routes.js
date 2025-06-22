import express from "express";
import {
  createAidRequest,
  getMyAidRequests,
  getAllAidRequests,
  updateRequestStatus,
  getEngagedRequests,
} from "../controller/request.controller.js";
import { protect, isSeeker, isDonor } from "../middleware/auth.middleware.js";

const router = express.Router();

// @route   GET /api/requests
// @desc    Get all pending aid requests
// @access  Public
router.get("/", getAllAidRequests);

// @route   PATCH /api/requests/:id/status
// @desc    Update the status of an aid request
// @access  Protected (for now, any authenticated user)
router.patch("/:id/status", protect, updateRequestStatus);

router.post("/", protect, isSeeker, createAidRequest);
router.get("/my-requests", protect, getMyAidRequests);

// @route   GET /api/requests/engaged
// @desc    Get requests a donor has engaged with
// @access  Protected/Donor
router.get("/engaged", protect, isDonor, getEngagedRequests);

export default router; 