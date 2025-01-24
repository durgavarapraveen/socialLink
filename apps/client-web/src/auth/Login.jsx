import { Card } from "@mui/material";
import { useState } from "react";
import InputField from "../components/InputField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CustomButton from "../components/CustomButton";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { UserService_Backend_URL } from "../../config";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    if (data.email === "") {
      toast.error("Email is required");
      setLoading(false);
      return;
    }

    if (data.password === "") {
      toast.error("Password is required");
      setLoading(false);
      return;
    }

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (data.password.length > 20) {
      toast.error("Password must be at most 20 characters");
      setLoading(false);
      return;
    }

    e.preventDefault();
    try {
      const res = await axios.post(
        `${UserService_Backend_URL}/api/auth/login`,
        data
      );
      console.log(res);
      if (res.status === 200) {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
    setLoading(false);
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          width: {
            xs: "100%",
            sm: "80%",
            md: "60%",
            lg: "40%",
            xl: "30%",
          },
          gap: "1rem",
          padding: "2rem",
          backdropFilter: "blur(10px)",
        }}
      >
        <p className="text-3xl font-bold">Log In</p>
        <div className="flex flex-col gap-2">
          <InputField
            title="Email"
            type="email"
            value={data.email}
            setvalue={(value) => setData({ ...data, email: value })}
            placeholder="Enter your Email"
          />

          <div className="relative w-full">
            <InputField
              title="Password"
              type={showPassword ? "text" : "password"}
              value={data.password}
              setvalue={(value) => setData({ ...data, password: value })}
              placeholder="Enter your Password"
            />
            {data.password.length > 0 ? (
              showPassword ? (
                <VisibilityOffIcon
                  className="absolute top-12 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <VisibilityIcon
                  className="absolute top-12 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )
            ) : (
              ""
            )}
          </div>

          <CustomButton
            type="submit"
            variant="contained"
            fullWidth
            title={"Login"}
            handleSubmit={handleSubmit}
            loading={loading}
            loadingText={"Logging..."}
          />
        </div>
        <div className="flex flex-col gap-5">
          <p>
            Forgot Password?{" "}
            <a href="/forgot-password" className="text-blue-500">
              Reset
            </a>
          </p>
          <p>
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-500">
              Register
            </a>
          </p>
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
}

export default Login;
