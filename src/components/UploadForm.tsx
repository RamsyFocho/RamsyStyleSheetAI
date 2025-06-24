import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1024 };
      const compressedFile = await imageCompression(file, options);
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('user-images')
        .upload(filePath, compressedFile);
      if (error) {
        setError('Upload error: ' + error.message);
      } else {
        setSuccess('Image uploaded successfully!');
        setFile(null);
      }
    } catch (err: any) {
      setError('Compression/Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">Upload Image</h2>
      <label htmlFor="upload-image-input" className="block mb-1 font-medium">Select image</label>
      <input id="upload-image-input" type="file" accept="image/*" onChange={handleFileChange} />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
};

export default UploadForm; 