const User = require("../models/User"); // Adjust the path

async function migrate() {
    try {
        const users = await User.find();
        console.log("Found users:", users.length);

        for (const user of users) {
            
            //user.address = ""; add migration fields when we update any fields
            console.log(`Updating user with ID ${user}`);
            const userSave =  await user.save();
           // console.log(`User with ID ${userSave} updated.`);
        }

        console.log("Migration completed successfully.");
    } catch (error) {
        console.error("Migration error:", error);
    }
}


module.exports = {
    migrate
};
