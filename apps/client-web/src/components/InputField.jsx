import { FormControl, FormLabel, TextField } from "@mui/material";

function InputField({ value, setvalue, placeholder, title, type }) {
  return (
    <FormControl
      sx={{
        width: "100%",
        "& label": { fontWeight: "bold" },
        "& input": { padding: "0.8rem", borderRadius: "0.5rem" },
      }}
    >
      <FormLabel>{title}</FormLabel>
      <TextField
        type={type}
        required
        value={value}
        onChange={(e) => setvalue(e.target.value)}
        placeholder={placeholder}
        sx={{
          "& input": {
            padding: "0.8rem",
            borderRadius: "0.5rem",
            border: "0",
            outline: "none",
            ...(type === "password" ? { paddingRight: "2.5rem" } : {}),
          },
          "& label": { padding: "0.5rem", fontWeight: "bold" },
          "& input:focus": { outline: "none" },
          ".css-quhxjy-MuiInputBase-root-MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
            backgroundColor: "#f3f4f6",
          },
        }}
        fullWidth
        {...(title === "Description" && {
          multiline: true,
          minRows: 4,
        })}
      />
    </FormControl>
  );
}

export default InputField;
