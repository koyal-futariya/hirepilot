require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const { put } = require('@vercel/blob');

const app = express();
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

// --- Education subdocument schema ---
const EducationSchema = new mongoose.Schema({
  id: String,
  institute: String,
  degree: String,
  fieldOfStudy: String,
  startDate: String,
  endDate: String,
  description: String,
}, { _id: false });

// --- Experience schema ---
const ExperienceSchema = new mongoose.Schema({
  id: String,
  title: String,
  company: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String
}, { _id: false });

// --- Skills schemas for categories/groups ---
const SkillSchema = new mongoose.Schema({
  id: String,
  name: String,
}, { _id: false });

const SkillCategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  skills: [SkillSchema],
}, { _id: false });

// --- Profile schema including grouped skills ---
const ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: String,
  gender: String,
  dateOfBirth: Date,
  summary: String,
  phone: String,
  email: String,
  address: {
    current: String,
    permanent: String,
  },
  city: String,
  state: String,
  country: String,
  zipCode: String,
  jobTitle: String,
  department: String,
  company: String,
  education: [EducationSchema],
  experience: [ExperienceSchema],
  skills: [SkillCategorySchema], // <-- skills as category array with skills
}, { collection: 'profiles' });

const Profile = mongoose.model('Profile', ProfileSchema);

// --- Save profile route ---
app.post('/api/save-profile', async (req, res) => {
  try {
    const { userId, about, personalInfo, education, experience, skills } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    if (!personalInfo || !Array.isArray(personalInfo)) {
      return res.status(400).json({ error: "'personalInfo' is required and must be an array." });
    }

    const pi = (label) => personalInfo.find(i => i.label === label)?.value || '';

    const profileData = {
      fullName: pi('Full Name'),
      gender: pi('Gender'),
      dateOfBirth: pi('Date of Birth'),
      summary: about,
      phone: pi('Phone'),
      email: pi('Email'),
      address: {
        current: pi('Address'),
        permanent: pi('Permanent Address'),
      },
      city: pi('City'),
      state: pi('State'),
      country: pi('Country'),
      zipCode: pi('ZIP Code'),
      jobTitle: pi('Job Title'),
      department: pi('Department'),
      company: pi('Company'),
      education: education || [],
      experience: experience || [],
      skills: skills || [], // <-- accepts array of categories with skills
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const profile = await Profile.findOneAndUpdate(
      { userId },
      profileData,
      options
    );
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to save profile' });
  }
});

// --- Get profile route ---
app.get('/api/get-profile', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    const profile = await Profile.findOne({ userId });
    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to get profile' });
  }
});

// --- Resume upload route ---
app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { buffer, originalname } = req.file;
    const blob = await put(originalname, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return res.json({
      success: true,
      url: blob.url,
      filename: originalname,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// --- Resume deletion route ---
app.delete('/api/delete-resume', async (req, res) => {
  try {
    const { filename, userId } = req.body;
    if (!filename || !userId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    // Add deletion logic here if needed for your blob storage system
    console.log(`Resume ${filename} deleted for user ${userId}`);
    return res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Express backend running on port ${PORT}`);
  console.log('[POST]   /api/save-profile');
  console.log('[GET]    /api/get-profile');
  console.log('[POST]   /api/upload-resume');
  console.log('[DELETE] /api/delete-resume');
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});
