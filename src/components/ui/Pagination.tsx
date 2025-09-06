import { ReactNode } from "react";
import cn from "classnames";

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
};

export default function Modal({
  open,
  title,
  children,
  onClose,
  size = "sm",
}: Props) {
  if (!open) return null;

  const sizeCls =
    size === "lg" ? "max-w-3xl" : size === "md" ? "max-w-xl" : "max-w-md";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className={cn("w-full rounded-2xl bg-white p-6 shadow-lg", sizeCls)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
