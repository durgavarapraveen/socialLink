import { Autocomplete, FormControl, FormLabel, TextField } from "@mui/material";

function MultipleSelectAutocomplete({ title, options, value, setvalue }) {
  return (
    <FormControl
      sx={{
        width: "100%",
        "& label": { fontWeight: "bold" },
        "& input": { padding: "0.8rem", borderRadius: "0.5rem" },
      }}
    >
      <FormLabel>{title}</FormLabel>
      <Autocomplete
        disablePortal
        options={options}
        renderInput={(params) => (
          <TextField {...params} placeholder="Select your skills" />
        )}
        multiple
        value={value}
        onChange={(e, value) => setvalue(value)}
      />
    </FormControl>
  );
}

export default MultipleSelectAutocomplete;
