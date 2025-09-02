// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Header from "../../../Components/Add/Header";
// import DocumentUploader from "../../../Components/TextEditor/DocumentUploader";

// const HomePageBannerForm = () => {
//   const [formData, setFormData] = useState({
//     image: null,
//     existingImageUrl: "",
//     previewUrl: null, // <-- new state for preview URL
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = Boolean(id);

//   // Cancel handler
//   const handleCancel = () => {
//     navigate("/admin/image-setup/homepage-banner");
//   };

//   // Fetch existing banner on edit mode
//   useEffect(() => {
//     if (isEditMode) {
//       const fetchBanner = async () => {
//         try {
//           const res = await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/image-setup/homepage/banner/${id}`,
//             { withCredentials: true }
//           );

//           const banner = res.data.banner;

//           setFormData({
//             image: null,
//             existingImageUrl: banner.image_url || "",
//             previewUrl: null,
//           });
//         } catch (error) {
//           console.error("Failed to fetch banner:", error);
//         }
//       };

//       fetchBanner();
//     }
//   }, [id, isEditMode]);

//   // Validation
//   const validate = () => {
//     const newErrors = {};

//     if (!formData.image && !formData.existingImageUrl && !isEditMode) {
//       newErrors.image = "Banner image is required.";
//     } else if (
//       formData.image &&
//       !formData.image.type.startsWith("image/")
//     ) {
//       newErrors.image = "Only image files are allowed.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // File input change handler with preview URL logic
//   const handleChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       const preview = URL.createObjectURL(file);

//       // Clean up the old preview URL if exists to avoid memory leak
//       if (formData.previewUrl) {
//         URL.revokeObjectURL(formData.previewUrl);
//       }

//       setFormData((prev) => ({
//         ...prev,
//         image: file,
//         previewUrl: preview,
//       }));

//       setErrors((prev) => ({
//         ...prev,
//         image: "",
//       }));
//     }
//   };

//   // Cleanup preview URL on unmount or form reset
//   useEffect(() => {
//     return () => {
//       if (formData.previewUrl) {
//         URL.revokeObjectURL(formData.previewUrl);
//       }
//     };
//   }, [formData.previewUrl]);

//   // Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setIsSubmitting(true);

//     const data = new FormData();
//     if (formData.image) {
//       data.append("banner", formData.image);
//     }

//     try {
//       if (isEditMode) {
//         await axios.put(
//           `${import.meta.env.VITE_API_BASE_URL}/image-setup/upload/homepage/banner/${id}`,
//           data,
//           {
//             withCredentials: true,
//             headers: { "Content-Type": "multipart/form-data" },
//           }
//         );
//       } else {
//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/image-setup/upload/homepage/banner`,
//           data,
//           {
//             withCredentials: true,
//             headers: { "Content-Type": "multipart/form-data" },
//           }
//         );
//       }

//       navigate("/admin/image-setup/homepage-banner");
//     } catch (error) {
//       console.error(
//         "Error submitting banner:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reset form fields
//   const handleReset = () => {
//     // Revoke preview URL if exists
//     if (formData.previewUrl) {
//       URL.revokeObjectURL(formData.previewUrl);
//     }

//     setFormData({ image: null, existingImageUrl: "", previewUrl: null });
//     setErrors({});
//   };

//   return (
//     <div className="mx-auto p-6 min-h-[80vh]">
//       <div className="bg-white p-6 rounded">
//         <Header
//           title={isEditMode ? "Edit Homepage Banner" : "Add Homepage Banner"}
//           onGoBack={handleCancel}
//         />

//         <form onSubmit={handleSubmit}
//         //  encType="multipart/form-data"  
//           >
//           <div className="mb-6">
//             {/* <label className="block text-sm font-medium text-gray-700">
//               Upload Banner Image
//             </label>
//             <input
//               type="file"
//               name="banner"
//               accept="image/*"
//               onChange={handleChange}
//               className="mt-1 block w-full"
//             /> */}
//             <DocumentUploader   allowedTypes={[ 'image/jpeg', 'image/png']}  onChange={handleChange}   name="banner"  label="Choose banner image" error={errors.image} />
//             {/* {errors.image && (
//               <p className="text-red-600 text-sm mt-1">{errors.image}</p>
//             )} */}

//             {/* Show preview image if user selected a new file, else show existing image */}
//             {(formData.previewUrl || formData.existingImageUrl) && (
//               <div className="mt-4">
//                 <p className="text-sm text-gray-500 mb-1">Current Banner:</p>
//                 <img
//                   src={formData.previewUrl || formData.existingImageUrl}
//                   alt="Banner Preview"
//                   className="h-24 w-auto object-cover border rounded"
//                 />
//               </div>
//             )}
//           </div>

//           <div className="flex space-x-2">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>

//             <button
//               type="reset"
//               onClick={handleReset}
//               className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Reset
//             </button>

//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default HomePageBannerForm;




import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../Components/Add/Header";
import DocumentUploader from '../../../Components/TextEditor/DocumentUploader';
import { useModal } from "../../../context/ModalProvider";

const HomePageBannerForm = () => {
  const [formData, setFormData] = useState({
    image: null,              // newly selected file (File)
    existingImageName: "",    // existing file name (string)
    existingImageUrl: "",     // existing file URL (string)
  });

  const [error, setError] = useState(null); // single error string for uploader
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { showModal } = useModal();

  // Cancel handler
  const handleCancel = () => {
    navigate("/admin/image-setup/homepage-banner");
  };

  // Fetch existing banner on edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBanner = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/image-setup/homepage/banner/${id}`,
            { withCredentials: true }
          );
          const banner = res.data.banner;

          setFormData({
            image: null,
            existingImageName: banner.image_name || "",  // Assuming API gives this
            existingImageUrl: banner.image_url || "",
          });
          setError(null);
        } catch (error) {
          console.error("Failed to fetch banner:", error);
          showModal("error", "Failed to fetch banner data.");
        }
      };
      fetchBanner();
    }
  }, [id, isEditMode, showModal]);

  // Validation before submit (additional validation if needed)
  const validate = () => {
    // If no new image selected AND no existing image AND not edit mode, error
    if (!formData.image && !formData.existingImageUrl && !isEditMode) {
      setError("Banner image is required.");
      return false;
    }
    setError(null);
    return true;
  };

  // Handler for when DocumentUploader changes file or returns validation error
  const handleFileChange = (selectedFile, validationError) => {
    if (validationError) {
      setFormData(prev => ({ ...prev, image: null }));
      setError(validationError);
    } else {
      setFormData(prev => ({ 
        ...prev, 
        image: selectedFile, 
        // When user selects a new file, clear existing image info since we replace it
        existingImageName: "", 
        existingImageUrl: "" 
      }));
      setError(null);
    }
  };

  // Handler for removing existing file (clear existing image info)
  const handleRemoveExisting = () => {
    setFormData(prev => ({
      ...prev,
      existingImageName: "",
      existingImageUrl: "",
    }));
    setError(null);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const data = new FormData();
    if (formData.image) {
      data.append("banner", formData.image);
    }

    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/image-setup/upload/homepage/banner/${id}`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Homepage banner updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/image-setup/upload/homepage/banner`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Homepage banner added successfully.");
      }
      navigate("/admin/image-setup/homepage-banner");
    } catch (error) {
      console.error("Error submitting banner:", error.response?.data || error.message);
      setError("Failed to submit the form. Please try again.");
      showModal("error", error.response?.data?.message || "Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form fields
  const handleReset = () => {
    setFormData({
      image: null,
      existingImageName: "",
      existingImageUrl: "",
    });
    setError(null);
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header
          title={isEditMode ? "Edit Homepage Banner" : "Add Homepage Banner"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit} >
          <div className="mb-6">
            <DocumentUploader
              label="Upload Banner Image"
              file={formData.image}
              onFileChange={handleFileChange}
              onRemove={handleRemoveExisting}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']} // customize as needed
              maxSizeMB={10}
              error={error}
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-1 rounded"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePageBannerForm;
