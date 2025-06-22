import AidRequest from "../models/aid-request.model.js";

export const createAidRequest = async (req, res) => {
  try {
    const { aidType, details, location } = req.body;
    
    if (!aidType || !details || !location) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newRequest = new AidRequest({
      requestedBy: req.user.id,
      aidType,
      details,
      location,
    });

    await newRequest.save();

    res.status(201).json({
      message: "Aid request created successfully.",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while creating request." });
  }
};

export const getMyAidRequests = async (req, res) => {
  try {
    const requests = await AidRequest.find({ requestedBy: req.user.id })
      .populate("donatedBy", "name email") // Populate donor's info
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("GET MY AID REQUESTS ERROR:", error);
    res.status(500).json({ error: "Server error while fetching requests." });
  }
};

export const getAllAidRequests = async (req, res) => {
  try {
    const requests = await AidRequest.find({ status: "Pending" })
      .populate("requestedBy", "name") // Get the name of the user who made the request
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("GET ALL AID REQUESTS ERROR:", error);
    res.status(500).json({ error: "Server error while fetching all requests." });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["In Progress", "Fulfilled", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status provided." });
    }

    const request = await AidRequest.findById(id);

    if (!request) {
      return res.status(404).json({ error: "Aid request not found." });
    }

    const isSeeker = req.user.role === "Seeker";
    const isDonor = req.user.role === "Donor";
    const isOwner = request.requestedBy.toString() === req.user.id;

    // --- Permission Logic ---
    if (status === "In Progress" && (!isDonor || request.status !== "Pending")) {
      return res.status(403).json({ error: "Only a Donor can accept a Pending request." });
    }

    if (status === "Fulfilled" && (!isOwner || request.status !== "In Progress")) {
      return res.status(403).json({ error: "Only the requester can mark an In Progress request as Fulfilled." });
    }
    
    if (status === "Cancelled" && !isOwner) {
      return res.status(403).json({ error: "Only the requester can cancel their request." });
    }
    // --- End Permission Logic ---
    
    request.status = status;
    if (status === "In Progress") {
      request.donatedBy = req.user.id;
    }
    await request.save();

    res.json({ message: `Request status updated to ${status}.`, request });
  } catch (error) {
    console.error("UPDATE REQUEST STATUS ERROR:", error);
    res.status(500).json({ error: "Server error while updating request status." });
  }
};

export const getEngagedRequests = async (req, res) => {
  try {
    const requests = await AidRequest.find({ donatedBy: req.user.id })
      .populate("requestedBy", "name email") // Expose name and email of the requester
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("GET ENGAGED REQUESTS ERROR:", error);
    res.status(500).json({ error: "Server error while fetching engaged requests." });
  }
}; 