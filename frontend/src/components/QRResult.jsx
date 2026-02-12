import { useCallback, useRef, useState } from "react";

export default function QRResult({ data, onReset }) {
    const qrRef = useRef(null);
    const [imgCopy, setImgCopy] = useState("idle");
    const [urlCopy, setUrlCopy] = useState("idle");

    const fmtSize = (b) => {
        if (b < 1024) return `${b} B`;
        if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
        return `${(b / 1048576).toFixed(1)} MB`;
    };

    const download = useCallback(() => {
        if (!data?.qr_code) return;
        const a = document.createElement("a");
        a.href = data.qr_code;
        a.download = `qr-${(data.filename || "file").replace(/\.pdf$/i, "")}.png`;
        a.click();
    }, [data]);

    const copyImage = useCallback(async () => {
        if (!data?.qr_code) return;
        try {
            const res = await fetch(data.qr_code);
            const blob = await res.blob();
            if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob }),
                ]);
                setImgCopy("ok");
            } else {
                setImgCopy("fail");
            }
        } catch {
            setImgCopy("fail");
        }
        setTimeout(() => setImgCopy("idle"), 2500);
    }, [data]);

    const copyUrl = useCallback(async () => {
        if (!data?.download_url) return;
        try {
            await navigator.clipboard.writeText(data.download_url);
            setUrlCopy("ok");
        } catch {
            const t = document.createElement("textarea");
            t.value = data.download_url;
            document.body.appendChild(t);
            t.select();
            document.execCommand("copy");
            document.body.removeChild(t);
            setUrlCopy("ok");
        }
        setTimeout(() => setUrlCopy("idle"), 2500);
    }, [data]);

    return (
        <div className="text-center anim-pop">
            {/* Success header */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-green)]/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--color-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-1)]">QR Code พร้อมแล้ว!</h3>
            </div>

            {/* QR code */}
            <div className="flex justify-center mb-4">
                <div className="qr-frame anim-glow" ref={qrRef}>
                    <img id="qr-code-image" src={data.qr_code} alt="QR Code" draggable={false} />
                </div>
            </div>

            {/* File badge */}
            <div className="flex justify-center mb-5">
                <div className="badge">
                    <svg className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-[var(--color-text-2)] truncate max-w-[140px]">{data.filename}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-[var(--color-text-3)]" />
                    <span className="text-[var(--color-text-3)]">{fmtSize(data.file_size)}</span>
                </div>
            </div>

            {/* Primary actions */}
            <div className="flex gap-3 justify-center mb-3">
                <button id="download-qr-btn" className="btn btn--primary text-base px-6 py-3" onClick={download}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    ดาวน์โหลด PNG
                </button>

                <button
                    id="copy-qr-btn"
                    className={`btn btn--outline text-base px-6 py-3 ${imgCopy === "ok" ? "btn--success" : imgCopy === "fail" ? "btn--error" : ""}`}
                    onClick={copyImage}
                >
                    {imgCopy === "ok" ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    ) : imgCopy === "fail" ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                    )}
                    {imgCopy === "ok" ? "คัดลอกแล้ว!" : imgCopy === "fail" ? "ล้มเหลว" : "คัดลอกรูป"}
                </button>
            </div>

            {/* Copy URL link */}
            <button id="copy-url-btn" className={`btn btn--ghost mx-auto text-sm px-5 py-2.5 ${urlCopy === "ok" ? "!text-[var(--color-green)]" : ""}`} onClick={copyUrl}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.06a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.25 8.81" />
                </svg>
                {urlCopy === "ok" ? "คัดลอกลิงก์แล้ว!" : "คัดลอกลิงก์ดาวน์โหลด"}
            </button>

            {/* Divider + Reset */}
            <hr className="divider my-5" />
            <button id="upload-another-btn" className="btn btn--ghost mx-auto text-sm px-5 py-2.5" onClick={onReset}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                อัปโหลด PDF อีกไฟล์
            </button>
        </div>
    );
}
