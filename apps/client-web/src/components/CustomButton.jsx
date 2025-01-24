import { Button } from "@mui/material";

function CustomButton({ title, handleSubmit, loading, loadingText }) {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{
        backgroundColor: "#28231D",
        color: "#fff",
        padding: "0.8rem",
        borderRadius: "0.5rem",
        "&:hover": { backgroundColor: "black" },
        textTransform: "none",
      }}
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? loadingText : title}
    </Button>
  );
}

export default CustomButton;
