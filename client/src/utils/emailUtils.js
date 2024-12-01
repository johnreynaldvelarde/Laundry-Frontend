// import emailjs from "@emailjs/react-native";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";

export const generateRandomCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendVerificationEmail = async (email, code) => {
  try {
    const serviceID = "service_touybgx";
    const templateID = "template_bq51elm";
    const userID = "_k6BDJLqsr0Y7fz4v";

    const templateParams = {
      to_email: email,
      message: code,
    };

    await emailjs.send(serviceID, templateID, templateParams, userID);
    toast.success("A verification code has been sent to your email.");

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
