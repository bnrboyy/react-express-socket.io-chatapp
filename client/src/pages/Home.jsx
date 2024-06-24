import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout, setUser, setOnlineUsers, setSocketConn } from "../redux/userSlice";
import logo from "../assets/logo.png";
import io from "socket.io-client";

import Sidebar from "../components/Sidebar";

export default function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname === "/";

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_URL}`, {
      auth: {
        token: localStorage.token,
      }
    });

    socket.on("onlineUsers", (data) => {
      dispatch(setOnlineUsers(data));
    });

    dispatch(setSocketConn(socket));

    return () => {
      socket.disconnect();
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const URL = `${import.meta.env.VITE_API_URL}/api/user-details`;
      const res = await axios({
        method: "GET",
        url: URL,
        withCredentials: true,
      });

      if (res.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }

      dispatch(setUser(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    localStorage.token && (
      <div className="grid lg:grid-cols-[320px,1fr] h-screen max-h-screen">
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
          <Sidebar />
        </section>

        {/* message component */}
        <section className={`${basePath && "hidden"}`}>
          <Outlet />
        </section>

        <div className={`${!basePath ? "hidden" : "lg:flex"}flex-col justify-center items-center gap-2 hidden`}>
          <div>
            <img src={logo} width={250} alt="logo" />
          </div>
          <p className="text-lg text-slate-500">Select user to send message.</p>
        </div>
      </div>
    )
  );
}
