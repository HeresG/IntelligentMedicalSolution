import {
  Box,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import SearchIcon from "@mui/icons-material/Search";

export const SearchBar = () => {
  const formik = useFormik({
    initialValue: {
      search: "",
    },
    onSubmit: (value) => {
    },
  });
  return (
    <TextField
      variant="outlined"
      sx={{
        backgroundColor: "#FFFFFF80",
        borderRadius: 5,
        outline: "none",
        margin: 0,  
        border: "none",
        input: {
          color: "#000",
        },
        '&:focus':{
            border: 'none',
            outline: 'none'
        },
        "& fieldset": { border: 'none' }
      }}
      placeholder="Cauta..."
      fullWidth
      margin="normal"
      {...formik.getFieldProps("search")}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#ffffff" }} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
