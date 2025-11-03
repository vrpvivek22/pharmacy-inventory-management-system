const express = require("express");
const router = express.Router();

const {
  getAllMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getPublicMedicines,
} = require("../controllers/medicine");

router.route("/").get(getAllMedicines).post(addMedicine);
router
  .route("/:id")
  .get(getMedicine)
  .delete(deleteMedicine)
  .patch(updateMedicine);

// ✅ Public route (accessible without authentication)
router.get("/public", getPublicMedicines);

module.exports = router;
