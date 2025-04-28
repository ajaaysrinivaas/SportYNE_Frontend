"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Icon } from "@iconify/react";

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.from(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
          <Icon icon="mdi:alert-circle-outline" />
          {title}
        </h2>
        <p className="mb-6 dark:text-gray-300">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-200 flex items-center gap-1"
          >
            <Icon icon="mdi:cancel" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-1"
          >
            <Icon icon="mdi:check" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
