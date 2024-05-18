const express = require('express');
const router = express.Router();

const authTokenHandler = require('../Middlewares/checkAuthToken');
const errorHandler = require('../Middlewares/errorMiddleware');
const User = require('../Models/UserSchema');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/addweightentry', authTokenHandler, async (req, res) => {
    const { date, weightInKg } = req.body;

    if (!date || !weightInKg) {
        return res.status(400).json(createResponse(false, 'Please provide date and weight'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.weighttrack = filterEntriesByDate(user.weighttrack, new Date(date));
    if (user.weighttrack.length > 0) {
        return res.status(400).json(createResponse(false, 'Cant add more than one entry for this date'));
    }
    else {
        user.weighttrack.push({
            date: new Date(date),
            weight: weightInKg,
        });

        await user.save();
        res.json(createResponse(true, 'Weight entry added successfully'));
    }
});

router.post('/getweightbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;

    const user = await User.findById({ _id: userId });

    if (!date) {
        let date = new Date();
        user.weighttrack = filterEntriesByDate(user.weighttrack, date);

        return res.json(createResponse(true, 'Weight entries for today', user.weighttrack));
    }

    user.weighttrack = filterEntriesByDate(user.weighttrack, new Date(date));
    res.json(createResponse(true, 'Weight entries for the date', user.weighttrack));
});

router.post('/getweightbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All weight entries', user.weighttrack));
    } else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();


        user.weighttrack = user.weighttrack.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, `Weight entries for the last ${limit} days`, user.weighttrack));
    }
});

router.delete('/deleteweightentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.weighttrack = user.weighttrack.filter((item) => {
        return item.date.toString() !== new Date(date).toString()
    });

    await user.save();
    res.json(createResponse(true, 'Weight entry deleted successfully'));
});

// router.get('/getusergoalweight', authTokenHandler, async (req, res) => {
//     const userId = req.userId;
//     const user = await User.findById({ _id: userId });

//     const currentWeight = user.weight.length > 0 ? user.weight[user.weight.length - 1].weight : null;
//     const goalWeight = 22 * ((user.height[user.height.length - 1].height / 100) ** 2);

//     res.json(createResponse(true, 'User goal weight information', { currentWeight, goalWeight }));
// });

router.use(errorHandler);

function filterEntriesByDate(entries, targetDate) {
    return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
            entryDate.getDate() === targetDate.getDate() &&
            entryDate.getMonth() === targetDate.getMonth() &&
            entryDate.getFullYear() === targetDate.getFullYear()
        );
    });
}

module.exports = router;