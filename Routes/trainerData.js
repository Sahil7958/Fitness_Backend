const express = require('express');
const router = express.Router();
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const adminTokenHandler = require('../Middlewares/checkAdminToken');
const Trainer = require('../Models/TrainerSchema');
const User = require('../Models/UserSchema');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}
//add trainerdata by admin 
router.post('/addtrainer', adminTokenHandler, async (req, res) => {
    try {
        const { name, email, contactNo, imageURL } = req.body;
        const existingTrainer = await Trainer.findOne({ email: email });

        if (existingTrainer) {
            return res.status(409).json(createResponse(false, 'Email already exists'));
        }
        const newTrainer = new Trainer({
            name,
            email,
            contactNo,
            imageURL
        });
        await newTrainer.save(); // Await the save operation

        res.status(201).json(createResponse(true, 'Trainer registered successfully'));
    }
    catch (err) {
        next(err);
    }
});
//fetch trainers list to allocate trainer
router.get('/trainers', adminTokenHandler, async (req, res) => {
    try {
        const trainers = await Trainer.find({});
        // console.log(trainers)
        res.json(createResponse(true, 'Trainer data fetched successfully', trainers));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});
//allocate trainer to user
router.post('/allocatetrainer', adminTokenHandler, async (req, res) => {
    try {
        const { trainerId, userId } = req.body;
        // console.log("User=",userId,"trainer=",trainerId)

        const user = await User.findById({ _id: userId });
        const trainer = await Trainer.findById({ _id: trainerId });
        // console.log("User=",user.name,"Trainer=",trainer.name)

        user.trainer = trainerId;
        user.trainerName=trainer.name
        await user.save();
        // console.log(user.trainer)

        res.json(createResponse(true, `${trainer.name} allocated to ${user.name} successfully`));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});
//fetch trainer for user
router.get('/fetchtrainerdata', authTokenHandler, async (req, res) => {
    try {
        const userId = req.userId;
        // console.log(userId)
        const user = await User.findById({ _id: userId });
        const trainer = await Trainer.findById({ _id: user.trainer });
        // console.log(trainer.name)
        res.json(createResponse(true, 'Trainer data fetched successfully', trainer));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});
module.exports = router;
