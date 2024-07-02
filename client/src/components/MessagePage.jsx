import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

import { uploadFile } from "../helpers/uploadFile";
import Loading from "./Loading";
import backgroundImage from "../assets/wallapaper.jpeg";

export default function MessagePage() {
  const params = useParams();
  const socketConn = useSelector((state) => state.user.socketConn);
  const user = useSelector((state) => state?.user);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    profile_bg: "",
    online: false,
  });

  const currentMsg = useRef(null);

  useEffect(() => {
    if (currentMsg.current) {
      currentMsg.current.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "end"
      });
    }
  }, [allMessage]);

  useEffect(() => {
    if (socketConn) {
      socketConn.emit("message-page", params.userId);
      socketConn.on("message-user", (data) => {
        setUserData(data);
      });

      socketConn.on("message", (data) => {
        {
          setAllMessage(data);
        }
      });

      socketConn.emit("seen", params.userId);
    }
  }, [socketConn, params?.userId, user]);

  const handleUpload = () => {
    setOpenUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    setLoading(true);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });

    const file = e.target.files[0];
    const uploaded = await uploadFile(file);
    setLoading(false);
    setOpenUpload(false);

    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploaded.data.url,
      };
    });
  };

  const handleUploadVideo = async (e) => {
    setLoading(true);
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
    const file = e.target.files[0];
    const uploaded = await uploadFile(file);
    setLoading(false);
    setOpenUpload(false);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploaded.data.url,
      };
    });
  };

  const handleRemoveImage = async (e) => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
    setOpenUpload(false);
  };

  const handleRemoveVideo = async (e) => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
    setOpenUpload(false);
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;

    setMessage((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.text.toString().trim()) return false;

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConn) {
        socketConn.emit("new-message", {
          senderId: user?._id,
          receiverId: params.userId,
          message: message,
          msgByUserId: user?._id,
        });

        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          {userData && (
            <div>
              <Avatar
                width={50}
                height={50}
                imageUrl={userData.profile_pic}
                name={userData.name}
                userId={userData._id}
                userData={userData}
              />
            </div>
          )}
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
      <div className="w-full h-full relative">
        <section className="scrollbar flex h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll bg-slate-200 bg-opacity-50">
          {/* Show all message */}
          <div
            className="flex flex-col w-full mt-auto gap-2 py-2 mx-2"
            ref={currentMsg}
          >
            {allMessage?.map(
              (msg, index) =>
                (msg.text || msg.imageUrl || msg.videoUrl) && (
                  <div
                    key={index}
                    className={`p-1 py-1 rounded-t-lg w-fit max-w-sm ${
                      user._id === msg.msgByUserId
                        ? "ml-auto bg-teal-100 rounded-bl-lg"
                        : "bg-white rounded-br-lg "
                    }`}
                  >
                    <div className="w-full">
                      {msg?.imageUrl && (
                        <img
                          className="w-full h-full object-scale-down rounded-lg"
                          src={msg.imageUrl}
                        />
                      )}
                    </div>
                    <div className="w-full">
                      {msg?.videoUrl && (
                        <video
                          className="w-full h-full object-scale-down rounded-lg"
                          src={msg.videoUrl}
                          controls
                        />
                      )}
                    </div>
                    <p
                      className={`px-2 break-words ${
                        (msg.imageUrl || msg.videoUrl) && "mt-2"
                      }`}
                    >
                      {msg.text}
                    </p>
                    <p
                      className={`text-xs text-slate-500 ml-auto w-fit ${
                        !msg.text && "mt-1"
                      }`}
                    >
                      {moment(msg.createdAt).format("hh:mm")}
                    </p>
                  </div>
                )
            )}
          </div>
        </section>
        {/* upload image display */}
        {message.imageUrl && (
          <div className="w-full h-full absolute bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <button
              onClick={handleRemoveImage}
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
            >
              <IoClose size={30} />
            </button>
            <div className="bg-white p-3 rounded">
              <img
                className="rounded aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                src={message.imageUrl}
                alt="Upload Image"
              />
            </div>
          </div>
        )}
        {/* upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full absolute bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <button
              onClick={handleRemoveVideo}
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
            >
              <IoClose size={30} />
            </button>
            <div className="bg-white p-3 rounded">
              <video
                className="rounded aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                src={message.videoUrl}
                controls
                autoPlay
                muted
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full absolute bottom-0 flex justify-center items-center bg-black bg-opacity-20">
            <Loading />
          </div>
        )}
      </div>

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
                  accept="image/*"
                  id="uploadImage"
                  onChange={handleUploadImage}
                />
                <input
                  className="hidden"
                  type="file"
                  accept="video/*"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>

        {/* input box  */}
        <div className="h-full w-full">
          <form
            className="w-full h-full flex flex-row items-center gap-2"
            onSubmit={handleSendMessage}
          >
            <input
              className="py-1 px-4 outline-none w-full h-full"
              placeholder="Type a message..."
              type="text"
              name="text"
              value={message.text}
              onChange={handleTextChange}
            />

            <button
              disabled={loading ? true : false}
              type="submit"
              className={`${
                loading
                  ? "pointer-event-none text-gray-200 "
                  : "text-primary hover:text-secondary"
              }`}
            >
              <IoMdSend size={30} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
