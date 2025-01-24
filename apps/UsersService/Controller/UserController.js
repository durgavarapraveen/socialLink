import supabase from "../../Database/modules/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Skills from "../../Database/modals/SkillsModal.js";

const JWT_SECRET = "social_Link";

export const registerController = async (req, res) => {
  try {
    const data = req.body;

    // check all details
    if (data.first_name.length === 0) {
      return res.status(400).send("First Name is required");
    }

    if (data.last_name.length === 0) {
      return res.status(400).send("Last Name is required");
    }

    if (data.username.length === 0) {
      return res.status(400).send("Username is required");
    }

    if (data.email.length === 0) {
      return res.status(400).send("Email is required");
    }

    if (data.password.length === 0) {
      return res.status(400).send("Password is required");
    }

    if (data.phone_number.length === 0) {
      return res.status(400).send("Phone Number is required");
    }

    // check email
    const email = data.email;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).send("Invalid email format");
    }

    // check phone number
    const phoneNumber = data.phone_number;
    const phoneNumberPattern = /^\d+$/;

    if (!phoneNumberPattern.test(phoneNumber)) {
      return res.status(400).send("Phone Number must contain only digits");
    }

    if (phoneNumber.length !== 10) {
      return res.status(400).send("Phone Number must be exactly 10 digits");
    }

    // check password
    const password = data.password;

    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters");
    }

    if (password.length > 20) {
      return res.status(400).send("Password must be at most 20 characters");
    }

    // check username
    const username = data.username;

    // check if username already exists
    const { data: existingUser, error } = await supabase
      .from("User")
      .select("user_id")
      .or(`username.eq.${username}`)
      .single();

    if (error && error.code !== "PGRST116") {
      // If it's not the "row not found" error, handle it
      console.error("Error checking user existence:", error.message);
      return res.status(500).send("Internal server error");
    }

    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // check if email already exists
    const { data: existingEmail, error: emailError } = await supabase
      .from("User")
      .select("user_id")
      .or(`email.eq.${email}`)
      .single();

    if (emailError && emailError.code !== "PGRST116") {
      // If it's not the "row not found" error, handle it
      console.error("Error checking email existence:", emailError.message);
      return res.status(500).send("Internal server error");
    }

    if (existingEmail) {
      return res.status(400).send("Email already exists");
    }

    // if phone number already exists
    const { data: existingPhoneNumber, error: phoneError } = await supabase
      .from("User")
      .select("user_id")
      .or(`phone_number.eq.${phoneNumber}`)
      .single();

    if (phoneError && phoneError.code !== "PGRST116") {
      // If it's not the "row not found" error, handle it
      console.error(
        "Error checking phone number existence:",
        phoneError.message
      );
      return res.status(500).send("Internal server error");
    }

    if (existingPhoneNumber) {
      return res.status(400).send("Phone Number already exists");
    }

    // if service provider store skills in mongodb
    if (data.service_provider) {
      // store skills in mongodb
      const skills = await Skills.create({ skills: data.skills });

      if (!skills) {
        return res.status(500).send("Internal server error");
      }

      data.skills_id = skills._id;
    }

    // sign up supabase auth
    const { user: signUpUser, error: signUpError } = await supabase.auth.signUp(
      {
        email: data.email,
        password: data.password,
      }
    );

    console.log(data.email, data.password);

    if (signUpError) {
      console.error("Error signing up user:", signUpError.message);
      return res.status(500).send("Internal server error");
    }

    console.log("signUpUser", signUpUser);

    // insert additional details in user table
    const user = {
      user_id: uuidv4(),
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      phone_number: data.phone_number,
      service_provider: data.service_provider,
      skills_id: data.skills_id,
      password: data.password,
    };

    const { data: newUser, error: insertError } = await supabase
      .from("User")
      .insert([user]);

    if (insertError) {
      console.error("Error inserting user:", insertError.message);
      return res.status(500).send("Internal server error");
    }

    return res
      .status(200)
      .send("User registered successfully. Please verify your email to login");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const loginController = async (req, res) => {
  try {
    const data = req.body;

    // Validate input
    if (!data.email || data.email.length === 0) {
      return res.status(400).send("Email is required");
    }

    if (!data.password || data.password.length === 0) {
      return res.status(400).send("Password is required");
    }

    // Check email format
    const email = data.email;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).send("Invalid email format");
    }

    console.log(data.email, data.password);

    // Sign in with Supabase
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error("Error signing in:", error.message);

      // Handle common errors from Supabase
      if (error.message === "Invalid login credentials") {
        return res.status(400).send("Invalid email or password");
      } else if (error.message === "Email not confirmed") {
        return res
          .status(400)
          .send("Please confirm your email before logging in");
      }

      return res.status(500).send("Internal server error");
    }

    // Respond with token and user data
    return res.status(200).send({
      token: signInData.session.access_token,
      user: signInData.user,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send("Internal server error");
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const data = req.body;

    // Validate input
    if (!data.email || data.email.length === 0) {
      return res.status(400).send("Email is required");
    }

    // Check email format
    const email = data.email;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).send("Invalid email format");
    }

    // Send password recovery email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password",
    });

    if (error) {
      console.error("Error sending password recovery email:", error.message);
      return res.status(500).send(error.message);
    }

    return res.status(200).send("Password recovery email sent");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const data = req.body;

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      console.error("Error updating password:", error.message);
      return res.status(500).send("Internal server error");
    }

    return res.status(200).send("Password updated successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
