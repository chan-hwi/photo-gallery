import { useState } from "react";
import { TextField, Autocomplete } from "@mui/material";

function DetailedSearchForm() {
  const [value, setValue] = useState([]);  

  return (
      <Autocomplete 
        multiple
        value={value}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        filterSelectedOptions
        onChange={(e, newValue) => setValue(value => {
          console.log("new value", newValue);
          return newValue;
        })}
        options={[{ 'label': '1' }, { 'label': '2' }, { 'label': '3' }]}
        getOptionLabel={(option) => option.label}
        renderInput={params => <TextField {...params} label='Tags' fullWidth />}
        fullWidth
      />
  );
}

export default DetailedSearchForm;
