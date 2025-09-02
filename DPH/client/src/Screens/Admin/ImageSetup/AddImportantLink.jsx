// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import importantLinksAPI from "../../../services/importantLinksAPI";
// import FormField from "../../../Components/TextEditor/FormField";
// import { ModalDialog } from "../../../Components/Modal/MessageModal";

// const AddImportantLink = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const fileRef = useRef(null);

//   const [formData, setFormData] = useState({ title: "", url: "", image: null });
//   const [preview, setPreview] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalVariant, setModalVariant] = useState("info");
//   const [modalMessage, setModalMessage] = useState("");

//   // ✅ Image URL helper
//   const getImageUrl = (img) => {
//     if (!img) return "";
//     if (img.startsWith("http")) return img;
//     const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
//     return `${base}/uploads/important-links/${img.replace(/^\/+/, "")}`;
//   };

//   // ✅ Edit mode data fetch
//   useEffect(() => {
//     if (!isEdit) return;
//     importantLinksAPI.get(id).then((res) => {
//       const link = res.data?.link || res.data;
//       setFormData({ title: link.title, url: link.url, image: null });
//       if (link.image) setPreview(getImageUrl(link.image));
//     });
//   }, [id, isEdit]);

//   // ✅ Show modal function
//   const showModal = (variant, message) => {
//     setModalVariant(variant);
//     setModalMessage(message);
//     setModalOpen(true);
//   };

//   // ✅ Dynamic fields config
//   const fields = [
//     {
//       name: "title",
//       label: "Title",
//       placeholder: "Enter link title",
//       required: true,
//       type: "text",
//     },
//     {
//       name: "url",
//       label: "URL",
//       placeholder: "https://example.com",
//       required: true,
//       type: "url",
//     },
//   ];

//   // ✅ Validation
//   const validate = () => {
//     const errs = {};
//     if (!formData.title.trim()) errs.title = "Title is required";
//     if (!formData.url.trim()) {
//       errs.url = "URL is required";
//     } else if (!/^https?:\/\/.+/i.test(formData.url)) {
//       errs.url = "Enter a valid URL";
//     }

//     if (!isEdit && !formData.image) {
//       errs.image = "File not uploaded";
//     }

//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   // ✅ Image Change
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         showModal("error", "Please select an image file");
//         return;
//       }
      
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         showModal("error", "Image size should be less than 5MB");
//         return;
//       }
      
//       setFormData((p) => ({ ...p, image: file }));
//       setPreview(URL.createObjectURL(file));
      
//       // Clear image error if any
//       if (errors.image) {
//         setErrors(prev => ({ ...prev, image: "" }));
//       }
//     }
//   };

//   // ✅ Image Remove
//   const removeImage = () => {
//     setFormData((p) => ({ ...p, image: null }));
//     setPreview("");
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   // ✅ Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append("title", formData.title);
//       fd.append("url", formData.url);
//       if (formData.image) fd.append("image", formData.image);

//       if (isEdit) {
//         await importantLinksAPI.update(id, fd);
//         showModal("success", "Link updated successfully!");
//       } else {
//         await importantLinksAPI.create(fd);
//         showModal("success", "Link created successfully!");
//       }

//       // Navigate after success
//       setTimeout(() => {
//         navigate("/admin/image-setup/important-links");
//       }, 1500);
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || err.message;
      
//       if (errorMsg.includes("duplicate") || errorMsg.includes("already exists")) {
//         showModal("error", "A link with this URL already exists!");
//       } else {
//         showModal("error", "Failed: " + errorMsg);
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-[80vh] py-6 font-sans">
//       {/* Modal Dialog */}
//       <ModalDialog
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         variant={modalVariant}
//         message={modalMessage}
//       />

//       <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">
//             {isEdit ? "Edit Important Link" : "Add Important Link"}
//           </h2>
//           <button
//             onClick={() => navigate("/admin/image-setup/important-links")}
//             className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
//           >
//             ← Go Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//           {/* ✅ Render Dynamic Fields */}
//           {fields.map((f) => (
//             <FormField
//               key={f.name}
//               label={f.label}
//               placeholder={f.placeholder}
//               type={f.type}
//               required={f.required}
//               value={formData[f.name]}
//               onChange={(val) => setFormData((p) => ({ ...p, [f.name]: val }))}
//               error={errors[f.name]}
//               disabled={loading}
//             />
//           ))}

//           {/* ✅ Image Upload (special case) */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Upload Image {!isEdit && <span className="text-red-500">*</span>}
//             </label>
//             <input
//               type="file"
//               ref={fileRef}
//               onChange={handleImageChange}
//               accept="image/*"
//               disabled={loading}
//               className={`w-full border ${errors.image ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md`}
//             />
//             {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}

//             {preview && (
//               <div className="mt-2 relative inline-block">
//                 <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded" />
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
//                 >
//                   ✕
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* ✅ Buttons */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
//             >
//               {loading ? "Saving..." : isEdit ? "Update" : "Submit"}
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate("/admin/image-setup/important-links")}
//               className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             {!isEdit && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFormData({ title: "", url: "", image: null });
//                   setPreview("");
//                   setErrors({});
//                   if (fileRef.current) fileRef.current.value = "";
//                 }}
//                 className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//                 disabled={loading}
//               >
//                 Reset
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddImportantLink;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import importantLinksAPI from "../../../services/importantLinksAPI";
import FormField from "../../../Components/TextEditor/FormField";
import { ModalDialog } from "../../../Components/Modal/MessageModal";
import DocumentUploader from "../../../Components/TextEditor/DocumentUploader";

const AddImportantLink = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({ title: "", url: "", image: null });
  const [preview, setPreview] = useState("");
  const [existingImageName, setExistingImageName] = useState(""); // Store the actual file name
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  // ✅ Extract filename from URL/path
  const extractFileName = (url) => {
    if (!url) return "";
    // Handle cases where URL might be a full URL or just a filename
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  // ✅ Image URL helper
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    return `${base}/uploads/important-links/${img.replace(/^\/+/, "")}`;
  };

  // ✅ Edit mode data fetch
  useEffect(() => {
    if (!isEdit) return;
    importantLinksAPI.get(id).then((res) => {
      const link = res.data?.link || res.data;
      setFormData({ title: link.title, url: link.url, image: null });
      if (link.image) {
        const imageUrl = getImageUrl(link.image);
        setPreview(imageUrl);
        setExistingImageName(extractFileName(link.image)); // Set the actual file name
      }
    });
  }, [id, isEdit]);

  // ✅ Show modal function
  const showModal = (variant, message) => {
    setModalVariant(variant);
    setModalMessage(message);
    setModalOpen(true);
  };

  // ✅ Dynamic fields config
  const fields = [
    {
      name: "title",
      label: "Title",
      placeholder: "Enter link title",
      required: true,
      type: "text",
    },
    {
      name: "url",
      label: "URL",
      placeholder: "https://example.com",
      required: true,
      type: "url",
    },
  ];

  // ✅ Validation
  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.url.trim()) {
      errs.url = "URL is required";
    } else if (!/^https?:\/\/.+/i.test(formData.url)) {
      errs.url = "Enter a valid URL";
    }

    if (!isEdit && !formData.image) {
      errs.image = "File not uploaded";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ✅ Handle file upload through DocumentUploader
  const handleFileUpload = (file, error) => {
    if (error) {
      setErrors(prev => ({ ...prev, image: error }));
      setFormData(prev => ({ ...prev, image: null }));
      setPreview("");
      return;
    }
    
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      
      // Clear image error if any
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }));
      }
    } else {
      setFormData(prev => ({ ...prev, image: null }));
      setPreview("");
    }
  };

  // ✅ Image Remove
  const removeImage = () => {
    setFormData((p) => ({ ...p, image: null }));
    setPreview("");
    setExistingImageName(""); // Clear the existing image name when removing
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("url", formData.url);
      if (formData.image) fd.append("image", formData.image);

      if (isEdit) {
        await importantLinksAPI.update(id, fd);
        showModal("success", "Link updated successfully!");
      } else {
        await importantLinksAPI.create(fd);
        showModal("success", "Link created successfully!");
      }

      // Navigate after success
      setTimeout(() => {
        navigate("/admin/image-setup/important-links");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      
      if (errorMsg.includes("duplicate") || errorMsg.includes("already exists")) {
        showModal("error", "A link with this URL already exists!");
      } else {
        showModal("error", "Failed: " + errorMsg);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-6 font-sans bg-gray-100">
      {/* Modal Dialog */}
      <ModalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        message={modalMessage}
      />

      <div className="container mx-auto bg-white shadow-lg p-8 rounded-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Important Link" : "Add Important Link"}
          </h2>
          <button
            onClick={() => navigate("/admin/image-setup/important-links")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-lg transition-colors"
          >
            ← Go Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* ✅ Render Dynamic Fields */}
          {fields.map((f) => (
            <FormField
              key={f.name}
              label={f.label}
              placeholder={f.placeholder}
              type={f.type}
              required={f.required}
              value={formData[f.name]}
              onChange={(val) => setFormData((p) => ({ ...p, [f.name]: val }))}
              error={errors[f.name]}
              disabled={loading}
            />
          ))}

          {/* ✅ Replaced Image Upload with DocumentUploader */}
          <DocumentUploader
            label="Upload Image"
            file={formData.image}
            existingFileName={existingImageName} // Use the actual file name
            existingFileUrl={preview}
            onFileChange={handleFileUpload}
            onRemove={removeImage}
            allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
            maxSizeMB={5}
            error={errors.image}
          />

          {/* ✅ Buttons */}
          <div className="flex gap-4 pt-6 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/image-setup/important-links")}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            {!isEdit && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ title: "", url: "", image: null });
                  setPreview("");
                  setErrors({});
                }}
                className="px-5 py-2.5 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Reset
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddImportantLink;