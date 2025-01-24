import { Card } from "@mui/material";
import { useState } from "react";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { UserService_Backend_URL } from "../../config";

function ForgotPassword() {
  const [data, setData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (data.email === "") {
      toast.error("Email is required");
      setLoading(false);
      return;
    }

    e.preventDefault();
    try {
      const res = await axios.post(
        `${UserService_Backend_URL}/api/auth/forgot-password`,
        data
      );

      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
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
        <p className="text-3xl font-bold">Forgot Password</p>
        <div className="flex flex-col gap-2">
          <InputField
            title="Email"
            type="email"
            value={data.email}
            setvalue={(value) => setData({ ...data, email: value })}
            placeholder="Enter your Email"
          />

          <CustomButton
            type="submit"
            variant="contained"
            fullWidth
            title={"Reset Password"}
            handleSubmit={handleSubmit}
            loading={loading}
            loadingText={"Sending Email..."}
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

export default ForgotPassword;
