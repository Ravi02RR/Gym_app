const bcrypt = require("bcrypt");

// >NOTE: Always use function keyword when defining mongoose middleware
// > OR when using this keyword inside the function
const generateHash = async function (next) {
    try {
        const saltRounds = +process.env.SALT_ROUNDS;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
};

const compareHash = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = { generateHash, compareHash };
