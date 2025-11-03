const express = require("express");
const router = express.Router();

const {
  getAllMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicine");

router.route("/").get(getAllMedicines).post(addMedicine);
router
  .route("/:id")
  .get(getMedicine)
  .delete(deleteMedicine)
  .patch(updateMedicine);

// ✅ Public route (accessible without authentication)
router.get("/public", async (req, res) => {
  try {
    const meds = await Medicine.find({});
    res.json(meds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines" });
  }
});

module.exports = router;
