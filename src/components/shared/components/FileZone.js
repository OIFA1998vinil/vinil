import React, { useState } from "react";
import { InputLabel, FormHelperText } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";

export default function FileZone({ initialValue, legend, error, label, helperText, acceptedFiles, onChange = () => { } }) {
  const [value, setValue] = useState();
  return (
    <>
      <InputLabel error={error}>{label}</InputLabel>
      <DropzoneArea
        onChange={(files) => {
          setValue(files);
          onChange(files);
        }}
        dropzoneText={value?.map(item => item.name).join(", ") || legend}
        filesLimit={1}
        showAlerts={false}
        initialFiles={initialValue}
        previewText=""
        showPreviewsInDropzone={false}
        dropzoneClass="drop-zone"
        acceptedFiles={acceptedFiles}
        dropzoneParagraphClass="drop-zone-text"
      />
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </>
  );
}