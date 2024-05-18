const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weighttrack: [
        {
            weight: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        }
    ],
    heighttrack: [
        {
            height: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        }
    ],
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    goal: {
        type: String,
        required: true,
    },
    calorieIntake: [
        {
            item: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            quantitytype: {
                type: String,
                required: true,
            },
            calorieIntake: {
                type: Number,
                required: true,
            },
        }
    ],
    activityLevel: {
        type: String,
        required: true,
    },
    sleep: [
        {
            date: {
                type: Date,
                required: true,
            },
            durationInHrs: {
                type: Number,
                required: true,
            },
        }
    ],
    steps: [
        {
            date: {
                type: Date,
                required: true,
            },
            steps: {
                type: Number,
                required: true,
            },
        },
    ],
    workouts: [
        {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            durationInMinutes: {
                type: Number,
                required: true,
            },
            exercises: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    description: {
                        type: String,
                        required: true,
                    },
                    sets: {
                        type: Number,
                        required: true,
                    },
                    reps: {
                        type: Number,
                        required: true,
                    },
                    imageURL: {
                        type: String,
                        required: true,
                    },
                }
            ],
            imageURL: {
                type: String,
                required: true,
            },
        }
    ],
    workouttrack: [
        {
            date: {
                type: Date,
                required: true,
            },
            exercise: {
                type: String,
                required: true,
            },
            durationInMinutes: {
                type: Number,
                required: true,
            },
        },
    ],
    water: [
        {
            date: {
                type: Date,
                required: true,
            },
            amountInMilliliters: {
                type: Number,
                required: true,
            },
        },
    ],
    trainer:
    {
        type: String,
        require: true
    },
    trainerName:
    {
        type: String,
        require: true
    }

}, { timestamps: true });


userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;
