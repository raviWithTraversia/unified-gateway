const mongoose = require('mongoose');

const railLogsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  traceId: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  req: {
    type: String,
    default: "",
  },
  res: {
    type: String,
    default: "",
  },
  modifyAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Raillogs', railLogsSchema);
