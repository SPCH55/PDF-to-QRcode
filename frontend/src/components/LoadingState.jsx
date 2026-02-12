export default function LoadingState({ filename, progress }) {
    return (
        <div className="text-center py-6 anim-pop">
            {/* Spinner */}
            <div className="flex justify-center mb-5">
                <div className="relative w-10 h-10">
                    <div className="spinner" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--color-accent)]">
                        {progress}%
                    </span>
                </div>
            </div>

            <p className="text-lg font-semibold text-[var(--color-text-1)] mb-1">
                {progress < 100 ? "กำลังอัปโหลด…" : "กำลังสร้าง QR Code…"}
            </p>

            {filename && (
                <div className="badge mx-auto mb-4 max-w-[240px]">
                    <svg className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-xs text-[var(--color-text-2)] truncate">{filename}</span>
                </div>
            )}

            <div className="max-w-[220px] mx-auto">
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.max(progress, 5)}%` }} />
                </div>
                <p className="text-[11px] text-[var(--color-text-3)] mt-2">กรุณารอสักครู่…</p>
            </div>
        </div>
    );
}
