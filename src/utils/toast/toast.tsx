
// src/utils/toaster.ts
import toast from "react-hot-toast";
import { icons } from "@/utils";
import { JSX } from "react";

type IconType =
  | "success"
  | "edit"
  | "error"
  | "cancel"
  | "warning"
  | "logout"
  | "loading"
  | "delete"
  | "info"

export type ToasterProp = {
  message?: string;
  title?: string;
  icon?: IconType;
  className?: "bg-red-50" | "bg-green-50" | "bg-yellow-50" | "bg-blue-50" | "bg-amber-50";
};

const colorType = {
  "bg-red-50": "!bg-red-400",
  "bg-green-50": "!bg-green-400",
  "bg-yellow-50": "!bg-yellow-400",
  "bg-blue-50": "!bg-blue-400",
  "bg-amber-50": "!bg-amber-400",
}

let activeToast: string[] = [];

const   actionIcon: Record<IconType, JSX.Element> = {
  success: <icons.check className="size-5 text-green-600" />,
  edit: <icons.edit className="size-5 text-blue-600" />,
  error: <icons.alert className="size-5 text-red-600" />,
  cancel: <icons.cancel className="size-5 text-red-600" />,
  warning: <icons.warning className="size-5 text-yellow-600" />,
  logout: <icons.logout className="size-5 text-red-600" />,
  delete: <icons.delete className="size-5 text-red-600" />,
  info: <icons.info className="size-5 text-blue-600" />,
  loading: (
    <icons.loading className="size-5 animate-spin text-blue-600" />
  ),
};



export const toaster = ({
  message,
  title,
  icon = "success",
  className,
}: ToasterProp) => {
  if (activeToast?.length >= 3) {
    const oldToast = activeToast.shift();
    if (oldToast) toast.dismiss(oldToast);
  }
  const toastId = toast.custom(
    (t) => (
      <div
        className={`${t.visible ? "animate-enter" : "animate-leave opacity-0"
          } max-w-sm w-full  ${ icon === "loading" ? "bg-blue-400" : colorType[className || "bg-green-50"] } shadow-xl rounded-xl pointer-events-auto flex ring-1 ring-black/5`}
      >
        <div className="flex-1 flex items-center p-4">
          <div className="flex-shrink-0">
            <div className="p-2.5  rounded-full bg-gray-50 border border-gray-100 shadow-sm">
              {actionIcon[icon] || actionIcon["success"]}
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            {title && (
              <p className="text-sm font-semibold text-white leading-5 mb-1">
                {title}
              </p>
            )}
            {message && (
              <p className="text-sm text-gray-100 leading-5">
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center border-l border-gray-100">
          <button
            onClick={() => toast.dismiss(toastId)}
            className="px-3 py-4 text-sm font-medium text-white  transition-all duration-200 rounded-r-xl"
            aria-label="Close notification"
          >
              <icons.x className="size-4" />
          </button>
        </div>
      </div>
    ),
    {
      position: "top-right",
      duration: icon === "loading" ? Infinity : 10000,
      style: {
        background: 'transparent',
        padding: '16px',
        margin: 0,
        boxShadow: 'none'
      }
    }
  );
  activeToast.push(toastId);
  return toastId;
};