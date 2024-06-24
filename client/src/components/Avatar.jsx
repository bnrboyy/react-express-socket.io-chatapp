import React, { useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Avatar({
  userId = null,
  name,
  imageUrl,
  width,
  height,
}) {
  const onlineUsers = useSelector((state) => state?.user?.onlineUsers);
  let avatarName = "";

  if (name) {
    const splitName = name?.split(" ");

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-blue-200",
    "bg-cyan-200",
    "bg-sky-200",
  ];

  const randomColor = bgColor[Math.floor(Math.random() * bgColor.length)];
  const isOnline = onlineUsers?.includes(userId);

  return (
    <div
      style={{ width: width + "px", height: height + "px" }}
      className={`text-slate-800 rounded-full font-bold relative`}
    >
      {imageUrl ? (
        <img
          className="overflow-hidden rounded-full"
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={`overflow-hidden rounded-full shadow text-xl flex justify-center items-center ${randomColor}`}
        >
          {avatarName}
        </div>
      ) : (
        <FaRegUserCircle size={width} />
      )}

      {isOnline && <div className="bg-green-500 p-1 border-2 border-slate-50 absolute bottom-2 -right-1 z-10 rounded-full"></div>}
    </div>
  );
}
