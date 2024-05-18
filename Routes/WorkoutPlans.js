const express = require('express');
const router = express.Router();
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const adminTokenHandler = require('../Middlewares/checkAdminToken');
const User = require('../Models/UserSchema');
const Workout = require('../Models/WorkoutSchema');


function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}
//for adding workouts in particular user's data by admin 
router.post('/workouts/:id', adminTokenHandler, async (req, res) => {
    try {
        const { name, description, durationInMinutes, exercises, imageURL } = req.body;
        console.log(req.body)

        // console.log(req.params)
        const user = await User.findById(req.params.id);

        user.workouts.push({
            name,
            description,
            durationInMinutes,
            exercises,
            imageURL,
        });
        await user.save();
        res.json(createResponse(true, 'Workout created successfully', user.workouts));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});

//for deleting workouts in particular user's data by admin 
router.delete('/workouts', adminTokenHandler, async (req, res) => {
    const { userId, workoutId } = req.body;
    if (!userId || !workoutId) {
        return res.status(400).json(createResponse(false, 'Please provide all the details'));
    }
    // console.log(userId)
    // console.log(workoutId)
    try {
        const user = await User.findById({ _id: userId });
        for (let i = 0; i < user.workouts.length; i++) {
            //NOTE:- user.workouts[i].id gives id of workout as an integer value and user.workouts[i]._id gives id of workout as object id
            if (workoutId === user.workouts[i].id) {
                // console.log(user.workouts[i].id)
                user.workouts = user.workouts.filter((item) => {
                    return item.id !== user.workouts[i].id
                })
                await user.save();
                // console.log(user.workouts)
            }
        }
        res.json(createResponse(true, 'Workout deleted successfully'));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});

//for display workout on homebanner2 component
router.get('/workouts', authTokenHandler, async (req, res) => {
    try {
        const userId = req.userId;
        // console.log(userId)
        const user = await User.findById({ _id: userId });
        res.json(createResponse(true, 'Workouts fetched successfully', user.workouts));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});

//for display exercises of praticular workout
router.get('/exercisesofWorkout/:id', authTokenHandler, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById({ _id: userId });

        // console.log("User ID:",userId)
        // console.log("Particular Workout ID:",req.params.id)

        // console.log(user.workouts.length)

        let workout = []
        for (let i = 0; i < user.workouts.length; i++) {
            //NOTE:- user.workouts[i].id gives id of workout as an integer value and user.workouts[i]._id gives id of workout as object id
            if (req.params.id === user.workouts[i].id) {
                workout = user.workouts[i]
                // console.log(user.workouts[i].id)
            }
        }
        // console.log(workout)

        res.json(createResponse(true, 'Workout fetched  successfully', workout));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});

// router.put('/workouts/:id', adminTokenHandler, async (req, res) => {
//     try {
//         const workout = await Workout.findById(req.params.id);
//         const { name, description, durationInMinutes, exercises, imageURL } = req.body;
//         workout.name = name;
//         workout.description = description;
//         workout.durationInMinutes = durationInMinutes;
//         workout.exercises = exercises;
//         workout.imageURL = imageURL;
//         await workout.save();
//         res.json(createResponse(true, 'Workout updated successfully', workout));
//     } catch (err) {
//         res.json(createResponse(false, err.message));
//     }
// });
router.use(errorHandler);

module.exports = router;
