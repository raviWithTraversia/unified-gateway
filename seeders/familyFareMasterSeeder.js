const FareFamilyMaster = require('../models/FareFamilyMaster');
const Company = require("../models/Company");

const seedFareFamilyMaster = async () => {
  try {
    // Check if any product already exist
    const getTMC = await Company.findOne({ type: "TMC" });
    let fareFamilyArr = [{
      "companyId": getTMC._id,
      "fareFamilyCode": "NDF",
      "fareFamilyName": "Coupon Fare"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "CPNS1",
      "fareFamilyName": "Coupon Fare"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "TBF",
      "fareFamilyName": "Coupon Fare"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "CPN",
      "fareFamilyName": "Coupon Fare"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "MAIN",
      "fareFamilyName": "Regular Fare"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "CDF",
      "fareFamilyName": "Corporate Fare"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "SME",
      "fareFamilyName": "SME Fare"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "CPNS",
      "fareFamilyName": "Coupon Fare"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "CRCT",
      "fareFamilyName": "Corporate Connect"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "CRCT1",
      "fareFamilyName": "Corporate Connect"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "FD",
      "fareFamilyName": "Fix Departure"
    },
    {
      "companyId": getTMC._id,
      "fareFamilyCode": "FF",
      "fareFamilyName": "Fix Departure"
    }];

    const existing = await FareFamilyMaster.find();
    if (existing.length === 0) {
      await FareFamilyMaster.create(fareFamilyArr);
      console.log('Family Fare Master  table seeded successfully.');
    } else {
      // console.log('Family Fare Master  table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};

module.exports = {
  seedFareFamilyMaster
};

