'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authSchema = new Schema({
    user_name: String,
    phone: String,
    password: String,
    id: Number,
    create_date: {
        type: Date,
        default: Date.now
    },
    update_date: {
        type: Date,
        default: Date.now
    }
},
    {
        versionKey: false,
        timestamps: { createdAt: 'create_date', updatedAt: 'update_date' }
    })

authSchema.index({id: 1});

const Auth = mongoose.model('Auth', authSchema)

export default Auth