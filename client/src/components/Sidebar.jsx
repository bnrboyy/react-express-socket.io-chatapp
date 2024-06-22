import React, { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import { logout } from "../redux/userSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";

export default function Sidebar() {
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const user = useSelector((state) => state?.user);
  const dispath = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/logout`, {
          withCredentials: true,
        })
        .then(() => {
          dispath(logout());
          localStorage.setItem("token", "");
          navigate("/email");
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={25} />
          </NavLink>
          <NavLink
            onClick={() => setOpenSearch(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title="add friend"
          >
            <FaUserPlus size={25} />
          </NavLink>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            className="mx-auto"
            onClick={() => setEditUserOpen(true)}
            title={user.name}
          >
            <Avatar
              width={40}
              height={40}
              name={user.name}
              imageUrl={user.profile_pic}
            />
          </button>
          <button
            onClick={handleLogout}
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title="logout"
          >
            <span className="-ml-2">
              <TbLogout2 size={25} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <p className="text-xl font-bold p-4 text-slate-800">Message</p>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-scroll scrollbar">
          {allUser.length === 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}
        </div>
      </div>

      {/** edit user details */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} data={user} />
      )}

      {/** search bar */}
      { openSearch && (
        <SearchUser onClose={() => setOpenSearch(false)} />
      ) }
    </div>
  );
}
