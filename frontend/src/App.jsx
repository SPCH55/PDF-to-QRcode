import { useState, useCallback } from "react";
import DropZone from "./components/DropZone";
import LoadingState from "./components/LoadingState";
import QRResult from "./components/QRResult";
import ErrorToast from "./components/ErrorToast";
import axios from "axios";

function App() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const clearError = useCallback(() => setError(null), []);

    const handleUpload = useCallback(async (selectedFile) => {
        if (!selectedFile) return;
        if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
            setError("กรุณาอัปโหลดเฉพาะไฟล์ PDF เท่านั้น");
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError("ไฟล์มีขนาดใหญ่เกินไป ขนาดสูงสุดคือ 10 MB");
            return;
        }
        if (selectedFile.size === 0) {
            setError("ไฟล์ที่อัปโหลดว่างเปล่า");
            return;
        }

        setFile(selectedFile);
        setError(null);
        setResult(null);
        setLoading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    setProgress(Math.round((e.loaded * 100) / (e.total || 1)));
                },
            });
            if (response.data.success) {
                setResult(response.data);
            } else {
                setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            }
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.message ||
                "อัปโหลดไม่สำเร็จ เซิร์ฟเวอร์ทำงานอยู่หรือไม่?"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const handleReset = useCallback(() => {
        setFile(null);
        setResult(null);
        setError(null);
        setLoading(false);
        setProgress(0);
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Ambient orbs */}
            <div className="orb orb--purple" />
            <div className="orb orb--pink" />

            {/* Page */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-10">
                {/* Brand */}
                <div className="text-center mb-8 anim-slide-up">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[#a78bfa] mb-4 anim-float shadow-lg shadow-[var(--color-accent-glow)]">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-accent)] via-[#a78bfa] to-[var(--color-accent-pink)] bg-clip-text text-transparent">
                        แปลง PDF เป็น QR Code
                    </h1>
                    <p className="text-sm text-[var(--color-text-2)] mt-1.5 max-w-sm mx-auto">
                        อัปโหลด PDF แล้วรับ QR Code สำหรับสแกนทันที
                    </p>
                </div>

                {/* Card */}
                <div className="w-full max-w-md anim-slide-up" style={{ animationDelay: "0.1s" }}>
                    {error && <ErrorToast message={error} onDismiss={clearError} />}

                    <div className="card p-6 sm:p-8">
                        {!loading && !result && <DropZone onFileSelect={handleUpload} />}
                        {loading && <LoadingState filename={file?.name} progress={progress} />}
                        {result && <QRResult data={result} onReset={handleReset} />}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center anim-slide-up" style={{ animationDelay: "0.2s" }}>
                    <div className="flex items-center justify-center gap-3 text-[11px] text-[var(--color-text-3)]">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)]" />
                            ไม่มีวันหมดอายุ
                        </span>
                        <span className="w-0.5 h-0.5 rounded-full bg-[var(--color-text-3)]" />
                        <span>ไม่ใช้ฐานข้อมูล</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-[var(--color-text-3)]" />
                        <span>ปลอดภัย</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
