const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const dbconnect    = require('./dbconnect.js');
const StudentModel = require('./student_schema.js');

const saltRounds = 10;

/*
 * UPDATE SERVICE – Update Student Mobile Number or Password
 * ─────────────────────────────────────────────────────────────────────────────
 * PUT  /updatestudent
 *
 * Request Body (JSON):
 * {
 *   "student_email"   : "john@example.com",    ← Required (to identify student)
 *   "student_mobile"  : 9876543210,             ← Optional
 *   "student_password": "newpassword"           ← Optional
 * }
 *
 * At least one of student_mobile or student_password must be provided.
 * ─────────────────────────────────────────────────────────────────────────────
 */
app.put('/updatestudent', async (req, res) => {
    console.log('UPDATE API EXECUTED');

    try {
        const { student_email, student_mobile, student_password } = req.body;

        // Validate: email is required to find the student
        if (!student_email) {
            return res.status(400).json({ message: 'student_email is required to identify the student.' });
        }

        // Validate: at least one field to update must be provided
        if (!student_mobile && !student_password) {
            return res.status(400).json({
                message: 'Please provide at least one field to update: student_mobile or student_password.'
            });
        }

        // Check if student exists
        const existingStudent = await StudentModel.findOne({ student_email: student_email });
        if (!existingStudent) {
            return res.status(404).json({ message: 'Student not found with the provided email.' });
        }

        // Build the update object
        const updateData = {};
        if (student_mobile)   updateData.student_mobile   = student_mobile;
        if (student_password) updateData.student_password = await bcrypt.hash(student_password, saltRounds);

        // Perform the update
        const updatedStudent = await StudentModel.findOneAndUpdate(
            { student_email: student_email },
            { $set: updateData },
            { new: true }   // Return the updated document
        );

        return res.status(200).json({
            message:        'Student updated successfully!',
            student_id:     updatedStudent.student_id,
            student_name:   updatedStudent.student_name,
            student_email:  updatedStudent.student_email,
            student_mobile: updatedStudent.student_mobile
        });

    } catch (err) {
        return res.status(500).json({ message: err.message || 'Error during update' });
    }
});

// START THE EXPRESS SERVER on PORT 5004
app.listen(5004, () => console.log('Update Service running on PORT 5004'));

