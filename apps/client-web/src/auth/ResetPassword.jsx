import { toast, ToastContainer } from "react-toastify";
import InputField from "../components/InputField";
import { Card } from "@mui/material";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { UserService_Backend_URL } from "../../config";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password === "" || confirmPassword === "") {
      toast.error("Password is required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${UserService_Backend_URL}/api/auth/reset-password`,
        { password, confirmPassword }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        window.location.href = "/login";
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
        <p className="text-3xl font-bold">Reset Password</p>
        <div className="flex flex-col gap-2">
          <InputField
            title="Password"
            type="password"
            value={password}
            setvalue={(value) => setPassword(value)}
            placeholder="Enter your Password"
          />

          <InputField
            title="Confirm Password"
            type="password"
            value={confirmPassword}
            setvalue={(value) => setConfirmPassword(value)}
            placeholder="Confirm Password"
          />

          <CustomButton
            type="submit"
            variant="contained"
            fullWidth
            title={"Reset Password"}
            handleSubmit={handleSubmit}
            loading={loading}
            loadingText={"Resetting Password..."}
          />
        </div>
        <div className="flex flex-col gap-5">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Log In
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

export default ResetPassword;
