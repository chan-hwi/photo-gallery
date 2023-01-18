import {
  Autocomplete,
  createFilterOptions,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Typography
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import { useEffect, useMemo, useCallback, useState } from "react";
import { axiosInstance as api } from "../apis";

const filter = createFilterOptions();

const initialTagFormData = { title: '', description: '' };

function DetailedSearchForm({ creatable, value, setValue }) {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState(initialTagFormData);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleSubmit = useCallback(e => {
    e.preventDefault();

    setValue(value => [...value, newTag]);
    setOpen(false);

    setNewTag(initialTagFormData);
  }, [newTag, setValue]);

  const handleChange = useCallback((e, newValue) => {
    const added = newValue.find((v) => v.dummy);
    if (!added) return setValue(newValue);

    setOpen(true);
    setNewTag({ title: added.inputValue, description: '' });
  }, [setValue]);

  const fetchOptions = useMemo(
    () =>
      debounce((keyword, cb) => {
        api
          .get(`/tags?keyword=${keyword}&cnt=20`)
          .then((res) => res.data)
          .then(cb);
      }, 200),
    []
  );

  useEffect(() => {
    let active = true;

    fetchOptions(inputValue, (options) => {
      if (active) {
        setOptions(options);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetchOptions]);

  return (
    <>
      <Autocomplete
        multiple
        value={value}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        filterSelectedOptions
        noOptionsText="No tags"
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (!creatable) return filtered;
          
          const isExisting = options.some((option) => params.inputValue === option.title);
          if (params.inputValue !== "" && !isExisting && !value.find(v => v.title === params.inputValue)) {
            filtered.push({
              dummy: true,
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        onChange={handleChange}
        onInputChange={(e, newValue) => setInputValue(newValue)}
        options={options}
        renderInput={(params) => (
          <TextField {...params} label="Tags" fullWidth />
        )}
        fullWidth
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add new tag</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DialogContentText mb={2}>
              <Typography>Add your new tag with a short description below</Typography>
            </DialogContentText>
            <TextField
              autoFocus
              value={newTag.title}
              onChange={(e) =>
                setNewTag({
                  ...newTag,
                  title: e.target.value,
                })
              }
              label="title"
              variant="standard"
              required
              fullWidth
            />
            <TextField
              value={newTag.year}
              onChange={(e) =>
                setNewTag({
                  ...newTag,
                  description: e.target.value,
                })
              }
              label="description"
              variant="standard"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default DetailedSearchForm;
