import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../../context/ModalProvider';
import Header from '../../../../Components/Add/Header';
import FormActions from '../../../../Components/Add/FormActions';
import FormField from '../../../../Components/TextEditor/FormField';
import DocumentUploader from '@/Components/TextEditor/DocumentUploader';

const FileInput = memo(({ label, name, onFileChange, error, fileName, onView }) => (
  <div>
    <div className="flex items-center justify-between">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    
    </div>
    <input type="file" id={name} name={name} accept=".pdf" onChange={onFileChange}
      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    />
    {/* {fileName && <p className="text-xs text-gray-600 mt-1">File: {fileName}</p>} */}
     
    <p className="text-xs text-gray-500 mt-1">PDF only, max 1MB.</p>

     {fileName && onView && (
      
        <button
          type="button"
          onClick={onView}
          className="text-md text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-4"
        >
          View file 
        </button>
      )}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
));

const NoticeFormPage = () => {
  const { id } = useParams(); 
  const isEditMode = !!id; 
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState({ en_title: '', od_title: '', date: '' });
  const [file, setFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null); 

  const fetchNoticeData = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notices/${id}`, { withCredentials: true });
      const { en_title, od_title, date, doc } = response.data;
      const initial = { en_title, od_title, date: date || '' };
      setFormData(initial);
      setInitialData(initial);
      setExistingFileName(doc || '');
    } catch (error) {
      showModal("error", "Failed to fetch notice data.");
      navigate('/admin/notifications/notices');
    }
  }, [id, navigate, showModal]);

  useEffect(() => {
    if (isEditMode) {
      fetchNoticeData();
    }
  }, [isEditMode, fetchNoticeData]);

const handleChange = (name, value) => {
  setFormData(prev => ({ ...prev, [name]: value }));
};

  // const handleFileChange = useCallback((e) => {
  //   const { name, files: selectedFiles } = e.target;
  //   const selectedFile = selectedFiles[0];
  //   if (!selectedFile) {
  //       setFile(null);
  //       return;
  //   }
  //   if (selectedFile.type !== 'application/pdf' || selectedFile.size > 1 * 1024 * 1024) {
  //       const errorMsg = selectedFile.type !== 'application/pdf' ? "Invalid file type. Only PDF is allowed." : "File size exceeds 1MB.";
  //       setErrors(prev => ({ ...prev, [name]: errorMsg }));
  //       e.target.value = null;
  //       return;
  //   }
  //   setErrors(prev => ({ ...prev, [name]: null }));
  //   setFile(selectedFile);
  // }, []);


  
const handleFileChange = useCallback((selectedFile, errorMsg) => {
  if (errorMsg) {
    setErrors(prev => ({ ...prev, doc: errorMsg }));
    setFile(null);
    return;
  }


  setFile(selectedFile);
  setErrors(prev => ({ ...prev, doc: null }));
}, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.en_title.trim()) newErrors.en_title = "English title is required.";
        if (!formData.od_title.trim()) newErrors.od_title = "Odia title is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!isEditMode && !file) {
      newErrors.doc = "Notice document is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, file, isEditMode]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    if (file) submissionData.append('doc', file);

    const url = isEditMode ? `${import.meta.env.VITE_API_BASE_URL}/notices/${id}` : `${import.meta.env.VITE_API_BASE_URL}/notices`;
    const method = isEditMode ? 'patch' : 'post';

    try {
      await axios[method](url, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      showModal("success", `Notice ${isEditMode ? 'updated' : 'added'} successfully!`);
      navigate('/admin/notifications/notices');
    } catch (error) {
      showModal("error", error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} notice.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, file, id, isEditMode, navigate, showModal, validateForm]);

  const handleReset = useCallback(() => {
    if (isEditMode && initialData) {
        setFormData(initialData); 
    } else {
        setFormData({ en_title: '', od_title: '', date: '' });
    }
    setFile(null);
    setErrors({});
    const fileInput = document.getElementById('doc');
    if (fileInput) fileInput.value = null;
  }, [isEditMode, initialData]);


    
  return (
    <div className="p-6 min-h-[80vh]">
      <Header title={isEditMode ? "Edit Notice" : "Add New Notice"} onGoBack={() => navigate('/admin/notifications/notices')} />
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Title (English)" name="en_title" type="text" value={formData.en_title} onChange={(value)=>handleChange("en_title", value)} error={errors.en_title}/>
            <FormField label="Title (Odia)" name="od_title" type="text" value={formData.od_title}  onChange={(value)=>handleChange("od_title", value)} error={errors.od_title}/>
            <FormField label="Date" name="date" type="date" value={formData.date}  onChange={(value)=>handleChange("date", value)} error={errors.date}/>
          <DocumentUploader
          label="Notice Document" name="doc" onFileChange={handleFileChange} error={errors.doc}
          allowedTypes={["application/pdf"]}
          maxSizeMB={1}
          file={file}
                       existingFileName={existingFileName}
              existingFileUrl={
                existingFileName
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/notices/${existingFileName}`
                  : null
              }
          />
          
          </div>
          <FormActions
            onSubmit={handleSubmit}
            onReset={handleReset}
            onCancel={() => navigate('/admin/notifications/notices')}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default NoticeFormPage;