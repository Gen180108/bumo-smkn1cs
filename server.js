const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/admin', express.static('admin'));
app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

// Helper functions
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {
      laporan: [],
      artikel: [],
      dokumentasi: [],
      alumni: [],
      struktur: []
    };
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// ==================== LAPORAN ENDPOINTS ====================
app.get('/api/laporan', (req, res) => {
  const data = readData();
  res.json(data.laporan);
});

app.post('/api/laporan', (req, res) => {
  const data = readData();
  const newReport = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  data.laporan.push(newReport);
  writeData(data);
  res.json(newReport);
});

app.put('/api/laporan/:id', (req, res) => {
  const data = readData();
  const index = data.laporan.findIndex(item => item.id === req.params.id);
  if (index !== -1) {
    data.laporan[index] = { ...data.laporan[index], ...req.body };
    writeData(data);
    res.json(data.laporan[index]);
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});

app.delete('/api/laporan/:id', (req, res) => {
  const data = readData();
  data.laporan = data.laporan.filter(item => item.id !== req.params.id);
  writeData(data);
  res.json({ message: 'Report deleted successfully' });
});

// ==================== ARTIKEL ENDPOINTS ====================
app.get('/api/artikel', (req, res) => {
  const data = readData();
  res.json(data.artikel);
});

app.post('/api/artikel', (req, res) => {
  const data = readData();
  const newArticle = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  data.artikel.push(newArticle);
  writeData(data);
  res.json(newArticle);
});

app.put('/api/artikel/:id', (req, res) => {
  const data = readData();
  const index = data.artikel.findIndex(item => item.id === req.params.id);
  if (index !== -1) {
    data.artikel[index] = { ...data.artikel[index], ...req.body };
    writeData(data);
    res.json(data.artikel[index]);
  } else {
    res.status(404).json({ error: 'Article not found' });
  }
});

app.delete('/api/artikel/:id', (req, res) => {
  const data = readData();
  data.artikel = data.artikel.filter(item => item.id !== req.params.id);
  writeData(data);
  res.json({ message: 'Article deleted successfully' });
});

// ==================== DOKUMENTASI ENDPOINTS ====================
app.get('/api/dokumentasi', (req, res) => {
  const data = readData();
  res.json(data.dokumentasi);
});

app.post('/api/dokumentasi', upload.single('image'), (req, res) => {
  const data = readData();
  const newDoc = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    image: req.file ? `/uploads/${req.file.filename}` : '',
    createdAt: new Date().toISOString()
  };
  data.dokumentasi.push(newDoc);
  writeData(data);
  res.json(newDoc);
});

app.delete('/api/dokumentasi/:id', (req, res) => {
  const data = readData();
  const doc = data.dokumentasi.find(item => item.id === req.params.id);
  if (doc && doc.image) {
    const imagePath = path.join(__dirname, 'public', doc.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  data.dokumentasi = data.dokumentasi.filter(item => item.id !== req.params.id);
  writeData(data);
  res.json({ message: 'Documentation deleted successfully' });
});

// ==================== ALUMNI ENDPOINTS (UPDATED) ====================
app.get('/api/alumni', (req, res) => {
  const data = readData();
  res.json(data.alumni);
});

app.post('/api/alumni', upload.single('photo'), (req, res) => {
  const data = readData();
  const newAlumni = {
    id: Date.now().toString(),
    nama: req.body.nama,
    periode: req.body.periode,
    jabatan: req.body.jabatan,
    angkatan: req.body.angkatan,
    jurusan: req.body.jurusan,
    photo: req.file ? `/uploads/${req.file.filename}` : '',
    createdAt: new Date().toISOString()
  };
  data.alumni.push(newAlumni);
  writeData(data);
  res.json(newAlumni);
});

app.put('/api/alumni/:id', upload.single('photo'), (req, res) => {
  const data = readData();
  const index = data.alumni.findIndex(item => item.id === req.params.id);
  if (index !== -1) {
    const updatedAlumni = {
      ...data.alumni[index],
      nama: req.body.nama,
      periode: req.body.periode,
      jabatan: req.body.jabatan,
      angkatan: req.body.angkatan,
      jurusan: req.body.jurusan
    };
    if (req.file) {
      updatedAlumni.photo = `/uploads/${req.file.filename}`;
    }
    data.alumni[index] = updatedAlumni;
    writeData(data);
    res.json(data.alumni[index]);
  } else {
    res.status(404).json({ error: 'Alumni not found' });
  }
});

app.delete('/api/alumni/:id', (req, res) => {
  const data = readData();
  const alumni = data.alumni.find(item => item.id === req.params.id);
  if (alumni && alumni.photo) {
    const photoPath = path.join(__dirname, alumni.photo.replace(/^\//, ''));
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
  }
  data.alumni = data.alumni.filter(item => item.id !== req.params.id);
  writeData(data);
  res.json({ message: 'Alumni deleted successfully' });
});

// ==================== STRUKTUR ENDPOINTS (UPDATED) ====================
app.get('/api/struktur', (req, res) => {
  const data = readData();
  res.json(data.struktur);
});

app.post('/api/struktur', upload.single('photo'), (req, res) => {
  const data = readData();
  const newMember = {
    id: Date.now().toString(),
    nama: req.body.nama,
    jabatan: req.body.jabatan,
    periode: req.body.periode,
    divisi: req.body.divisi,
    photo: req.file ? `/uploads/${req.file.filename}` : '',
    createdAt: new Date().toISOString()
  };
  data.struktur.push(newMember);
  writeData(data);
  res.json(newMember);
});

app.put('/api/struktur/:id', upload.single('photo'), (req, res) => {
  const data = readData();
  const index = data.struktur.findIndex(item => item.id === req.params.id);
  if (index !== -1) {
    const updatedMember = {
      ...data.struktur[index],
      nama: req.body.nama,
      jabatan: req.body.jabatan,
      periode: req.body.periode,
      divisi: req.body.divisi
    };
    if (req.file) {
      updatedMember.photo = `/uploads/${req.file.filename}`;
    }
    data.struktur[index] = updatedMember;
    writeData(data);
    res.json(data.struktur[index]);
  } else {
    res.status(404).json({ error: 'Structure member not found' });
  }
});

app.delete('/api/struktur/:id', (req, res) => {
  const data = readData();
  const member = data.struktur.find(item => item.id === req.params.id);
  if (member && member.photo) {
    const photoPath = path.join(__dirname, member.photo.replace(/^\//, ''));
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
  }
  data.struktur = data.struktur.filter(item => item.id !== req.params.id);
  writeData(data);
  res.json({ message: 'Structure member deleted successfully' });
});
// ==================== AUTH ENDPOINT ====================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple authentication (for demo purposes)
  if (username === 'admin' && password === 'bumo2024') {
    res.json({ 
      success: true, 
      token: 'demo-token-' + Date.now(),
      message: 'Login successful' 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

// Initialize data directory and file
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    laporan: [
      {
        id: '1',
        periode: 'Q1 2024',
        tanggal: '2024-03-31',
        pendapatan: 15000000,
        pengeluaran: 8500000,
        saldo: 6500000,
        keterangan: 'Laporan keuangan triwulan pertama tahun 2024',
        createdAt: new Date().toISOString()
      }
    ],
    artikel: [
      {
        id: '1',
        title: 'Strategi Kewirausahaan untuk Siswa SMK',
        author: 'Tim BUMO',
        date: '2024-03-15',
        content: 'Kewirausahaan adalah keterampilan penting bagi siswa SMK. Artikel ini membahas strategi praktis untuk memulai bisnis sederhana, mengelola keuangan, dan mengembangkan mindset entrepreneurial.',
        excerpt: 'Panduan praktis memulai bisnis untuk siswa SMK',
        createdAt: new Date().toISOString()
      }
    ],
    dokumentasi: [
      {
        id: '1',
        title: 'Workshop Kewirausahaan 2024',
        description: 'Workshop kewirausahaan dengan narasumber dari industri',
        date: '2024-03-10',
        image: '/uploads/sample-doc.jpg',
        createdAt: new Date().toISOString()
      }
    ],
    alumni: [
      {
        id: '1',
        nama: 'Ahmad Rizki',
        periode: '2023/2024',
        jabatan: 'Ketua BUMO',
        angkatan: '2024',
        jurusan: 'Teknik Komputer dan Jaringan',
        createdAt: new Date().toISOString()
      }
    ],
    struktur: [
      {
        id: '1',
        nama: 'Siti Nurhaliza',
        jabatan: 'Ketua BUMO',
        periode: '2024/2025',
        divisi: 'Kepemimpinan',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        nama: 'Budi Santoso',
        jabatan: 'Wakil Ketua',
        periode: '2024/2025',
        divisi: 'Kepemimpinan',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        nama: 'Dewi Lestari',
        jabatan: 'Sekretaris',
        periode: '2024/2025',
        divisi: 'Administrasi',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        nama: 'Andi Prasetyo',
        jabatan: 'Bendahara',
        periode: '2024/2025',
        divisi: 'Keuangan',
        createdAt: new Date().toISOString()
      }
    ]
  };
  writeData(initialData);
}

app.listen(PORT, () => {
  console.log(`🚀 BUMO Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin/dashboard.html`);
  console.log(`🌐 Public Website: http://localhost:${PORT}`);
});