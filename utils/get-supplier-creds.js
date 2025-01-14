const SupplierCode = require("../models/supplierCode");
const Supplier = require("../models/Supplier");

async function getSupplierCredentials({ provider}) {
  try {
    const supplierCode = await SupplierCode.findOne({ supplierCode: provider });
    if (!supplierCode) throw new Error("Supplier Code Not Found");

    const supplier = await Supplier.findOne({
      supplierCodeId: supplierCode._id,
      status:true
    }).populate("supplierCodeId");
    if (!supplier) throw new Error("Supplier Credentials Not Found");

    return { supplier, supplierCode };
  } catch (error) {
    console.log({ error });
    return { error: error.message };
  }
}

module.exports = { getSupplierCredentials };
