import React from "react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { uploadFile } from "../helpers/uploadFile";

export default function RegisterPage() {
  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-blue-200",
    "bg-cyan-200",
    "bg-orange-200",
  ];
  const randomColor = bgColor[Math.floor(Math.random() * bgColor.length)];
  const navigate = useNavigate();
  const [uploadPhoto, setUploadPhoto] = useState("");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
    profile_bg: randomColor,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploaded = await uploadFile(file);
    // console.log("uploaded", uploaded)
    setUploadPhoto(file);

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploaded.data?.url,
      };
    });
  };

  const handleClearPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto(null);
    setData((prev) => {
      return {
        ...prev,
        profile_pic: "",
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_API_URL}/api/register`;

    try {
      const res = await axios.post(URL, data);
      toast.success(res?.data?.message);

      if (res.data.status) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
          profile_bg: randomColor,
        });

        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat app!</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name : </label>
            <input
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleOnChange}
              type="text"
              id="name"
              name="name"
              placeholder="enter your name"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email : </label>
            <input
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              type="email"
              id="email"
              name="email"
              placeholder="enter your email"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password : </label>
            <input
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              type="password"
              id="password"
              name="password"
              placeholder="enter your password"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo :
              <div className="h-14 bg-slate-200 flex justify-center items-center border-2 hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : "Upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              type="file"
              id="profile_pic"
              name="profile_pic"
              onChange={handleUploadPhoto}
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-lg px-4 py-1 shadow-md text-white leading-relaxed tracking-wide hover:bg-secondary rounded mt-2"
          >
            Register
          </button>

          <p className="my-2 text-center">
            Already have account ?{" "}
            <Link to={"/email"} className="hover:text-primary font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
