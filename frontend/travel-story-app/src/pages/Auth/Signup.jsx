import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address!");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //signup api call

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      //handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An exception occured , please try again!");
      }
    }
  };
  return (
    <div className=" h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className=" w-2/4 h-[90vh] flex items-end bg-signup-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className=" text-5xl text-white font-semibold leading-[58px]">
              Join the <br /> adventure
            </h4>
            <p className=" text-[15px] text-white leading-6 pr-7 mt-4">
              Create an account to start documenting your travel and preserving
              your memories in your personal travel journal.
            </p>
          </div>
        </div>
        <div className=" w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignup}>
            <h4 className=" text-2xl font-semibold mb-7">Signup</h4>
            <input
              type="text"
              placeholder="FullName"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={""}
            />
            {error && <p className=" text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              SIGNUP
            </button>
            <p className=" text-xs text-slate-500 text-center my-4">OR</p>
            <button
              className="btn-primary btn-light"
              type="submit"
              onClick={() => {
                navigate("/login");
              }}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
