const User = require("../../models/User");
const Ledger = require("../../models/Ledger");
const AgentConfig = require("../../models/AgentConfig");

const interTransferCredit = async (req, res) => {
    const { productFrom, productTo, transferredAmount, userId } = req.body;
    if (productFrom === productTo) {
        return {
            response: "Products can not be same"
        }
    }
    const getUserByUserId = await User.findById(userId).populate('roleId');
    if (!getUserByUserId) {
        return {
            response: "User not found"
        }
    }
    if (getUserByUserId.roleId.name === "TMC" || getUserByUserId.roleId.name === "Agency" || getUserByUserId.roleId.name === "Distributer") {
        const getAgentConfig = await AgentConfig.findOne({ userId });
        let ledgerId1;
        let updateResponse1;
        switch (productFrom) {
            case "Flight":
                if (getAgentConfig.maxcreditLimit < transferredAmount) {
                    return { response: "Not enough Credit to Transfer" }
                }
                updateResponse1 = await AgentConfig.findOneAndUpdate({ userId }, { $inc: { maxcreditLimit: -transferredAmount } }, { new: true });
                ledgerId1 = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
                await Ledger.create({
                    userId: updateResponse1.userId,
                    companyId: updateResponse1.companyId,
                    ledgerId: ledgerId1,
                    transactionAmount: transferredAmount,
                    currencyType: "INR",
                    fop: "Debit",
                    transactionType: "Debit",
                    runningAmount: updateResponse1.maxcreditLimit,
                    remarks: "Transferred Request Debited from Your Account.",
                    transactionBy: userId,
                    product: "Flight"
                });
                break;
            case "Rail":
                if (getAgentConfig.maxRailCredit < transferredAmount) {
                    return { response: "Not enough Credit to Transfer" }
                }
                updateResponse1 = await AgentConfig.findOneAndUpdate({ userId }, { $inc: { maxRailCredit: -transferredAmount } }, { new: true })
                ledgerId1 = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
                await Ledger.create({
                    userId: updateResponse1.userId,
                    companyId: updateResponse1.companyId,
                    ledgerId: ledgerId1,
                    transactionAmount: transferredAmount,
                    currencyType: "INR",
                    fop: "Debit",
                    transactionType: "Debit",
                    runningAmount: updateResponse1.maxcreditLimit,
                    remarks: "Transferred Request Debited from Your Account.",
                    transactionBy: userId,
                    product: "Rail"
                });
                break;
            default:
                return { response: "Something went wrong" }
                break;
        }
        let ledgerId2, updateResponse2;
        switch (productTo) {
            case "Flight":
                ledgerId2 = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
                updateResponse2 = await AgentConfig.findOneAndUpdate({ userId }, { $inc: { maxcreditLimit: transferredAmount } }, { new: true });
                await Ledger.create({
                    userId: updateResponse2.userId,
                    companyId: updateResponse2.companyId,
                    ledgerId: ledgerId2,
                    transactionAmount: transferredAmount,
                    currencyType: "INR",
                    fop: "Credit",
                    transactionType: "Credit",
                    runningAmount: updateResponse2.maxcreditLimit,
                    remarks: "Transferred Request Cretided into Your Account.",
                    transactionBy: userId,
                    product: "Flight"
                });
                break;
            case "Rail":
                ledgerId2 = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
                updateResponse2 = await AgentConfig.findOneAndUpdate({ userId }, { $inc: { maxRailCredit: transferredAmount } }, { new: true })
                await Ledger.create({
                    userId: updateResponse2.userId,
                    companyId: updateResponse2.companyId,
                    ledgerId: ledgerId2,
                    transactionAmount: transferredAmount,
                    currencyType: "INR",
                    fop: "Credit",
                    transactionType: "Credit",
                    runningAmount: updateResponse2.maxcreditLimit,
                    remarks: "Transferred Request Cretided into Your Account.",
                    transactionBy: userId,
                    product: "Rail"
                });
                break;
            default:
                return { response: "Something went wrong" }
                break;
        }
        return { response: "Amount Transferred Successfully!" };
    } else {
        return {
            response: "You don't have permission to transfer Credit"
        }
    }
}

module.exports = { interTransferCredit }