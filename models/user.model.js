const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: "Account already exists for this email",
      required: "Email id is required",
      validate: {
        validator: function (value) {
          return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    password: {
      type: String,
      required: "Password is required",
      validate: {
        validator: function (value) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/g.test(value);
        },
        message: (props) =>
          `Password should contain 8 letters (atleast one number, one smallcase and uppercase alphabets)`,
      },
    },
    name: {
      type: String,
      required: "Name of the user is required",
      minLength: [2, "Name must be 2 characters or more"],
      maxLength: [20, "Name must be 4 characters or less"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
