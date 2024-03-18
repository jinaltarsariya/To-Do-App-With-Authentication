const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const validateName = (name) => {
    const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
    return nameRegex.test(name);
};

const validateMobileNumber = (number) => {
    const numberRegex = /^[0-9]+$/;
    return numberRegex.test(number);
};

const userSignup = async (req, res) => {
    try {
        let { name, email, mobileNumber, password, confirmPassword } = req.body;

        if (!name || !email || !mobileNumber || !password || !confirmPassword) {
            return res.status(200).json({
                flag: 0,
                message: "All field is required!",
                data: {},
            });
        }

        // name validation
        if (name.length < 3) {
            return res.status(200).json({
                flag: 0,
                message: "Name must be minimun 3 charater !",
                data: {},
            });
        }
        if (name.length > 50) {
            return res.status(200).json({
                flag: 0,
                message: "Name is too long !",
                data: {},
            });
        }
        if (!validateName(name)) {
            return res.status(200).json({
                flag: 0,
                message:
                    "Palese enter valid name and you cann't passed white sapces and special character!",
                data: {},
            });
        }

        // email validation
        if (!isEmailValid(email)) {
            return res.status(200).json({
                flag: 0,
                message: "Enter valid email address !",
                data: {},
            });
        }

        // mobile number validation
        if (mobileNumber.length < 6 || mobileNumber.length > 10) {
            return res.status(200).json({
                flag: 0,
                message: "Enter valid mobile number between 6 to 10 character !",
                data: {},
            });
        }

        if (!validateMobileNumber(mobileNumber)) {
            return res.status(200).json({
                flag: 0,
                message: "Palese enter valid number !",
                data: {},
            });
        }

        // password validation
        if (password.length < 5) {
            return res.status(200).json({
                flag: 0,
                message: "Password must be minimun 5 charater !",
                data: {},
            });
        }
        if (password.length > 15) {
            return res.status(200).json({
                flag: 0,
                message: "Password is too long !",
                data: {},
            });
        }
        if (password !== confirmPassword) {
            return res.status(200).json({
                flag: 0,
                message: "Password do not matched !",
                data: {},
            });
        }

        req.body.password = await bcrypt.hash(password, 10);

        let checkedEmailAndMobileNumber = await userModel.findOne({
            $or: [{ email: email }, { mobileNumber: mobileNumber }],
        });
        if (checkedEmailAndMobileNumber) {
            return res.status(200).json({
                flag: 0,
                message: "This data already exiest !",
                data: {},
            });
        }

        let createUser = await userModel.create(req.body);

        return res.status(201).json({
            flag: 1,
            message: "User registration successfully !",
            data: createUser,
        });
    } catch (error) {
        return res.status(200).json({
            flag: 0,
            message: error.message,
            data: {},
        });
    }
};

const userLogin = async (req, res) => {
    try {
        let { username, password } = req.body;

        if (!username || !password) {
            return res.status(200).json({
                flag: 0,
                message: 'Please fill all fields !',
                data: {},
            });
        }

        let checkByUsername = await userModel.findOne({ $or: [{ email: username }, { mobileNumber: username }] })
        if (!checkByUsername) {
            return res.status(200).json({
                flag: 0,
                message: 'User not found',
                data: {},
            });
        }

        let checkByPassword = await bcrypt.compare(password, checkByUsername.password)
        if (!checkByPassword) {
            return res.status(200).json({
                flag: 0,
                message: 'Your password is incorrect',
                data: {},
            });
        }

        let token = await jwt.sign({ id: checkByUsername._id }, 'USER-AUTH-TOKEN')
        return res.status(200).json({
            flag: 1,
            message: 'User login successfully',
            data: token,
        });


    } catch (error) {
        return res.status(200).json({
            flag: 0,
            message: error.message,
            data: {},
        });
    }
}

module.exports = { userSignup, userLogin };
