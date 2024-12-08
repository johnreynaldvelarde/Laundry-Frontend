import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import CustomPopHeaderTitle from "../CustomPopHeaderTitle";
import { COLORS } from "../../../constants/color";
import total_service_request from "../../../assets/gif/total_service_request.gif";
import canceled_service_request from "../../../assets/gif/canceled_service_request.gif";
import { updateNotificationOneByOne } from "../../../services/api/putApi";

const notificationIcons = {
  "Request By Customer": total_service_request,
  "Canceled By Customer": canceled_service_request,
};

const getNotificationIcon = (notificationType) => {
  return (
    notificationIcons[notificationType] || "https://via.placeholder.com/60"
  );
};

const PopOneByOneNotifications = ({ open, onClose, data, refreshData }) => {
  const [loading, setLoading] = useState(true);
  const [notificationDetails, setNotificationDetails] = useState(null);

  useEffect(() => {
    if (open && data) {
      setLoading(false);
      setNotificationDetails(data);
    }
  }, [open, data]);

  const handleClose = async () => {
    try {
      if (notificationDetails?.id) {
        await clearOneByOneNotifications();
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
    refreshData();
    onClose();
  };

  const clearOneByOneNotifications = async () => {
    if (!notificationDetails) return;
    try {
      const response =
        await updateNotificationOneByOne.putUpdateNotificationOneByOne(
          notificationDetails.id
        );
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // To show AM/PM
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      <CustomPopHeaderTitle
        title="Notification Details"
        onClose={handleClose}
      />
      <Box sx={{ padding: 3 }}>
        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", padding: "20px" }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <DialogContent>
            <Box sx={{ textAlign: "center", marginBottom: 5 }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: COLORS.background,
                  margin: "0 auto 10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={getNotificationIcon(
                    notificationDetails?.notification_type
                  )}
                  alt={
                    notificationDetails?.notification_type ||
                    "Notification Icon"
                  }
                  style={{
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: COLORS.secondary }}
              >
                {notificationDetails?.notification_type}
              </Typography>
            </Box>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: COLORS.text }}
              >
                Message
              </Typography>
              <Typography
                sx={{ fontSize: "1rem", color: "#555", lineHeight: 1.6 }}
              >
                {notificationDetails?.notification_description}
              </Typography>
            </Box>
            <Divider sx={{ marginY: 2 }} />
            <Box sx={{ paddingBottom: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: COLORS.text }}
              >
                Date & Time
              </Typography>
              <Typography
                sx={{ fontSize: "1rem", color: "#555", lineHeight: 1.6 }}
              >
                {formatDateTime(notificationDetails?.created_at)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
              <Button
                onClick={handleClose}
                variant="contained"
                sx={{
                  borderRadius: 12,
                  backgroundColor: COLORS.secondary,
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: COLORS.secondaryHover,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                Close
              </Button>
            </Box>
          </DialogContent>
        )}
      </Box>
    </Dialog>
  );
};

export default PopOneByOneNotifications;
