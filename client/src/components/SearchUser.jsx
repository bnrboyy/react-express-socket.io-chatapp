import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

import UserSearchCard from "./UserSearchCard";
import Loading from "./Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { IoClose } from "react-icons/io5";

function SearchUser({ onClose }) {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      handlerSearchUser();
    }, 500);
    if (search.trim() !== "") {
    }
  }, [search]);

  const handlerSearchUser = async () => {
    const URL = `${import.meta.env.VITE_API_URL}/api/search-user`;
    try {
      const res = await axios.post(URL, {
        search: search,
      });

      console.log(res.data);

      if (res.data?.status) {
        setSearchUser(res.data?.data);
        setLoading(false);
      } else {
        toast.error(res.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/** input search user  */}
        <div className="flex bg-white rounded h-14 overflow-hidden">
          <input
            className="w-full outline-none py-1 h-full px-2"
            type="text"
            placeholder="Search User"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex items-center justify-center">
            <IoSearch size={25} />
          </div>
        </div>

        {/** list user */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {/** no user found */}
          {searchUser.length === 0 && !loading && (
            <div className="flex justify-center items-center h-full">
              <p className="text-lg text-slate-500">No user found</p>
            </div>
          )}
          {/** loading state  */}
          {loading && (
            <p>
              <Loading />
            </p>
          )}

          {searchUser.length > 0 &&
            !loading &&
            searchUser.map((user, index) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))}
        </div>
      </div>

      <div>
        <button
          className="absolute top-0 right-0 mr-2 mt-2 text-2xl lg:text-4xl hover:text-white"
          onClick={onClose}
        >
          <IoClose size={30} />
        </button>
      </div>
    </div>
  );
}

export default SearchUser;
