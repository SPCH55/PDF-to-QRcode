import { useEffect, useState } from "react";

export default function ErrorToast({ message, onDismiss }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setShow(true));
        const t = setTimeout(() => {
            setShow(false);
            setTimeout(onDismiss, 250);
        }, 6000);
        return () => clearTimeout(t);
    }, [onDismiss]);

    const dismiss = () => {
        setShow(false);
        setTimeout(onDismiss, 250);
    };

    return (
        <div
            id="error-toast"
            className={`toast toast--error mb-4 transition-all duration-250 ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
            role="alert"
        >
            <svg className="w-4 h-4 text-[var(--color-red)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className="flex-1 text-sm">{message}</span>
            <button onClick={dismiss} className="shrink-0 text-[var(--color-red)] hover:text-red-300 transition-colors cursor-pointer" aria-label="ปิด">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
