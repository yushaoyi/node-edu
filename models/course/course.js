import mongoose from 'mongoose';
import dtime from 'time-formater';

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseName: String,
  id: Number,
  cover: String,
  status: {
    type: Number,
    default: 1
  },
  gradeId: Number,
  gradeName: String,
  subjectId: Number,
  subjectName: String,
  detail: String,
  teacherId: Number,
  teacherName: String,
  price: String,
  create_date: {
    type: Date,
    default: Date.now,
    get: v => dtime(v).format('YYYY-MM-DD HH:mm:ss')
  },
  update_date: {
    type: Date,
    default: Date.now,
    get: v => dtime(v).format('YYYY-MM-DD HH:mm:ss')
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'create_date', updatedAt: 'update_date'
  }
})

courseSchema.index({id: 1});

courseSchema.set('toJSON', { getters: true });

const Course = mongoose.model('Course', courseSchema)

export default Course