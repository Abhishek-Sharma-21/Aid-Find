import donorFindModel from "../models/donor-find.model.js";
export const donorRegister = async (req, res) => {
  const { name, contactNumber, location, donorType, details } = req.body;

  // Basic validation
  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Name must be at least 2 characters long." });
  }

  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!contactNumber || !phoneRegex.test(contactNumber)) {
    return res.status(400).json({ error: "Invalid contact number format." });
  }

  if (!location || location.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Location must be at least 3 characters long." });
  }

  if (!donorType) {
    return res.status(400).json({ error: "Donor type is required." });
  }

  try {
    const newDonor = new donorFindModel({
      name,
      contactNumber,
      location,
      donorType,
      details,
    });

    await newDonor.save();

    res.status(201).json({ message: "Donor registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while registering donor." });
  }
};

export const getAllDonors = async (req, res) => {
  try {
    const donors = await donorFindModel.find().sort({ createdAt: -1 });
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donors." });
  }
};
