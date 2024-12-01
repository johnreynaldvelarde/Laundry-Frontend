import { axiosPrivate } from "./axios";

export const checkCustomerDetails = {
  getCheckCustomerDetails: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `customers/${id}/check-customer-details-web`
      );

      if (response.data.success) {
        return response.data;
        // const { storeIdIsNull, addressIdIsNull, isVerified } = response.data;
        // return { storeIdIsNull, addressIdIsNull, isVerified };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: "Failed to check customer details" };
    }
  },
};
