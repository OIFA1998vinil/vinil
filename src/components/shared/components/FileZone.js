/**
 * FileZone component module
 * @module client/components/shared/components/FileZone
 */

import React, { useState } from "react";
import { InputLabel, FormHelperText } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";

/**
 * File zone component
 * @function FileZone
 * @param {File} props.initialValue File zone initial value
 * @param {String} props.legend File zone legend
 * @param {Boolean} props.error Error mode
 * @param {String} props.label File zone label
 * @param {String} props.helperText Field helper text
 * @param {String[]} props.acceptedFiles Mime types accepted for the files
 * @param {Function} props.onChange On change callback
 * @returns {JSX.Element} FileZone component template
 */
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
        maxFileSize={100000000}
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