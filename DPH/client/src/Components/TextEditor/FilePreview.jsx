
// import React, { useEffect, useState } from "react";
// import SkeletonBox from "./SkeletonBox";

// const FilePreview = ({ file, isLoading }) => {
//   const [show, setShow] = useState(!!file);

//   useEffect(() => {
//     if (file) {
//       setShow(true);
//     } else {
//       // delay unmount for fade-out
//       const timer = setTimeout(() => setShow(false), 200);
//       return () => clearTimeout(timer);
//     }
//   }, [file]);

//   if (!file && !show) return null;

//   return (
//     <div
//       className={`mt-3 transition-opacity duration-200 ${
//         file ? "opacity-100" : "opacity-0"
//       }`}
//     >
//       {file && (
//         <>
//           <p className="text-sm text-green-600">
//             Selected: {file.name} ({Math.round(file.size / 1024)} KB)
//           </p>
//           {isLoading ? (
//             <SkeletonBox />
//           ) : (
//             <img
//               src={URL.createObjectURL(file)}
//               alt="Preview"
//               className="mt-2 rounded-md border max-h-48 object-contain"
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default FilePreview;


import React, { useEffect, useState } from "react";
import SkeletonBox from "./SkeletonBox";

const FilePreview = ({ file, isLoading }) => {
  const [show, setShow] = useState(!!file);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (file) {
      setFileUrl(URL.createObjectURL(file));
      setShow(true);
    } else {
      // delay unmount for fade-out
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }

    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [file]);

  if (!file && !show) return null;

  const renderPreview = () => {
    if (!file) return null;

    const type = file.type;

    if (type.startsWith("image/")) {
      return <img src={fileUrl} alt="Preview" className="mt-2 rounded-md border max-h-48 object-contain" />;
    } else if (type === "application/pdf") {
      return (
        <iframe
          src={fileUrl}
          title="PDF Preview"
          className="mt-2 w-full h-48 border rounded-md"
        />
      );
    } else if (type.startsWith("video/")) {
      return (
        <video
          src={fileUrl}
          controls
          className="mt-2 max-h-48 w-full rounded-md border"
        />
      );
    } else if (type.startsWith("audio/")) {
      return (
        <audio src={fileUrl} controls className="mt-2 w-full" />
      );
    } else {
      return (
        <p className="mt-2 text-sm text-gray-700">
          File preview not available. You can download it: <a href={fileUrl} download={file.name} className="text-blue-600 underline">{file.name}</a>
        </p>
      );
    }
  };

  return (
    <div
      className={`mt-3 transition-opacity duration-200 ${
        file ? "opacity-100" : "opacity-0"
      }`}
    >
      {file && (
        <>
          <p className="text-sm text-green-600">
            Selected: {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
          {isLoading ? <SkeletonBox /> : renderPreview()}
        </>
      )}
    </div>
  );
};

export default FilePreview;
