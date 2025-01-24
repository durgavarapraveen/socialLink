import { Card, Checkbox, FormControl, Modal } from "@mui/material";
import { useState } from "react";
import InputField from "../components/InputField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CustomButton from "../components/CustomButton";
import MultipleSelectAutocomplete from "../components/MultipleSelectAutocomplete";
import { skills } from "../miscellaneous/SkillsList";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { UserService_Backend_URL } from "../../config";

function Register() {
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    service_provider: false,
    skills: [],
    description: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const validateField = (field, fieldName, options = {}) => {
    const {
      required = true,
      minLength,
      maxLength,
      exactLength,
      pattern,
      patternMessage,
    } = options;

    if (required && !field) {
      return `${fieldName} is required`;
    }

    if (minLength && field.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }

    if (maxLength && field.length > maxLength) {
      return `${fieldName} must be at most ${maxLength} characters`;
    }

    if (exactLength && field.length !== exactLength) {
      return `${fieldName} must be exactly ${exactLength} characters`;
    }

    if (pattern && !pattern.test(field)) {
      return patternMessage || `Invalid ${fieldName}`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const errors = [];

    errors.push(
      validateField(data.first_name, "First Name", { maxLength: 20 })
    );
    errors.push(validateField(data.last_name, "Last Name", { maxLength: 20 }));
    errors.push(validateField(data.username, "Username", { maxLength: 20 }));
    errors.push(
      validateField(data.email, "Email", {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: "Invalid email format",
      })
    );
    errors.push(
      validateField(data.phone_number, "Phone Number", {
        exactLength: 10,
        pattern: /^\d+$/,
        patternMessage: "Phone Number must contain only digits",
      })
    );
    errors.push(
      validateField(data.password, "Password", { minLength: 6, maxLength: 20 })
    );

    if (data.service_provider) {
      errors.push(
        validateField(data.description, "Description", {
          minLength: 10,
          maxLength: 100,
        })
      );
      if (data.skills.length === 0) {
        errors.push("Skills are required");
      }
    }

    // Filter out null errors and show toast notifications
    const filteredErrors = errors.filter((error) => error);
    if (filteredErrors.length > 0) {
      filteredErrors.forEach((err) => toast.error(err));
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${UserService_Backend_URL}/api/auth/register`,
        data
      );

      if (res.status === 200) {
        toast.success(res.data);
        setData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          phone_number: "",
          service_provider: false,
          skills: [],
          description: "",
          password: "",
        });
      }

      console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }

    console.log(data);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center my-10">
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
        <p className="text-3xl font-bold">Register</p>
        <form className="flex flex-col gap-2">
          <InputField
            title="First Name"
            type="text"
            value={data.first_name}
            setvalue={(value) => setData({ ...data, first_name: value })}
            placeholder="Enter your First Name"
          />

          <InputField
            title="Last Name"
            type="text"
            value={data.last_name}
            setvalue={(value) => setData({ ...data, last_name: value })}
            placeholder="Enter your Last Name"
          />

          <InputField
            title="Username"
            type="text"
            value={data.username}
            setvalue={(value) => setData({ ...data, username: value })}
            placeholder="Enter your Username"
          />

          <InputField
            title="Email"
            type="email"
            value={data.email}
            setvalue={(value) => setData({ ...data, email: value })}
            placeholder="Enter your Email"
          />

          <InputField
            title="Phone Number"
            type="text"
            value={data.phone_number}
            setvalue={(value) => setData({ ...data, phone_number: value })}
            placeholder="Enter your Phone Number"
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

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Checkbox
              checked={data.service_provider}
              onChange={(e) =>
                setData({ ...data, service_provider: e.target.checked })
              }
            />
            <label onClick={() => setOpenModal(true)}>
              Are you a service provider?
            </label>
          </FormControl>

          {data.service_provider && (
            <div className="flex flex-col gap-2">
              <InputField
                title={"Description"}
                type={"text"}
                value={data.description}
                setvalue={(value) => setData({ ...data, description: value })}
                placeholder={"Enter your Description"}
                multiline
                minRows={4}
              />

              <MultipleSelectAutocomplete
                title={"Skills"}
                options={skills}
                value={data.skills}
                setvalue={(value) => setData({ ...data, skills: value })}
              />
            </div>
          )}

          <CustomButton
            type="submit"
            variant="contained"
            fullWidth
            title={"Register"}
            handleSubmit={handleSubmit}
            loading={loading}
            loadingText={"Registering..."}
          />
        </form>
        <div className="flex flex-col gap-5">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </p>
        </div>
      </Card>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Card
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1.5rem",
            width: "80%",
            maxWidth: "600px",
            boxShadow: 24,
            outline: "none",
          }}
        >
          <h2 className="text-2xl font-bold">What is a Service Provider?</h2>
          <p className="text-lg">
            Service providers are individuals offering services like electrical
            work, plumbing, carpentry, and more to those in need.
          </p>
        </Card>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Register;
