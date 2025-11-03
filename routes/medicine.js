const expresss = require("express");
const router = expresss.Router();

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

module.exports = router;
