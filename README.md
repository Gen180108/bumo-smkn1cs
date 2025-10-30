# BUMO - Badan Usaha Milik OSIS SMKN 1 Cikarang Selatan

![BUMO Logo](https://img.shields.io/badge/BUMO-SMKN1-1ABC9C?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v14+-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-v4.18-000000?style=flat-square&logo=express)

Sistem manajemen website dan admin dashboard untuk Badan Usaha Milik OSIS dengan desain modern, bersih, dan profesional.

## ✨ Features

### 🌐 Public Website
- **Landing Page** - Hero section dengan CTA yang menarik
- **Profil** - Informasi lengkap tentang BUMO, visi misi, dan struktur organisasi
- **Laporan Keuangan** - Transparansi keuangan dengan tabel dan grafik Chart.js
- **Artikel** - Artikel edukasi kewirausahaan dengan modal preview
- **Dokumentasi** - Gallery foto kegiatan dengan lightbox
- **Alumni** - Daftar alumni per periode

### 🔐 Admin Dashboard
- **Dashboard Overview** - Ringkasan statistik real-time
- **Manajemen Laporan** - CRUD laporan keuangan
- **Manajemen Artikel** - CRUD artikel edukasi
- **Manajemen Dokumentasi** - Upload dan manage foto kegiatan
- **Manajemen Alumni** - CRUD data alumni
- **Manajemen Struktur** - CRUD struktur organisasi

## 🎨 Design System

### Colors
- **Primary**: `#1ABC9C` (Turquoise)
- **Secondary**: `#003C8F` (Deep Blue)
- **Background**: `#FFFFFF` (Clean White)
- **Text**: `#2C3E50` (Dark Gray)
- **Light Gray**: `#ECF0F1`

### Typography
- **Font**: Poppins (Google Fonts)
- **Weights**: Regular (400), Medium (500), SemiBold (600)

## 📁 Project Structure

```
bumo-smkn1/
├── server.js                # Express server
├── package.json             # Dependencies
├── .gitignore              # Git ignore rules
├── README.md               # Documentation
│
├── public/                 # Public website
│   ├── index.html         # Landing page
│   ├── profil.html        # Profile page
│   ├── laporan.html       # Finance reports
│   ├── artikel.html       # Articles
│   ├── dokumentasi.html   # Documentation gallery
│   ├── alumni.html        # Alumni list
│   ├── login.html         # Login page
│   ├── css/
│   │   └── style.css      # Public styles
│   └── js/
│       └── main.js        # Public scripts
│
├── admin/                 # Admin dashboard
│   ├── dashboard.html     # Admin dashboard
│   ├── css/
│   │   └── admin.css      # Admin styles
│   └── js/
│       └── admin.js       # Admin scripts
│
├── uploads/               # Uploaded images
│   └── .gitkeep
│
└── data/                  # JSON database
    └── data.json          # All data storage
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd bumo-smkn1
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

4. **Access the application**
- **Public Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/dashboard.html

### Default Credentials
```
Username: admin
Password: bumo2024
```

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - Login admin

### Reports (Laporan)
- `GET /api/laporan` - Get all reports
- `POST /api/laporan` - Create new report
- `PUT /api/laporan/:id` - Update report
- `DELETE /api/laporan/:id` - Delete report

### Articles (Artikel)
- `GET /api/artikel` - Get all articles
- `POST /api/artikel` - Create new article
- `PUT /api/artikel/:id` - Update article
- `DELETE /api/artikel/:id` - Delete article

### Documentation (Dokumentasi)
- `GET /api/dokumentasi` - Get all documentation
- `POST /api/dokumentasi` - Upload documentation (multipart/form-data)
- `DELETE /api/dokumentasi/:id` - Delete documentation

### Alumni
- `GET /api/alumni` - Get all alumni
- `POST /api/alumni` - Add new alumni
- `PUT /api/alumni/:id` - Update alumni
- `DELETE /api/alumni/:id` - Delete alumni

### Structure (Struktur)
- `GET /api/struktur` - Get organization structure
- `POST /api/struktur` - Add structure member
- `PUT /api/struktur/:id` - Update structure member
- `DELETE /api/struktur/:id` - Delete structure member

## 📊 Initial Data

The system comes with initial dummy data:
- 1 Financial report (Q1 2024)
- 1 Article about entrepreneurship strategies
- 1 Documentation of workshop activity
- 1 Alumni record
- 6 Organization structure members (2024/2025)

## 🛠️ Technologies

### Backend
- **Express.js** - Web framework
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Node.js File System** - JSON file operations

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Financial data visualization
- **Google Fonts (Poppins)** - Typography
- **Pure CSS** - No preprocessors

## 📝 Development Notes

### Adding New Features

1. **Add new API endpoint** in `server.js`
2. **Create UI** in appropriate HTML file
3. **Add JavaScript logic** in `main.js` or `admin.js`
4. **Update data structure** in `data/data.json`

### Customization

**Change Colors**: Edit CSS variables in `public/css/style.css` and `admin/css/admin.css`
```css
:root {
    --primary: #1ABC9C;
    --secondary: #003C8F;
    /* ... */
}
```

**Change Login Credentials**: Modify the authentication logic in `server.js`
```javascript
if (username === 'admin' && password === 'bumo2024') {
    // Change credentials here
}
```

## 🔒 Security Considerations

⚠️ **Important**: This is a demo application with basic authentication.

For production use, implement:
- JWT or session-based authentication
- Password hashing (bcrypt)
- Input validation and sanitization
- Rate limiting
- HTTPS/SSL
- Environment variables for sensitive data
- Database instead of JSON file
- User role management

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify Node.js installation: `node --version`
- Delete `node_modules` and run `npm install` again

### Images not showing
- Check if `uploads` folder exists
- Verify file permissions
- Check browser console for errors

### Data not persisting
- Verify `data` folder exists
- Check `data.json` file permissions
- Ensure server has write access

## 📄 License

This project is for internal use by SMKN 1 Cikarang Selatan.

## 👥 Contributors

- **BUMO Team** - Development and maintenance
- **SMKN 1 Cikarang Selatan** - Institution support

## 📞 Support

For issues or questions, contact:
- Email: bumo@smkn1cikarang.sch.id
- School Office: SMKN 1 Cikarang Selatan

---

**Made with ❤️ by BUMO SMKN 1 Cikarang Selatan**