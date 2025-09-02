// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../../../Components/Add/Header";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const VideoGalleryForm = () => {
//   const { id } = useParams(); // get video id from url params
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title_en: "",
//     title_od: "",
//     category: "",
//     videoSourceType: "upload", // "upload" or "link"
//     videoFile: null,
//     videoLink: "",
//   });

//   const [existingVideoUrl, setExistingVideoUrl] = useState(""); // To show current video
//   const [categories, setCategories] = useState([]);
//   const [errors, setErrors] = useState({});

//   // Fetch categories once
//   useEffect(() => {
//   const fetchCategories = async () => {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/image-setup/all-categories`, {
//       withCredentials: true,
//     });
//     if (res.data && Array.isArray(res.data.data)) {
//       setCategories(res.data.data);
//     }
//   } catch (error) {
//     console.error("Failed to fetch categories:", error);
//   }
// };

//     fetchCategories();
//   }, []);

//   // Fetch existing video data on mount (for editing)
//   useEffect(() => {
//     if (!id) return;

//     const fetchVideo = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/image-setup/video/${id}`, {
//           withCredentials: true,
//         });

//         if (res.data.success && res.data.video) {
//           const video = res.data.video;

//           setFormData({
//             title_en: video.title_en || "",
//             title_od: video.title_od || "",
//             category: video.category_id || "",
//             videoSourceType: video.video_url ? "link" : "upload",
//             videoFile: null,
//             videoLink: video.video_url || "",
//           });

//           setExistingVideoUrl(video.video_url || "");
//         } else {
//           alert("Failed to load video data");
//           navigate("/admin/image-setup/video-galary");
//         }
//       } catch (error) {
//         console.error("Failed to fetch video:", error);
//         alert("Error loading video data");
//         navigate("/admin/image-setup/video-galary");
//       }
//     };

//     fetchVideo();
//   }, [id, navigate]);

//   const handleCancel = () => {
//     navigate("/admin/image-setup/video-galary");
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "videoFile") {
//       setFormData((prev) => ({ ...prev, videoFile: files[0] }));
//       setErrors((prev) => ({ ...prev, videoFile: "" }));
//     } else if (name === "videoSourceType") {
//       setFormData((prev) => ({
//         ...prev,
//         videoSourceType: value,
//         videoFile: null,
//         videoLink: "",
//       }));
//       setErrors({});
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       title_en: "",
//       title_od: "",
//       category: "",
//       videoSourceType: "upload",
//       videoFile: null,
//       videoLink: "",
//     });
//     setErrors({});
//     setExistingVideoUrl("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     const newErrors = {};
//     if (!formData.title_en.trim()) newErrors.title_en = "Title (EN) is required";
//     if (!formData.title_od.trim()) newErrors.title_od = "Title (OD) is required";
//     if (!formData.category) newErrors.category = "Category is required";

//     if (formData.videoSourceType === "upload" && !formData.videoFile && !existingVideoUrl) {
//       newErrors.videoFile = "Please upload a video file";
//     }
//     if (formData.videoSourceType === "link" && !formData.videoLink.trim()) {
//       newErrors.videoLink = "Please enter a video link";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const form = new FormData();
//       form.append("title_en", formData.title_en);
//       form.append("title_od", formData.title_od);
//       form.append("category_id", formData.category);

//       if (formData.videoSourceType === "upload" && formData.videoFile) {
//         form.append("video", formData.videoFile);
//       } else if (formData.videoSourceType === "link") {
//         form.append("video_url", formData.videoLink);
//       }

//       let res;
//       if (id) {
//         res = await axios.put(`${API_BASE_URL}/image-setup/update-video/${id}`, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//       } else {
//         res = await axios.post(`${API_BASE_URL}/image-setup/register-video`, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//       }

//       if (res.data.success) {
//         alert(id ? "Video updated successfully!" : "Video registered successfully!");
//         navigate("/admin/image-setup/video-galary");
//       } else {
//         alert("Something went wrong: " + res.data.message);
//       }
//     } catch (error) {
//       console.error("Error submitting video:", error);
//       alert("An error occurred while submitting the video.");
//     }
//   };

//   return (
//     <div className="mx-auto p-6 min-h-[80vh]">
//       <div className="bg-white p-6 rounded">
//         <Header title={id ? "Edit Video Gallery Item" : "Add Video Gallery Item"} onGoBack={handleCancel} />

//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           {/* Title (EN) */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Title (In English)</label>
//             <input
//               type="text"
//               name="title_en"
//               value={formData.title_en}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.title_en && <p className="text-red-600 text-sm">{errors.title_en}</p>}
//           </div>

//           {/* Title (OD) */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Title (In Odia)</label>
//             <input
//               type="text"
//               name="title_od"
//               value={formData.title_od}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.title_od && <p className="text-red-600 text-sm">{errors.title_od}</p>}
//           </div>

//           {/* Category Dropdown */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Category</label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             >
//               <option value="">-- Select Category --</option>
//               {categories
//                 .filter((cat) => cat.category_type === "video")
//                 .map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.category_en}
//                   </option>
//                 ))}
//             </select>
//             {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
//           </div>

//           {/* Video Source Type */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Video Source Type</label>
//             <label className="inline-flex items-center mr-6">
//               <input
//                 type="radio"
//                 name="videoSourceType"
//                 value="upload"
//                 checked={formData.videoSourceType === "upload"}
//                 onChange={handleChange}
//               />
//               <span className="ml-2">Upload File</span>
//             </label>
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 name="videoSourceType"
//                 value="link"
//                 checked={formData.videoSourceType === "link"}
//                 onChange={handleChange}
//               />
//               <span className="ml-2">Paste Link</span>
//             </label>
//           </div>

//           {/* Show existing video if any */}
//           {existingVideoUrl && formData.videoSourceType === "link" && (
//             <div className="mb-4">
//               <p className="font-medium text-gray-700">Current Video:</p>
//               <video src={existingVideoUrl} controls className="max-w-xs rounded" />
//             </div>
//           )}

//           {/* File or Link input */}
//           {formData.videoSourceType === "upload" ? (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700">Upload Video</label>
//               <input
//                 type="file"
//                 name="videoFile"
//                 accept="video/*"
//                 onChange={handleChange}
//                 className="mt-1 block w-full"
//               />
//               {errors.videoFile && <p className="text-red-600 text-sm">{errors.videoFile}</p>}
//             </div>
//           ) : (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700">Paste Video Link</label>
//               <input
//                 type="text"
//                 name="videoLink"
//                 value={formData.videoLink}
//                 onChange={handleChange}
//                 placeholder="https://example.com/video.mp4"
//                 className="mt-1 block w-full border rounded px-2 py-1"
//               />
//               {errors.videoLink && <p className="text-red-600 text-sm">{errors.videoLink}</p>}
//             </div>
//           )}

//           {/* Buttons */}
//           <div className="flex space-x-2">
//             <button
//               type="submit"
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               {id ? "Update" : "Submit"}
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

// export default VideoGalleryForm;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../Components/Add/Header";
import axios from "axios";
import DocumentUploader from "../../../Components/TextEditor/DocumentUploader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VideoGalleryForm = () => {
  const { id } = useParams(); // get video id from url params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title_en: "",
    title_od: "",
    category: "",
    videoSourceType: "upload", // "upload" or "link"
    videoFile: null,
    videoLink: "",
  });

  const [existingVideoUrl, setExistingVideoUrl] = useState(""); // To show current video
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/image-setup/all-categories`, {
          withCredentials: true,
        });
        if (res.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch existing video data on mount (for editing)
  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/image-setup/video/${id}`, {
          withCredentials: true,
        });

        if (res.data.success && res.data.video) {
          const video = res.data.video;

          setFormData({
            title_en: video.title_en || "",
            title_od: video.title_od || "",
            category: video.category_id || "",
            videoSourceType: video.video_url ? "link" : "upload",
            videoFile: null,
            videoLink: video.video_url || "",
          });

          setExistingVideoUrl(video.video_url || "");
        } else {
          alert("Failed to load video data");
          navigate("/admin/image-setup/video-galary");
        }
      } catch (error) {
        console.error("Failed to fetch video:", error);
        alert("Error loading video data");
        navigate("/admin/image-setup/video-galary");
      }
    };

    fetchVideo();
  }, [id, navigate]);

  const handleCancel = () => {
    navigate("/admin/image-setup/video-galary");
  };

  // Unified handler for file changes from DocumentUploader
  const handleVideoFileChange = (file, errorMessage) => {
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, videoFile: errorMessage }));
      setFormData((prev) => ({ ...prev, videoFile: null }));
    } else {
      setErrors((prev) => ({ ...prev, videoFile: "" }));
      setFormData((prev) => ({ ...prev, videoFile: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "videoSourceType") {
      setFormData((prev) => ({
        ...prev,
        videoSourceType: value,
        videoFile: null,
        videoLink: "",
      }));
      setErrors({});
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    setFormData({
      title_en: "",
      title_od: "",
      category: "",
      videoSourceType: "upload",
      videoFile: null,
      videoLink: "",
    });
    setErrors({});
    setExistingVideoUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.title_en.trim()) newErrors.title_en = "Title (EN) is required";
    if (!formData.title_od.trim()) newErrors.title_od = "Title (OD) is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (formData.videoSourceType === "upload" && !formData.videoFile && !existingVideoUrl) {
      newErrors.videoFile = "Please upload a video file";
    }
    if (formData.videoSourceType === "link" && !formData.videoLink.trim()) {
      newErrors.videoLink = "Please enter a video link";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const form = new FormData();
      form.append("title_en", formData.title_en);
      form.append("title_od", formData.title_od);
      form.append("category_id", formData.category);

      if (formData.videoSourceType === "upload" && formData.videoFile) {
        form.append("video", formData.videoFile);
      } else if (formData.videoSourceType === "link") {
        form.append("video_url", formData.videoLink);
      }

      let res;
      if (id) {
        res = await axios.put(`${API_BASE_URL}/image-setup/update-video/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${API_BASE_URL}/image-setup/register-video`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        alert(id ? "Video updated successfully!" : "Video registered successfully!");
        navigate("/admin/image-setup/video-galary");
      } else {
        alert("Something went wrong: " + res.data.message);
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      alert("An error occurred while submitting the video.");
    }
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header title={id ? "Edit Video Gallery Item" : "Add Video Gallery Item"} onGoBack={handleCancel} />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title (EN) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title (In English)</label>
            <input
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.title_en && <p className="text-red-600 text-sm">{errors.title_en}</p>}
          </div>

          {/* Title (OD) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title (In Odia)</label>
            <input
              type="text"
              name="title_od"
              value={formData.title_od}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.title_od && <p className="text-red-600 text-sm">{errors.title_od}</p>}
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            >
              <option value="">-- Select Category --</option>
              {categories
                .filter((cat) => cat.category_type === "video")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_en}
                  </option>
                ))}
            </select>
            {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
          </div>

          {/* Video Source Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Source Type</label>
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                name="videoSourceType"
                value="upload"
                checked={formData.videoSourceType === "upload"}
                onChange={handleChange}
              />
              <span className="ml-2">Upload File</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="videoSourceType"
                value="link"
                checked={formData.videoSourceType === "link"}
                onChange={handleChange}
              />
              <span className="ml-2">Paste Link</span>
            </label>
          </div>

          {/* Show existing video if any */}
          {existingVideoUrl && formData.videoSourceType === "link" && (
            <div className="mb-4">
              <p className="font-medium text-gray-700">Current Video:</p>
              <video src={existingVideoUrl} controls className="max-w-xs rounded" />
            </div>
          )}

          {/* File or Link input */}
          {formData.videoSourceType === "upload" ? (
            <div className="mb-6">
              <DocumentUploader
                label="Upload Video"
                file={formData.videoFile}
                onFileChange={handleVideoFileChange}
                error={errors.videoFile}
                allowedTypes={[
                  "video/mp4",
                  "video/webm",
                  "video/ogg",
                  "video/mov",
                  "video/avi",
                  "video/mkv",
                ]}
                maxSizeMB={100} // Set max size for video upload
              />
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Paste Video Link</label>
              <input
                type="text"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                placeholder="https://example.com/video.mp4"
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              {errors.videoLink && <p className="text-red-600 text-sm">{errors.videoLink}</p>}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
            >
              {id ? "Update" : "Submit"}
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

export default VideoGalleryForm;
