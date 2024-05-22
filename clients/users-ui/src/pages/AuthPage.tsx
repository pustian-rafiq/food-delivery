import { useState } from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';

const AuthPage = ({ setOpen }: { setOpen: (e: boolean) => void }) => {
    const [activeState, setActiveState] = useState("Login");
  return (
    <div
      className="w-full fixed top-0 left-0 h-screen z-50 flex items-center justify-center bg-[#00000027]"
      id="screen"
      //   onClick={handleClose}
    >
      <div className="w-[500px] bg-[#3E4659] rounded shadow-sm p-3">
        {activeState === "Login" && (
          <Login setActiveState={setActiveState} setOpen={setOpen} />
        )}

         {activeState === "Signup" && <Signup setActiveState={setActiveState} />}
        {/* {activeState === "Verification" && (
          <Verification setActiveState={setActiveState} />
        )}
        {activeState === "Forgot-Password" && (
          <ForgotPassword setActiveState={setActiveState} />
        )}  */}
      </div>
    </div>
  );
};

export default AuthPage