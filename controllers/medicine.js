const Medicine = require("../models/medicine");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const {
  addMedicineSchema,
  updateMedicineSchema,
} = require("../validation/medicine-validation");

const getAllMedicines = async (req, res, next) => {
  try {
    const { category, status, name, sort, fields } = req.query;

    const queryObject = { createdBy: req.user.userId };

    if (category) queryObject.category = category;
    if (status) queryObject.status = status;
    if (name) queryObject.name = { $regex: name, $options: "i" };

    let result = Medicine.find(queryObject);

    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("-createdAt");
    }

    if (fields) {
      const fieldsList = fields.split(",").join(" ");
      result = result.select(fieldsList);
    }

    const medicines = await result;
    res.status(StatusCodes.OK).json({ medicines, nbHits: medicines.length });
  } catch (error) {
    next(error);
  }
};

const getMedicine = async (req, res) => {
  const {
    user: { userId },
    params: { id: medicineId },
  } = req;

  const medicine = await Medicine.findOne({
    _id: medicineId,
    createdBy: userId,
  });

  if (!medicine) {
    throw new NotFoundError(`No medicine found with id : ${medicineId}`);
  }

  res.status(StatusCodes.OK).json({ medicine });
};

const addMedicine = async (req, res) => {
  const { error } = addMedicineSchema.validate(req.body);

  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  req.body.createdBy = req.user.userId;

  const medicine = await Medicine.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "medicine added successfully", medicine });
};

const updateMedicine = async (req, res) => {
  const {
    user: { userId },
    params: { id: medicineId },
  } = req;

  const { error } = updateMedicineSchema.validate(req.body);

  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const medicine = await Medicine.findOneAndUpdate(
    { _id: medicineId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!medicine) {
    throw new NotFoundError(`No medicine found with id : ${medicineId}`);
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "medicine updated successfully", medicine });
};

const deleteMedicine = async (req, res) => {
  const {
    user: { userId },
    params: { id: medicineId },
  } = req;

  const medicine = await Medicine.findOneAndDelete({
    _id: medicineId,
    createdBy: userId,
  });

  if (!medicine) {
    throw new NotFoundError(`No medicine found with id : ${medicineId}`);
  }

  const Medicines = await Medicine.find({ createdBy: userId }).sort(
    "-createdAt"
  );

  res.status(StatusCodes.OK).json({
    message: "medicine deleted successfully",
    Medicines,
    count: Medicines.length,
  });
};

const getPublicMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.status(200).json({ count: medicines.length, medicines });
  } catch (error) {
    res.status(500).json({ message: "Error fetching public medicines" });
  }
};

module.exports = {
  getAllMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getPublicMedicines,
};
