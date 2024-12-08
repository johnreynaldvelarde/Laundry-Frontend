import React, { useCallback, useState, useEffect } from "react";
import useFetchData from "./useFetchData";
import { getNotificationsList } from "../../services/api/customerApi";
import useSocket from "./useSocket";
import { getListAdminUserNotifications } from "../../services/api/getApi";
import showNotification from "../../utils/showNotification";

const useNavbarData = ({ userDetails }) => {
  const { socket } = useSocket(userDetails); // Ensure that socket is correctly initialized
  const [loading, setLoading] = useState(true);
  const { data: notifications, fetchData: fetchNotifications } = useFetchData();

  const fetchNotificationsData = useCallback(async () => {
    if (!userDetails || !userDetails.roleName) {
      return;
    }

    setLoading(true);

    const isCustomer = userDetails.roleName === "Customer";
    const id = isCustomer ? userDetails.userId : userDetails.storeId;
    const fetchFn = isCustomer
      ? getNotificationsList.getNotifications
      : getListAdminUserNotifications.getAdminUserNotifications;

    await fetchNotifications(fetchFn, id);

    setLoading(false);
  }, [
    fetchNotifications,
    userDetails.roleName,
    userDetails.userId,
    userDetails.storeId,
  ]);

  useEffect(() => {
    if (userDetails && socket) {
      const notificationsHandler = (data) => {
        fetchNotificationsData();
        showNotification({
          message: data.message,
          title: data.title,
        });
      };

      socket.on("notificationsModule", notificationsHandler);
      socket.on("notificationsModuleForCustomer", notificationsHandler);

      return () => {
        socket.off("notificationsModule", notificationsHandler);
        socket.off("notificationsModuleForCustomer", notificationsHandler);
      };
    }
  }, [socket, userDetails, fetchNotificationsData]);

  return { loading, fetchNotificationsData, notifications };
};

export default useNavbarData;

// socket.emit("register", {
//   userId: userDetails.userId,
//   storeId: userDetails.storeId,
//   userType: userDetails.roleName,
// });

// socket.on("registerSuccess", (data) => {
//   console.log("Server response:", data.message);
// });

// socket.off("registerSuccess");
