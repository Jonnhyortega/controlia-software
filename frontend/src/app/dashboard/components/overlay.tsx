import { motion } from "framer-motion";

function Overlay({ children, fullScreen = false }: { children: React.ReactNode; fullScreen?: boolean }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 top-[-25px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={
          fullScreen
            ? " w-full h-full overflow-y-auto p-6"
            : "rounded-md shadow-xl p-6 max-h-[90vh] overflow-y-auto w-full max-w-lg"
        }
        initial={fullScreen ? { opacity: 0, scale: 0.95 } : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Overlay;