'use strict';

import mongoose from 'mongoose';
import dtime from 'time-formater'

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: String,
  phone: String,
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
    default: 1
  },
  sex: {
    type: Number,
    default: 0
  }
},
  {
    versionKey: false,
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' }
  })

studentSchema.index({id: 1});

studentSchema.set('toJSON', { getters: true});

studentSchema.virtual('create_at').get(function () {
  return dtime(this.create_date).format('YYYY-MM-DD hh:mm:ss')
});

studentSchema.virtual('update_at').get(function () {
  return dtime(this.update_date).format('YYYY-MM-DD hh:mm:ss')
});

studentSchema.statics = {
  fetch(id, cb) {
    if (id) {
      return this.find({'_id': {"$lt": id}})
        .limit(5)
        .sort({'_id':-1})
        .exec(cb);
    }else {
      return this.find({})
        .limit(5)
        .sort({'_id':-1})
        .exec(cb);
    }

  }
}


const Student = mongoose.model('Student', studentSchema)

export default Student