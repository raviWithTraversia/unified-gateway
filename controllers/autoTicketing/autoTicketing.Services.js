const autoTicketingModel = require("../../models/AutoTicketing");

const addAutoTicketingConfig = async (req, res) => {
  try {
    const autoTicketingData = await autoTicketingModel.create(req.body);
    if (autoTicketingData) {
      return {
        response: "Auto Ticketing Configuration is created",
        data: autoTicketingData,
      };
    } else {
      return {
        response: "Auto Ticketing Configuration is not created",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAutoTicketingConfig = async (req, res) => {
  try {
    let userId = req.query.id;
    let autoTicketingData = await autoTicketingModel.find({ userId: userId });
    if (autoTicketingData) {
      return {
        response: "Auto Ticketing Configuration Data sucessfully Fetch",
        data: autoTicketingData,
      };
    } else {
      return {
        response: "Auto Ticketing Configuration Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const editAutoTicketingConfig = async (req, res) => {
  try {
    let id = req.query.id;

    const updateData = req.body;

    const updatedAutoTicketing = await autoTicketingModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedAutoTicketing) {
      return {
        response: "Auto Ticketing is not updated",
      };
    } else {
      return {
        response: "Auto Ticketing is updated sucessfully",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteAutoTicketingConfig = async (req, res) => {
  try {
    let id = req.query.id;
    let deleteDi = await autoTicketingModel.findByIdAndDelete(id);
    if (deleteDi) {
      return {
        response: "Auto Ticketing Configuration data deleted sucessfully",
      };
    } else {
      return {
        response: "Auto Ticketing Configuration data not deleted",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addAutoTicketingConfig,
  getAutoTicketingConfig,
  editAutoTicketingConfig,
  deleteAutoTicketingConfig,
};
