import React from "react";
import defaultImage from "../../assets/images/default_user.png";

const UserImage = ({ avatar_link }) => {
  const imageSrc = avatar_link ? avatar_link : defaultImage;
  return (
    <div className="border-2 border-[#5787C8] p-0.5 rounded-full">
      <span className="userImage flex w-[40px] h-[40px] overflow-hidden">
        <img
          src={imageSrc}
          alt="User Avatar"
          className="w-[100%] h-[100%] object-cover"
        />
      </span>
    </div>
  );
};

export default UserImage;
