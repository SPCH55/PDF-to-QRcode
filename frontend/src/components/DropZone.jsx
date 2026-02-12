import { useState, useRef, useCallback } from "react";

export default function DropZone({ onFileSelect }) {
    const [active, setActive] = useState(false);
    const inputRef = useRef(null);

    const onDragOver = useCallback((e) => { e.preventDefault(); setActive(true); }, []);
    const onDragLeave = useCallback((e) => { e.preventDefault(); setActive(false); }, []);
    const onDrop = useCallback((e) => {
        e.preventDefault();
        setActive(false);
        if (e.dataTransfer.files.length) onFileSelect(e.dataTransfer.files[0]);
    }, [onFileSelect]);

    const onClick = () => inputRef.current?.click();
    const onChange = (e) => {
        if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
        e.target.value = "";
    };

    return (
        <div
            id="drop-zone"
            className={`dropzone p-8 sm:p-10 text-center flex flex-col items-center justify-center ${active ? "dropzone--active" : ""}`}
            onClick={onClick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            aria-label="อัปโหลดไฟล์ PDF"
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
        >
            {/* Icon */}
            <div className="mb-4 mx-auto w-16 aspect-square rounded-full bg-[var(--color-dark-700)] border border-[var(--color-border)] flex items-center justify-center">
                <svg
                    className={`w-7 h-7 transition-colors ${active ? "text-[var(--color-accent)]" : "text-[var(--color-text-3)]"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
            </div>

            <p className="text-lg font-semibold text-[var(--color-text-1)] mb-1">
                {active ? "วางไฟล์ตรงนี้เลย!" : "ลากไฟล์ PDF มาวางที่นี่"}
            </p>
            <p className="text-sm text-[var(--color-text-2)] mb-3">
                หรือ <span className="text-[var(--color-accent)] font-medium underline underline-offset-2 decoration-[var(--color-accent)]/30 cursor-pointer">เลือกไฟล์</span>
            </p>
            <p className="text-xs text-[var(--color-text-3)]">รองรับเฉพาะ PDF • ขนาดไม่เกิน 10 MB</p>

            <input ref={inputRef} id="file-input" type="file" accept=".pdf,application/pdf" className="hidden" onChange={onChange} />
        </div>
    );
}
