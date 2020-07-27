/**
 * MultiSelect component module
 * @module client/components/shared/components/MultiSelect
 */

import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

/**
 * Multi select component
 * @function MultiSelect
 * @param {File} props.initialValue File zone initial value
 * @param {String[]} props.options Options
 * @param {Boolean} props.error Error mode
 * @param {String} props.label File zone label
 * @param {String} props.helperText Field helper text
 * @param {Function} props.onChange On change callback
 * @returns {JSX.Element} MultiSelect component template
 */
export default function MultiSelect({ label = "", options = [], value = [], onChange = () => { }, error = false, helperText = "" }) {
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
