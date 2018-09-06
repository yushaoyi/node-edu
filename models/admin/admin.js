'use strict';

import mongoose from 'mongoose';
import dtime from 'time-formater'

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    user_name: String,
    password: String,
    id: Number,
    create_date: {
      type: Date,
      default: Date.now,
      get: v => dtime(v).format('YYYY-MM-DD HH:mm:ss')
    },
    update_date: {
      type: Date,
      default: Date.now,
      get: v => dtime(v).format('YYYY-MM-DD HH:mm:ss')
    },
    status: {
      type: Number,
      default: 0
    },
    position: String,
    department: String,
    roleIds: [{ type: Number }]
  },
  {
    versionKey: false,
    timestamps: {createdAt: 'create_date', updatedAt: 'update_date'}
  })

adminSchema.index({id: 1});

adminSchema.set('toJSON', { getters: true});

const Admin = mongoose.model('Admin', adminSchema)

export default Admin