import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import { uploadFile } from "../helpers/uploadFile";

export default function MessagePage() {
  const params = useParams();
  const socketConn = useSelector((state) => state.user.socketConn);
  const user = useSelector((state) => state?.user);
  const [openUpload, setOpenUpload] = useState(false);
  const [message, setmessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });

  useEffect(() => {
    if (socketConn) {
      socketConn.emit("message-page", params.userId);

      socketConn.on("message-user", (data) => {
        setUserData(data);
      });
    }
  }, [socketConn, params?.userId, user]);

  const handleUpload = () => {
    setOpenUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const uploaded = await uploadFile(file);
    console.log(uploaded);

    setmessage((prev) => {
      return {
        ...prev,
        imageUrl: uploaded.data.url,
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    const uploaded = await uploadFile(file);

    setmessage((prev) => {
      return {
        ...prev,
        videoUrl: uploaded.data.url,
      };
    });
  };

  const handleRemoveImage = async (e) => {
    setmessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
    setOpenUpload(false)
  };

  return (
    <div>
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              src={userData.profile_pic}
              name={userData.name}
              userId={userData._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {userData?.name}
            </h3>
            <p className="-my-2 text-sm">
              {userData.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>

        <div className="">
          <button className="cursor-pointer hover:text-primary">
            <BsThreeDotsVertical />
          </button>
        </div>
      </header>

      {/* message component */}
      <section className="scrollbar h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll">
        {/* upload image display */}
        {message.imageUrl && (
          <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div className="bg-white p-3 rounded">
              <button onClick={handleRemoveImage} className="p-2 absolute top-[306px] right-[205px] z-10 hover:text-white cursor-pointer">
                <IoClose size={30} />
              </button>
              <img
                className="rounded"
                src={message.imageUrl}
                width={300}
                height={300}
                alt="Upload Image"
              />
            </div>
          </div>
        )}
        Show all message
      </section>

      {/* send message component */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={handleUpload}
            className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-primary hover:text-white"
          >
            <FaPlus
              className={`transform transition-transform duration-300 ${
                openUpload ? " rotate-[135deg]" : " rotate-0"
              }`}
              size={20}
            />
          </button>
          {/* video and image */}
          {openUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center rounded p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center rounded p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  className="hidden"
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                />
                <input
                  className="hidden"
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
