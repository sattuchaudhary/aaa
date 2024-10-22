//model/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    
    
    isAdmin: {
        type: Boolean,
        default: false
    },
    
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[6-9]\d{9}$/.test(v); // Indian mobile number validation
            },
            message: props => `${props.value} is not a valid Indian mobile number!`
        }
    },
    password: {
        type: String,
        required: true
    },
    referralCode: {
        type: String,
        unique: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    wallet: {
        balance: {
            type: Number,
            default: 100,
            min: [0, 'Balance cannot be negative']
        },
        rechargeAmount: {
            type: Number,
            default: 0,
            min: [0, 'Recharge amount cannot be negative']
        },
        points: {
            type: Number,
            default: 0,
            min: [0, 'Points cannot be negative']
        }
    },
    statistics: {
        totalIncome: {
            type: Number,
            default: 0
        },
        totalRecharge: {
            type: Number,
            default: 0
        },
        totalAssets: {
            type: Number,
            default: 0
        },
        totalWithdraw: {
            type: Number,
            default: 0
        },
        todayIncome: {
            type: Number,
            default: 0
        },
        teamIncome: {
            type: Number,
            default: 0
        }
    },
//team
    teamStatistics: {
        teamSize: {
            type: Number,
            default: 0
        },
        validTeam: {
            type: Number,
            default: 0
        },
        invition: {
            type: Number,
            default: 0
        },
        validInvition: {
            type: Number,
            default: 0
        }
    
    },

    withdrawalPassword: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    purchasedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    
    if (this.isModified('withdrawalPassword') && this.withdrawalPassword) {
        const salt = await bcrypt.genSalt(10);
        this.withdrawalPassword = await bcrypt.hash(this.withdrawalPassword, salt);
    }

    next();
});

// Generate a unique referral code before saving
userSchema.pre('save', async function(next) {
    if (!this.referralCode) {
        let isUnique = false;
        while (!isUnique) {
            this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existingUser = await this.constructor.findOne({ referralCode: this.referralCode });
            if (!existingUser) {
                isUnique = true;
            }
        }
    }
    next();
});

// Method to check login password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check withdrawal password
userSchema.methods.matchWithdrawalPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.withdrawalPassword);
};

module.exports = mongoose.model('User', userSchema);



