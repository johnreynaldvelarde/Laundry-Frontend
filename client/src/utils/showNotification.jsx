import toast from "react-hot-toast";
import logo from "../assets/images/logo.png";
import { COLORS } from "../constants/color";
import { motion } from "framer-motion";

const showNotification = ({
  message,
  title,
  type = "info",
  autoClose = 5000,
}) => {
  toast.custom(
    (t) => (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white shadow-2xl rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-16 w-16 rounded-full"
                src={logo}
                alt="User Avatar"
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#5787C8] hover:text-[#5787C8] focus:outline-none focus:ring-2 focus:ring-[#5787C8]"
          >
            Close
          </button>
        </div>
      </motion.div>
    ),
    {
      duration: autoClose,
      style: {
        background: type === "error" ? "#f44336" : "#4CAF50",
        color: "white",
      },
      icon: type === "error" ? "❌" : "✅",
      position: "bottom-right",
    }
  );
};

export default showNotification;
