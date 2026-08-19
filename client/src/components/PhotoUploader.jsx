import { useRef, useState } from 'react';

export default function PhotoUploader({ onPhotoChange }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onPhotoChange(file);
  }

  function handleRemove() {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="photo-uploader">
      <label className="field-label">Photo Evidence <span className="optional-tag">(optional)</span></label>

      {!preview ? (
        <label className="btn btn-secondary upload-btn">
          📷 Upload or Capture Photo
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            hidden
          />
        </label>
      ) : (
        <div className="photo-preview">
          <img src={preview} alt="Complaint evidence preview" />
          <button type="button" className="btn-link" onClick={handleRemove}>Remove photo</button>
        </div>
      )}
    </div>
  );
}
