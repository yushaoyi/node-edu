'use strict'

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const sysLogsSchema = new Schema({
    id: Number,
    date_time: String,
    origin: String,
    url: String,
    method: String,
    input_params: String,
    return_value: String,
    create_by: String,
    create_date: String
})

sysLogsSchema.index({id: 1})

const SysLogs = mongoose.model('SysLogs', sysLogsSchema)

export default SysLogs

