import AidRequest from "../models/aid-request.model.js";

export const createAidRequest = async (req, res) => {
  try {
    const { aidType, details, location, hospitalName, patientName, doctorName } = req.body;
    
    if (!aidType || !details || !location || !hospitalName || !patientName || !doctorName) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newRequest = new AidRequest({
      requestedBy: req.user.id,
      aidType,
      details,
      location,
      hospitalName,
      patientName,
      doctorName,
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
      .sort({ createdAt: -1 })
      .lean();
    res.json(requests);
  } catch (error) {
    console.error("GET MY AID REQUESTS ERROR:", error);
    res.status(500).json({ error: "Server error while fetching requests." });
  }
};

export const getAllAidRequests = async (req, res) => {
  try {
    const requests = await AidRequest.find({ status: "Pending", flags: { $lt: 3 } })
      .populate("requestedBy", "name") // Get the name of the user who made the request
      .sort({ createdAt: -1 })
      .lean();
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
      .sort({ createdAt: -1 })
      .lean();
    res.json(requests);
  } catch (error) {
    console.error("GET ENGAGED REQUESTS ERROR:", error);
    res.status(500).json({ error: "Server error while fetching engaged requests." });
  }
};

export const reportRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const request = await AidRequest.findById(id);

    if (!request) {
      return res.status(404).json({ error: "Aid request not found." });
    }

    // Check if user has already reported this request
    if (request.reportedBy.includes(userId)) {
      return res.status(400).json({ error: "You have already reported this request." });
    }

    request.reportedBy.push(userId);
    request.flags += 1;

    // Automatically hide if threshold reached
    if (request.flags >= 3 && request.status === "Pending") {
      request.status = "Flagged"; // Could also be "Cancelled" depending on business logic
    }

    await request.save();

    res.json({ message: "Request reported successfully." });
  } catch (error) {
    console.error("REPORT REQUEST ERROR:", error);
    res.status(500).json({ error: "Server error while reporting request." });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const request = await AidRequest.findById(id);

    if (!request) {
      return res.status(404).json({ error: "Aid request not found." });
    }

    // Checking permissions:
    // A Seeker can delete their own request.
    // A Donor can cancel their engagement (which might just mean removing their ID and setting to Pending, or if requested deleting the whole thing, but deleting an entire request should probably just be the seeker or admin. If you meant the Donor can back out of an "In Progress" request).
    // Let's assume the prompt "user can delete their request and donar also can delete their request" means backing out of a request if they are a donor, or deleting it entirely if seeker.
    // Let's implement full deletion if Seeker/Admin, and "cancel engagement" if Donor.
    
    if (userRole === "Seeker" && request.requestedBy.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own requests." });
    }

    if (userRole === "Donor") {
        if (request.donatedBy?.toString() === userId) {
            // Donor backing out
            request.donatedBy = null;
            request.status = "Pending";
            await request.save();
            return res.json({ message: "You have cancelled your help offer. Request is back to pending." });
        } else {
             return res.status(403).json({ error: "You cannot delete this request." });
        }
    }

    // If Seeker (or Admin in future)
    await AidRequest.findByIdAndDelete(id);
    res.json({ message: "Request deleted successfully." });

  } catch (error) {
    console.error("DELETE REQUEST ERROR:", error);
    res.status(500).json({ error: "Server error while deleting request." });
  }
};