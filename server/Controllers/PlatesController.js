const Plate = require("../Models/PlateModel");
const ObjectId = require("mongoose");

// CreatePlates, ReadPlates, UpdatePlates, DeletePlates

const isIterable = object =>
  object != null && typeof object[Symbol.iterator] === 'function';

module.exports.GetPlatesAndUsername = async (req, res) => {
  await req.user.populate("plates");
  return res.json({ plates: req.user.plates, username: req.user.username });
};

module.exports.CreatePlates = async (req, res) => {
  const output = [];
  if (!isIterable(req.body.plates)) {
    return res.json({message:"Missing or invalid object `plates`"});
  }

  for (let requestedPlate of req.body.plates) {
    let { plateName, nRow, nCol, wells } = requestedPlate;

    // validate input
    if (typeof plateName != "string" || plateName.length < 1 || plateName.length > 20) {
      output.push({
        isCreated: false,
        reason: "Plate name must be a string between 1 to 20 characters."
      });
      continue;
    }
    if (typeof nRow != "number" || !Number.isInteger(nRow) || nRow < 1 || nRow > 16) {
      output.push({
        isCreated: false,
        reason: "Number of rows must be an integer between 1 and 24, inclusive."
      });
      continue;
    }
    if (typeof nCol != "number" || !Number.isInteger(nCol) || nCol < 1 || nCol > 24) {
      output.push({
        isCreated: false,
        reason: "Number of columns must be an integer between 1 and 16, inclusive."
      });
      continue;
    }
    if (wells) {
      if (!Array.isArray(wells) || nCol * nRow != wells.length) {
        output.push({
          isCreated: false,
          reason: "`wells` must be either undefined or an array of length equaling `nCol * nRow`."
        });
        continue;
      }
      let currCol = 1;
      let currRow = 1;
      let failureReason = null;
      for (let well of wells) {
        let { reagent, antibody, concentration } = well;
        if (typeof reagent != "string" || (reagent.length > 0 && !reagent.match(/^R\d+$/))) {
          failureReason = `reagent "${reagent}" is invalid! It must be either an emtpy string or one that starts with "R" and followed by numbers.`;
          break;
        }
        if (typeof antibody != "string") {
          failureReason = `antibody "${antibody}" is invalid! It must be a string.`;
          break;
        }
        if (typeof concentration != "number" || concentration < 0) {
          failureReason = `concentration "${concentration}" is invalid! It must be a nonnegative (floating point) number.`;
          break;
        }
        if (concentration != 0 && !antibody) {
          failureReason = `concentration "${concentration}" is invalid! It must be 0 without an antibody.`;
          break;
        }
        if (currCol === nCol) {
          currCol = 1;
          currRow += 1;
        } else {
          currCol += 1;
        }
      }
      if (failureReason) {
        output.push({
          isCreated: false,
          nRow: currRow,
          nCol: currCol,
          reason: failureReason
        });
        continue;
      }
    } else {
      wells = [];
      for (let i = 0; i < nCol * nRow; i++) {
        wells.push({
          reagent: "",
          antibody: "",
          concentration: 0.0,
        });
      }
    }

    // inpute validated; now create the new Plate and save its reference in user
    let newPlate;
    try {
      newPlate = await Plate.create({ 
        plateName,
        nRow,
        nCol,
        wells,
      });
      req.user.plates.push(newPlate._id);
      await req.user.save();
    } catch (err) {
      if (newPlate) {
        await Plate.findByIdAndDelete(newPlate._id);
      }
      output.push({
        isCreated: false,
        reason: err.toString(),
      });
      continue;
    }
    
    // for convenience and good practice, return the entire new plate rather than just the _id
    output.push({
      isCreated: true,
      newPlate
    })
  }
  
  return res.json({ output });
};

module.exports.ReadPlates = async (req, res) => {
  if (!isIterable(req.body.IDs)) {
    return res.json({message:"Missing or invalid object `IDs`"});
  }

  const output = [];
  for (let _id of req.body.IDs) {
    if (typeof _id != "string" || !ObjectId.isValidObjectId(_id)) {
      output.push({
        _id,
        reason: "Invalid _id."
      });
      continue;
    }

    let index = req.user.plates.indexOf(_id);
    if (index === -1) {
      output.push({
        _id,
        reason: "You do not own the specified plate."
      });
      continue;
    }

    // then, try to find the plate
    let plate = await Plate.findById(_id);

    if (!plate) {
      // this might happen when the plate is deleted but the ownership wasn't updated correctly
      output.push({
        _id,
        reason: "You own the specified plate but somehow we could not find the plate' data. Removed the plate from your ownership."
      });
      req.user.plates.splice(index, 1);
      try { await req.user.save(); } catch (err) { console.log(err); }
      continue;
    }

    output.push(plate);
  }

  return res.json({ output });
};

module.exports.UpdatePlates = async (req, res) => {
  const failures = [];

  if (!isIterable(req.body.plates)) {
    return res.json({message:"Missing or invalid object `plates`"});
  }

  for (let requestedPlate of req.body.plates) {
    let { _id, plateName, wells } = requestedPlate;

    if (typeof _id != "string" || !ObjectId.isValidObjectId(_id)) {
      failures.push({
        _id,
        reason: "Invalid _id."
      });
      continue;
    }

    let index = req.user.plates.indexOf(_id);
    if (index === -1) {
      failures.push({
        _id,
        reason: "You do not own the specified plate."
      });
      continue;
    }

    // then, try to find the plate
    let plate = await Plate.findById(_id);

    if (!plate) {
      // this might happen when the plate is deleted but the ownership wasn't updated correctly
      failures.push({
        _id,
        reason: "You own the specified plate but somehow we could not find the plate' data. Removed the plate from your ownership."
      });
      req.user.plates.splice(index, 1);
      try { await req.user.save(); } catch (err) { console.log(err); }
      continue;
    }

    // update plateName if valid
    if (plateName) {
      if (typeof plateName != "string" || plateName.length > 20) {
        failures.push({
          _id,
          reason: "Plate name must be a string of no more than 20 characters."
        });
        continue;
      }
      plate.plateName = plateName;
    }

    // update the wells if valid
    if (wells) {
      if (!Array.isArray(wells) || plate.nCol * plate.nRow != wells.length) {
        failures.push({
          _id,
          reason: "`wells` must be either undefined or an array of length equaling `nCol * nRow`."
        });
        continue;
      }
      
      let currCol = 1;
      let currRow = 1;
      let failureReason = null;
      for (let well of wells) {
        let { reagent, antibody, concentration } = well;
        if (typeof reagent != "string" || (reagent.length > 0 && !reagent.match(/^R\d+$/))) {
          failureReason = `reagent "${reagent}" is invalid! It must be either an emtpy string or one that starts with "R" and followed by numbers.`;
          break;
        }
        if (typeof antibody != "string") {
          failureReason = `antibody "${antibody}" is invalid! It must be a string.`;
          break;
        }
        if (typeof concentration != "number" || concentration < 0) {
          failureReason = `concentration "${concentration}" is invalid! It must be a nonnegative (floating point) number.`;
          break;
        }
        if (concentration != 0 && !antibody) {
          failureReason = `concentration "${concentration}" is invalid! It must be 0 without an antibody.`;
          break;
        }
        if (currCol === plate.nCol) {
          currCol = 1;
          currRow += 1;
        } else {
          currCol += 1;
        }
      }
      if (failureReason) {
        failures.push({
          _id,
          nRow: currRow,
          nCol: currCol,
          reason: failureReason
        });
        continue;
      }
      plate.wells = wells
    }

    // actually save the update
    try {
      plate.save();
    } catch (err) {
      failures.push({
        _id,
        reason: err.toString(),
      });
    }
  }
  
  return res.json({ failures });
};

module.exports.DeletePlates = async (req, res) => {
  const failures = [];

  if (!isIterable(req.body.IDs)) {
    return res.json({message:"Missing or invalid object `IDs`"});
  }

  for (let _id of req.body.IDs) {
    if (typeof _id != "string" || !ObjectId.isValidObjectId(_id)) {
      failures.push({
        _id,
        reason: "Invalid _id."
      });
      continue;
    }

    let index = req.user.plates.indexOf(_id);
    if (index === -1) {
      failures.push({
        _id,
        reason: "You do not own the specified plate."
      });
      continue;
    }

    // then, find and delete the plate if possible
    // for absolute safety, remove the ownership reference after successful plate deletion
    try {
      await Plate.findByIdAndDelete(_id);
      req.user.plates.splice(index, 1);
      await req.user.save();
    } catch (err) {
      failures.push({
        _id,
        reason: err.toString()
      });
      continue;
    }
  }
  
  return res.json({ failures });
};
