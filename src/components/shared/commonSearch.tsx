import React, { FC, ChangeEvent } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import searchIcon from "../assets/images/searchIcon.svg";
import { Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface SearchComponentProps {
  placeholder?: string;
  onSearchChange?: (value: string) => void;
}

const CommonSearch: FC<SearchComponentProps> = ({
  placeholder,
  onSearchChange,
}) => {
  return (
    <TextField
      variant="outlined"
      type="search"
      placeholder={placeholder || "Search anything here..."}
      onChange={(e: any) =>
        onSearchChange
          ? onSearchChange(e.target.value)
          : console.log("search", e.target.value)
      }
      InputProps={{
        endAdornment: (
          <IconButton>
            <Search />
          </IconButton>
        ),
      }}
      sx={{
        width: { sm: "250px", xs: "200px" },
        "& .MuiOutlinedInput-root": {
          borderRadius: "20px",
          // height: "46px"
        },
      }}
    />
  );
};

export default CommonSearch;
