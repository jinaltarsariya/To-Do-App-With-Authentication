const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        mobileNumber: { type: String, trim: true },
        password: { type: String, trim: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

userSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.name = this.name.replace(/\s+/g, " ").trim();
    }
    if (this.isModified("email")) {
        this.email = this.email.replace(/\s+/g, " ").trim();
    }
    if (this.isModified("mobileNumber")) {
        this.mobileNumber = this.mobileNumber.replace(/\s+/g, " ").trim();
    }
    if (this.isModified("password")) {
        this.password = this.password.replace(/\s+/g, " ").trim();
    }
    next();
});

const userModel = mongoose.model('user', userSchema)

module.exports = userModel