
import React, { useState, useCallback } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { useField } from 'payload/components/forms';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageEdit,
  FilePondPluginFileValidateType
);

const FilePondEditor = (props) => {
  const { path } = props;
  const { value, setValue } = useField({ path });
  const [files, setFiles] = useState([]);

  const handleFilePondUpdate = useCallback((fileItems) => {
    setFiles(fileItems.map(fileItem => fileItem.file));
  }, []);

  const handleFilePondAdd = useCallback(async (error, file) => {
    if (error) {
      console.error('FilePond error:', error);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = async () => {
      const base64Data = reader.result;
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: [{ name: file.file.name, data: base64Data }] }),
      });

      if (response.ok) {
        const result = await response.json();
        setValue(result.filePath);
      } else {
        console.error('File upload failed');
      }
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
    };
  }, [setValue]);

  return (
    <div className="FilePondEditor">
      <FilePond
        files={files}
        onupdatefiles={handleFilePondUpdate}
        onaddfile={handleFilePondAdd}
        allowMultiple={true}
        maxFiles={3}
        name="files"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        acceptedFileTypes={['image/*']}
      />
    </div>
  );
};

export default FilePondEditor;
