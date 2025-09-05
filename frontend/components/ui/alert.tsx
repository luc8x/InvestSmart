"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

interface AlertProps {
  message: string;
  type?: "error" | "success" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

const typeStyles = {
  error: {
    bg: "bg-red-600",
    icon: <AlertCircle className="w-5 h-5 mr-2" />,
  },
  success: {
    bg: "bg-green-600",
    icon: <CheckCircle className="w-5 h-5 mr-2" />,
  },
  info: {
    bg: "bg-blue-600",
    icon: <Info className="w-5 h-5 mr-2" />,
  },
  warning: {
    bg: "bg-yellow-500 text-black",
    icon: <AlertTriangle className="w-5 h-5 mr-2" />,
  },
};

export default function Alert({
  message,
  type = "info",
  onClose,
}: AlertProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setClosing(true), 3300);
    return () => clearTimeout(timer);
  }, [3300]);

  useEffect(() => {
    if (closing) {
      const fadeOut = setTimeout(onClose, 300);
      return () => clearTimeout(fadeOut);
    }
  }, [closing, onClose]);

  const style = typeStyles[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4 transition-all duration-300 transform ${
        style.bg
      } ${closing ? "opacity-0 translate-x-5" : "opacity-100 translate-x-0"}`}
    >
      <div className="flex items-center">
        {style.icon}
        <span className="text-sm">{message}</span>
      </div>
      <button
        onClick={() => setClosing(true)}
        aria-label="Fechar alerta"
        className="hover:opacity-75"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
