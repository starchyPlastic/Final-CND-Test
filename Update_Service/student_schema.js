const schema_mongoose = require('mongoose');

// Student Schema – must match Registration Service schema exactly
const StudentSchema = schema_mongoose.Schema(
    {
        student_id:       { type: Number },
        student_name:     { type: String },
        student_mobile:   { type: Number },
        student_email:    { type: String, unique: true },
        student_password: { type: String }
    },
    {
        timestamps: true
    }
);

module.exports = schema_mongoose.model('student_collection', StudentSchema);

