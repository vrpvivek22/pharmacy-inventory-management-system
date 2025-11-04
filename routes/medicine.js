const express = require("express");
const router = express.Router();

const {
  getAllMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicine");
const getPublicMedicines = require("../controllers/medicine-public");

router.route("/").get(getAllMedicines).post(addMedicine);
router
  .route("/:id")
  .get(getMedicine)
  .delete(deleteMedicine)
  .patch(updateMedicine);

// Public route (accessible without authentication)
router.get("/", getPublicMedicines);

module.exports = router;
