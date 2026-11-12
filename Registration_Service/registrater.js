const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const dbconnect     = require('./dbconnect.js');
const StudentModel  = require('./student_schema.js');

const saltRounds = 10;

// Helper: generate a random Student ID between min and max
function generateStudentId(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/*
 * REGISTRATION API
 * ─────────────────────────────────────────────────────────────────────────────
 * POST  /userregister
 *
 * Request Body (JSON):
 * {
 *   "student_name"    : "John Doe",
 *   "student_email"   : "john@example.com",
 *   "student_password": "mypassword",
 *   "student_mobile"  : 9876543210
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */
app.post('/userregister', async (req, res) => {
    console.log('REGISTRATION API EXECUTED');

    try {
        const { student_name, student_email, student_password, student_mobile } = req.body;

        // Validate required fields
        if (!student_name || !student_email || !student_password || !student_mobile) {
            return res.status(400).json({
                message: 'All fields are required: student_name, student_email, student_password, student_mobile'
            });
        }

        // Check for duplicate email
        const existingStudent = await StudentModel.findOne({ student_email: student_email });
        if (existingStudent) {
            return res.status(409).json({ message: 'Duplicate Email: Student already exists.' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(student_password, saltRounds);

        // Create new student document
        const studentObj = new StudentModel({
            student_id:       generateStudentId(1000, 9999),
            student_name:     student_name,
            student_email:    student_email,
            student_password: hashedPassword,
            student_mobile:   student_mobile
        });

        // Save to MongoDB
        await studentObj.save();
        return res.status(200).json({
            message:    'Student registered successfully!',
            student_id: studentObj.student_id,
            student_name: studentObj.student_name,
            student_email: studentObj.student_email
        });

    } catch (err) {
        return res.status(500).json({ message: err.message || 'Error during registration' });
    }
});

// START THE EXPRESS SERVER on PORT 5003
app.listen(5003, () => console.log('Registration Service running on PORT 5003'));

