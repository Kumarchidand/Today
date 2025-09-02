// import React, { useState, useEffect, useMemo } from "react";
// import MenuTable from "../../../Components/Menu/MenuTable";
// import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
// import { FaEdit, FaCheck } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import { CheckCircle, XCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const StatusBadge = ({ isActive }) => {
//   const text = isActive ? "Active" : "Inactive";
//   const classes = isActive
//     ? "bg-green-100 text-green-800"
//     : "bg-red-100 text-red-800";

//   return (
//     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
//       {text}
//     </span>
//   );
// };

// const PhotoGalaryList = () => {
//   const [photoItems, setPhotoItems] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchPhotos();
//   }, []);

//   const fetchPhotos = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/image-setup/all-photos`, {
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         const photos = res.data.photos.map((photo) => ({
//           id: photo.id,
//           category: photo.category?.category_en || "N/A",
//           title_en: photo.title_en,
//           title_od: photo.title_od,
//           photo: photo.photo_url,
//           isActive: photo.status !== undefined ? photo.status : true,
//         }));
//         setPhotoItems(photos);
//       }
//     } catch (error) {
//       console.error("Failed to fetch photos:", error);
//     }
//   };

//   const openModal = (item) => {
//     setSelectedItem(item);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedItem(null);
//     setIsModalOpen(false);
//   };

//   const handleToggleStatus = async () => {
//     if (!selectedItem) return;

//     try {
//       const res = await axios.patch(
//         `${API_BASE_URL}/image-setup/toggle-photo-status/${selectedItem.id}`,
//         null,
//         {
//           withCredentials: true,
//         }
//       );

//       if (res.data.success) {
//         setPhotoItems((prev) =>
//           prev.map((item) =>
//             item.id === selectedItem.id
//               ? { ...item, isActive: !item.isActive }
//               : item
//           )
//         );
//         closeModal();
//       } else {
//         console.error("Failed to toggle status:", res.data.message);
//       }
//     } catch (error) {
//       console.error("Toggle status error:", error);
//     }
//   };

//   const photoColumns = useMemo(
//     () => [
//       {
//         header: "SL.No",
//         cell: ({ index }) => index + 1,
//       },
//       {
//         header: "Category",
//         accessor: "category",
//       },
//       {
//         header: "Title (In English)",
//         accessor: "title_en",
//       },
//       {
//         header: "Title (In Odia)",
//         accessor: "title_od",
//       },
//       {
//         header: "Photo",
//         accessor: "photo",
//         cell: ({ row }) => {
//           const imgSrc = row.original.photo?.replace(/\\/g, "/");
//           return imgSrc ? (
//             <img
//               src={imgSrc}
//               alt="Photo"
//               className="h-12 w-24 object-cover rounded"
//             />
//           ) : (
//             <div className="text-gray-500">No Image</div>
//           );
//         },
//       },
//       {
//         header: "Status",
//         accessor: "isActive",
//         cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
//       },
//       {
//         header: "Actions",
//         cell: ({ row }) => (
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() =>
//                 navigate(`/admin/image-setup/photo-galary/edit/${row.original.id}`)
//               }
//               className="text-blue-600 hover:text-blue-800 transition"
//               title="Edit Photo"
//             >
//               <FaEdit />
//             </button>
//             <button
//               onClick={() => openModal(row.original)}
//               title={row.original.isActive ? "Deactivate Photo" : "Activate Photo"}
//             >
//               {row.original.isActive ? (
//                 <IoClose className="text-red-600" />
//               ) : (
//                 <FaCheck className="text-green-600" />
//               )}
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [navigate]
//   );

//   return (
//     <div className="p-6 min-h-[80vh] font-sans">
//       <MenuTable
//         Ltext="Photo Gallery"
//         Rtext="Add Photo"
//         data={photoItems}
//         columns={photoColumns}
//         addPath="add"
//       />

//       {isModalOpen && selectedItem && (
//         <DeleteConfirmationModal
//           onClose={closeModal}
//           onConfirm={handleToggleStatus}
//           title={"Change Status"}
//           message={`Are you sure you want to ${
//             selectedItem.isActive ? "deactivate" : "activate"
//           } "${selectedItem.title_en}"?`}
//           icon={selectedItem.isActive ? XCircle : CheckCircle}
//           confirmText={"Yes"}
//           cancelText="Cancel"
//         />
//       )}
//     </div>
//   );
// };

// export default PhotoGalaryList;



import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuTable from "../../../Components/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useModal } from "../../../context/ModalProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const PhotoGalaryList = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const {
    data: photoItems,
    setData,
    tableState,
  } = useServerSideTable(`${API_BASE_URL}/image-setup/all-photos`);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleToggleStatus = useCallback(async () => {
    if (!selectedItem) return;

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/image-setup/toggle-photo-status/${selectedItem.id}`,
        null,
        { withCredentials: true }
      );

      const updatedItem = res.data.photo;
      setData((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id ? { ...item, status: updatedItem.status } : item
        )
      );
      showModal("success", res.data.message);
    } catch (error) {
      showModal("error", "Failed to toggle status.");
    } finally {
      closeModal();
    }
  }, [selectedItem, setData, showModal]);

  const photoColumns = useMemo(
    () => [
      {
        header: "SL.No",
        cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      {
        header: "Category",
        accessor: "category_name",
        isSearchable: true,
        isSortable: true,
      },
      {
        header: "Title (English)",
        accessor: "title_en",
        isSearchable: true,
        isSortable: true,
      },
      {
        header: "Title (Odia)",
        accessor: "title_od",
        isSearchable: true,
        isSortable: true,
      },
      {
        header: "Photo",
        accessor: "photo",
        cell: ({ row }) => {
          const imgSrc = row.original.photo_url;
          return imgSrc ? (
            <img src={imgSrc} alt="Photo" className="h-12 w-24 object-cover rounded" />
          ) : (
            <div className="text-gray-500 text-xs">No Image</div>
          );
        },
      },
      {
        header: "Status",
        accessor: "status",
        isSortable: true,
        cell: ({ row }) => <StatusBadge isActive={row.original.status} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/admin/image-setup/photo-galary/edit/${row.original.id}`)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Edit Photo">
              <FaEdit />
            </button>
            <button
              onClick={() => openModal(row.original)}
              className={row.original.status ? "text-red-600" : "text-green-600"}
              title={row.original.status ? "Deactivate Photo" : "Activate Photo"}>
              {row.original.status ? <IoClose /> : <FaCheck />}
            </button>
          </div>
        ),
      },
    ],
    [navigate, tableState.currentPage, tableState.entriesPerPage]
  );

  return (
    <div className="p-6 min-h-[80vh] font-sans">
      <MenuTable
        Ltext="Photo Gallery"
        Rtext="Add Photo"
        data={photoItems}
        columns={photoColumns}
        addPath="add"
        tableState={tableState}
      />

      {isModalOpen && selectedItem && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={"Change Status"}
          message={`Are you sure you want to ${
            selectedItem.status ? "deactivate" : "activate"
          } "${selectedItem.title_en}"?`}
          icon={selectedItem.status ? XCircle : CheckCircle}
          confirmText={"Yes"}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default PhotoGalaryList;