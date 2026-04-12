const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { requireRole } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store in memory, upload directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only images (JPG, PNG, WebP) and PDFs are allowed'));
  },
});

// POST /uploads/nurse-doc — upload diploma or license
router.post('/nurse-doc', ...requireRole('NURSE'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { type } = req.body; // 'diploma' or 'license' or 'photo'
    if (!['diploma','license','photo'].includes(type)) return res.status(400).json({ error: 'Invalid type' });

    const folder = `vonaxity/nurses/${req.user.userId}`;
    const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType, public_id: `${type}_${Date.now()}`, overwrite: true },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(req.file.buffer);
    });

    // Update nurse record
    const prisma = require('../lib/db');
    const nurse = await prisma.nurse.findUnique({ where: { userId: req.user.userId } });
    if (!nurse) return res.status(404).json({ error: 'Nurse profile not found' });

    const updateData = {
      diploma: { diplomaUrl: result.secure_url },
      license: { licenseUrl: result.secure_url },
      photo: { profilePhotoUrl: result.secure_url },
    }[type];

    await prisma.nurse.update({ where: { id: nurse.id }, data: updateData });

    console.log(`📎 Uploaded ${type} for nurse ${nurse.id}: ${result.secure_url}`);
    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

module.exports = router;
