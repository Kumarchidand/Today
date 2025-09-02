// import React from "react";
// import RichTextEditor from "../../Components/TextEditor/RichTextEditor";

// const DescriptionFields = ({ formData, onInputChange }) => (
//   <>
//     <div className="md:col-span-2">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         ବିବରଣୀ (ଇଂରାଜୀରେ) / Description (In English) *
//       </label>
//       <RichTextEditor
//         value={formData.descriptionEnglish}
//         onChange={(val) => onInputChange("descriptionEnglish", val)}
//         placeholder="Enter description in English..."
//       />
//     </div>

//     <div className="md:col-span-2">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         ବିବରଣୀ (ଓଡ଼ିଆରେ) / Description (In Odia) *
//       </label>
//       <RichTextEditor
//         value={formData.descriptionOdia}
//         onChange={(val) => onInputChange("descriptionOdia", val)}
//         placeholder="Enter description in Odia..."
//       />
//     </div>
//   </>
// );

// export default DescriptionFields;


import React from "react";
import RichTextEditor from "../../Components/TextEditor/RichTextEditor";

// --- THE FIX IS HERE ---
// We provide a default empty object for the 'errors' prop.
const DescriptionFields = ({ formData, onInputChange, errors = {} }) => (
  <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In English) *
      </label>
      <RichTextEditor
        value={formData.descriptionEnglish}
        onChange={(val) => onInputChange("descriptionEnglish", val)}
        placeholder="Enter description in English..."
        // If 'errors' is not passed, `errors.descriptionEnglish` will be undefined, which is safe.
        error={errors.descriptionEnglish}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In Odia) *
      </label>
      <RichTextEditor
        value={formData.descriptionOdia}
        onChange={(val) => onInputChange("descriptionOdia", val)}
        placeholder="Enter description in Odia..."
        error={errors.descriptionOdia}
      />
    </div>
  </div>
);

export default DescriptionFields;