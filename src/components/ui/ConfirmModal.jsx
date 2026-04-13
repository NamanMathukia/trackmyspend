import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* MOBILE: Bottom Sheet */}
          <motion.div
            className="
              fixed z-50 inset-x-0 bottom-0
              bg-white rounded-t-2xl p-5 space-y-4
              sm:hidden
            "
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-2" />

            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-sm text-slate-600">{description}</p>

            <div className="flex gap-3 pt-3">
              <button
                onClick={onCancel}
                className="flex-1 h-11 rounded-xl border text-sm font-medium"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>

          {/* DESKTOP: Centered Dialog */}
          <motion.div
            className="
              fixed z-50 inset-0
              hidden sm:flex items-center justify-center
            "
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-slate-600">{description}</p>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-sm rounded border"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
