import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "./cards/ProfileInfo";

const Navbar = ({ userInfo }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className=" bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <h1 className=" italic">
        Travel <span className=" text-2xl text-green-600">Story</span>
      </h1>
      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

export default Navbar;
