import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegUserCircle } from "react-icons/fa";

export default function CheckEmailPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_API_URL}/api/email`;

    try {
      const res = await axios.post(URL, data);
      toast.success(res?.data?.message);

      if (res.data.status) {
        setData({
          email: "",
        });

        navigate("/password", { state: res?.data?.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          <FaRegUserCircle size={80} />
        </div>
        <h3>Welcome to Chat app!</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
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

          <button
            type="submit"
            className="bg-primary text-lg px-4 py-1 shadow-md text-white leading-relaxed tracking-wide hover:bg-secondary rounded mt-2"
          >
            Submit
          </button>

          <p className="my-2 text-center">
            New User ?{" "}
            <Link to={"/register"} className="hover:text-primary font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
