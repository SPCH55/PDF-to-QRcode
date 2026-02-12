# 📱 PDF to QR Code

Convert your PDF files to QR codes instantly! Upload a PDF and get a scannable QR code that links to your file for easy sharing.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwindcss)

---

## ✨ Features

- 🎯 **Drag & Drop Upload** — Simply drag your PDF file onto the upload zone
- 📱 **QR Code Generation** — Instantly generates a QR code linking to your PDF
- 💾 **Download QR as PNG** — Save the QR code image to share anywhere
- 🔗 **Copy Download URL** — Quick copy the direct download link
- 🎨 **Beautiful UI** — Modern dark theme with glassmorphism and animations
- 📱 **Fully Responsive** — Works perfectly on desktop, tablet, and mobile
- 🛡️ **Error Handling** — User-friendly error messages for all edge cases
- ⏳ **Loading States** — Progress bar and spinner during upload
- 🔒 **Privacy First** — No database, files auto-expire after 1 hour
- 🧹 **Auto Cleanup** — Uploaded files are automatically removed

---

## 🏗️ Tech Stack

| Layer      | Technology       |
|------------|-----------------|
| Frontend   | React 19 + Vite |
| Styling    | Tailwind CSS 4   |
| Backend    | FastAPI (Python) |
| QR Library | qrcode + Pillow  |
| HTTP Client| Axios            |

---

## 📁 Project Structure

```
PDFtoqrcode/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── uploads/             # Temporary PDF storage (auto-created)
├── frontend/
│   ├── public/
│   │   └── vite.svg         # Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx   # App header with logo
│   │   │   ├── DropZone.jsx # Drag & drop upload area
│   │   │   ├── LoadingState.jsx # Upload progress display
│   │   │   ├── QRResult.jsx # QR code result & download
│   │   │   ├── ErrorToast.jsx # Error notifications
│   │   │   └── Footer.jsx   # App footer
│   │   ├── App.jsx          # Main application component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles & design system
│   ├── index.html           # HTML entry point
│   ├── package.json         # Node.js dependencies
│   └── vite.config.js       # Vite configuration
└── README.md                # This file
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Python 3.9+** — [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** — [Download Node.js](https://nodejs.org/)

### 1️⃣ Clone & Navigate

```bash
cd PDFtoqrcode
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: **http://localhost:8000**

### 3️⃣ Frontend Setup

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

The app will be available at: **http://localhost:5173**

---

## 🎯 How to Use

1. Open **http://localhost:5173** in your browser
2. **Drag and drop** a PDF file onto the upload zone (or click to browse)
3. Wait for the upload to complete and QR code to generate
4. **Download** the QR code as a PNG image
5. **Share** the QR code — anyone who scans it can download the PDF!

> ⚠️ **Note:** The download URL points to your local server (`localhost:8000`). For external sharing, ensure your server is accessible from the network, or deploy the application.

---

## 🔌 API Endpoints

| Method   | Endpoint              | Description                    |
|----------|-----------------------|--------------------------------|
| `GET`    | `/api/health`         | Health check                   |
| `POST`   | `/api/upload`         | Upload PDF, returns QR code    |
| `GET`    | `/api/files/{file_id}`| Download a PDF by ID           |
| `DELETE` | `/api/files/{file_id}`| Delete an uploaded PDF         |

### Upload Example

```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@document.pdf"
```

### Response Example

```json
{
  "success": true,
  "file_id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "document.pdf",
  "file_size": 1234567,
  "download_url": "http://localhost:8000/api/files/550e8400-...",
  "qr_code": "data:image/png;base64,...",
  "expires_in": 3600
}
```

---

## ⚙️ Configuration

You can adjust these values in `backend/main.py`:

| Variable       | Default | Description                |
|----------------|---------|----------------------------|
| `MAX_FILE_SIZE`| 10 MB   | Maximum upload file size   |
| `FILE_EXPIRY`  | 3600s   | File expiration time (1hr) |

---

## 🛠️ Development

### Run both servers simultaneously

**Terminal 1 — Backend:**
```bash
cd backend && uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
```

The Vite dev server proxies `/api` requests to the FastAPI backend automatically.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
