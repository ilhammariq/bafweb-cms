import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ActionsMenu({ onEdit, onDelete, onDetail }) {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const btnRef = useRef(null);
    const menuRef = useRef(null);


    const toggleMenu = () => {
        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top,
                left: rect.right - 200,
            });
        }
        setOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                !btnRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        const handleScroll = () => setOpen(false);
        const handleResize = () => setOpen(false);

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleResize);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleResize);
        };
    }, [open]);

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={toggleMenu}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
            >
                <MoreVertical size={18} />
            </button>

            {/* {open && (
                <div
                    ref={menuRef}
                    style={{ position: "fixed", top: coords.top, left: coords.left }}
                    className="w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1"
                >
                    <button
                        onClick={() => {
                            onDetail();
                            setOpen(false);
                        }}
                        className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                        <Eye size={15} />
                        Detail
                    </button>

                    <button
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                        <Pencil size={15} />
                        Edit
                    </button>

                    <div className="my-1 h-px bg-slate-100" />

                    <button
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                        <Trash2 size={15} />
                        Hapus
                    </button>
                </div>
            )} */}
        </>
    );
}