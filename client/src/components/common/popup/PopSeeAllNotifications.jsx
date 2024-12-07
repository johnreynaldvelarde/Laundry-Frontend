import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import CustomPopHeaderTitle from "../CustomPopHeaderTitle";
import CustomSeeAllNotificationsTable from "../table/CustomSeeAllNotificationsTable";

const PopSeeAllNotifications = ({ open, onClose, data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setFilteredData(data);
      setLoading(false);
    };
    loadData();
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      <CustomPopHeaderTitle
        title={"All Notifications"}
        subtitle={"View all recent notifications."}
        onClose={onClose}
      />
      <DialogContent>
        <CustomSeeAllNotificationsTable
          tableData={filteredData}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PopSeeAllNotifications;
