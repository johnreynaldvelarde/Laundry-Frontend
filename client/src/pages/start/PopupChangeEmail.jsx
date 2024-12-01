import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { COLORS } from "../../constants/color";
import CustomPopHeaderTitle from "../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../components/common/CustomPopFooterButton";
import toast from "react-hot-toast";
import { updateEmailForVerified } from "../../services/api/authClient";

const PopupChangeEmail = ({
  open,
  onClose,
  data_email,
  userDetails,
  refreshData,
}) => {
  const [email, setEmail] = useState(data_email);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email must be a valid format";
    }
    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleUpdateChangeEmail = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const data = {
        email: email,
      };

      try {
        const response = await updateEmailForVerified.putEmailForVerified(
          userDetails.userId,
          data
        );
        if (response.success) {
          refreshData();
          toast.success(response.message);
          onClose();
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: response.message,
          }));
        }
      } catch (error) {
        toast.error(`Error with service request: ${error.message || error}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={"Change Email Address"}
        subtitle={
          "Please enter your new email address below to update your account."
        }
        onClose={onClose}
      />

      <DialogContent>
        <Box mt={1}>
          <TextField
            label="Email"
            placeholder="e.g., example@domain.com"
            variant="outlined"
            fullWidth
            size="small"
            value={email}
            onChange={handleInputChange("email")}
            error={Boolean(errors.email)}
            helperText={errors.email}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Update"}
        onClose={onClose}
        loading={loading}
        onSubmit={handleUpdateChangeEmail}
      />
    </Dialog>
  );
};

export default PopupChangeEmail;
