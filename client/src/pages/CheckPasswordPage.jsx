import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegUserCircle } from "react-icons/fa";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";

export default function CheckPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    userId: "",
    password: "",
  });

  useEffect(() => {
    if (!location?.state?.name) navigate("/email");
    setData((prev) => {
      return {
        ...prev,
        userId: location?.state?._id,
      };
    });
  }, [location]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_API_URL}/api/password`;

    try {
      const res = await axios({
        method: "POST",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });
      toast.success(res?.data?.message);

      if (res.data.status) {
        dispatch(setToken(res?.data?.token));
        localStorage.setItem("token", res?.data?.token);

        setData({
          userId: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex flex-col justify-center items-center">
          {/* <FaRegUserCircle size={80} /> */}
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <p className="font-semibold text-lg mt-1">{location?.state?.name}</p>
        </div>
        <h3>Welcome to Chat app!</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
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

          <button
            type="submit"
            className="bg-primary text-lg px-4 py-1 shadow-md text-white leading-relaxed tracking-wide hover:bg-secondary rounded mt-2"
          >
            Login
          </button>

          <p className="my-2 text-center">
            <Link
              to={"/forgot-password"}
              className="hover:text-primary font-semibold"
            >
              Forgot password ?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
