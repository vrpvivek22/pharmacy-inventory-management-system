const Medicine = require("../models/medicine");

const getPublicMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({}).sort("-createdAt");
    res.status(200).json({ medicines, nbHits: medicines.length });
  } catch (error) {
    next(error);
  }
};
module.exports = getPublicMedicines;
