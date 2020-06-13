import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

export default function MultiSelect({
  label = "",
  options = [],
  value = [],
  onChange = () => { },
  error = false,
  helperText = ""
}) {
  const handleChange = event => onChange(event.target.value);
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="mutiple-checkbox-label" error={error}>
        {label}
      </InputLabel>
      <Select
        labelId="mutiple-checkbox-label"
        label={label}
        multiple
        fullWidth
        error={error}
        helperText={helperText}
        value={value}
        onChange={handleChange}
        renderValue={selected => selected.join(", ")}
      >
        {options.map(name => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={value.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
}
