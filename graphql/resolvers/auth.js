const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (args) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error("User Exists Already!");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      return { ...savedUser._doc, password: null, _id: savedUser.id };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isEqual = await bcrypt.compare(password, user._doc.password);

    if (!isEqual) {
      throw new Error("Invalid credentials!");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user._doc.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return { token, userId: user.id, tokenExpirationInHours: 1 };
  },
};
