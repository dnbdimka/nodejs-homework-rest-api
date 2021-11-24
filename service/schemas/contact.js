const { Schema, model, SchemaTypes } = require("mongoose");

const contact = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      validate: /^[a-z '-]+$/i,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      validate:
        /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
      default: "",
    },
    phone: {
      type: String,
      validate: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
      default: "",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model("contact", contact);

module.exports = Contact;
