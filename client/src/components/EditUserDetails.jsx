import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Avatar from "./Avatar";
import { uploadFile } from "../helpers/uploadFile";
import Divider from "./Divider";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

export default function EditUserDetails({ onClose, data }) {
  const [userData, setUserData] = useState({
    name: data?.name,
    profile_pic: data?.profile_pic,
  });
  const uploadPhotoRef = useRef();
  const dispath = useDispatch();

  useEffect(() => {}, [userData]);

  const handleOnChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploaded = await uploadFile(file);

    setUserData((prev) => {
      return {
        ...prev,
        profile_pic: uploaded.data?.url,
      };
    });
  };

  const handleOpenUploadPhoto = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const URL = `${import.meta.env.VITE_API_URL}/api/user-update`;
      const res = await axios({
        method: "POST",
        url: URL,
        data: userData,
        withCredentials: true,
      });

      console.log(res.data);

      if (res.data.status) {
        dispath(setUser(res.data.data));
        toast.success(res?.data?.message);
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <p className="font-semibold">Profile Details</p>
        <p className="text-sm">Edit user details</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name: </label>
            <input
              className="w-full py-1 px-2 focus:outline-primary border"
              onChange={handleOnChange}
              type="text"
              name="name"
              id="name"
              value={userData.name}
            />
          </div>
          <div>
            <div>Photo: </div>
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={userData?.profile_pic}
                name={userData.name}
              />
              <label htmlFor="profile_pic">
                <button
                  className="font-semibold"
                  onClick={handleOpenUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <Divider />
          <div className="flex gap-2 w-fit ml-auto mt-3">
            <button
              onClick={onClose}
              className="border-primary border px-4 py-1 rounded hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
