import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

// Reusable Components
import MenuTable from "../../../Components/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
import SortMenuController from '../../../Components/SortModal/SortMenuController';
import { useModal } from '../../../context/ModalProvider';

const API_BASE_URL = "http://localhost:5000";

const ChatBotAnswer = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSortModal, setShowSortModal] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, itemToUpdate: null });

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/chatbot-answers`, { withCredentials: true });
      console.log("API Response:", response.data); // Add this line
      setAnswers(response.data.answers || []);
    } catch (error) {
      showModal("error", "Failed to load chatbot answers.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnswers();
  }, []);

  // Confirmation modal handlers
  const openConfirmationModal = (item) => setModalState({ isOpen: true, itemToUpdate: item });
  const closeConfirmationModal = () => setModalState({ isOpen: false, itemToUpdate: null });

  const handleStatusUpdateConfirm = async () => {
    const item = modalState.itemToUpdate;
    if (!item) return;

    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put(`${API_BASE_URL}/api/chatbot-answers/status/${item.id}`, { status: newStatus }, { withCredentials: true });

      setAnswers(prev =>
        prev.map(ans => ans.id === item.id ? { ...ans, status: newStatus } : ans)
      );
      showModal("success", `Answer status set to "${newStatus}" successfully!`);
    } catch (error) {
      showModal("error", "Failed to update status.");
    } finally {
      closeConfirmationModal();
    }
  };

  // Save new order (optional)
  const handleSaveOrder = async (newOrder) => {
    const orderIds = newOrder.map(item => item.id);
    try {
      await axios.put(`${API_BASE_URL}/api/chatbot-answers/order`, { order: orderIds }, { withCredentials: true });
      setAnswers(newOrder);
      setShowSortModal(false);
      showModal("success", "Answer order updated successfully!");
    } catch (error) {
      showModal("error", "Failed to update answer order.");
    }
  };

  // Function to get question text from answer object
  const getQuestionText = (answer) => {
    if (!answer) return "this question";
    
    // Check different possible locations for question data
    return answer.question?.en || 
           (answer.ChatbotQuestion ? answer.ChatbotQuestion.en : null) || 
           (answer.question_id ? `Question ${answer.question_id}` : "this question");
  };

  // Function to get category text from answer object
  const getCategoryText = (answer) => {
    if (!answer) return "";
    
    // Check different possible locations for category data
    return answer.category?.en || 
           (answer.ChatbotCategory ? answer.ChatbotCategory.en : null) || 
           (answer.category_id ? `Category ${answer.category_id}` : "");
  };

  // Table columns
  const columns = useMemo(() => [
    { header: "SL.No", cell: ({ index }) => index + 1 },
    { 
      header: "Category", 
      accessor: "category", 
      cell: ({ row }) => getCategoryText(row)
    },
    { 
      header: "Question", 
      accessor: "question", 
      cell: ({ row }) => getQuestionText(row)
    },
    { 
      header: "Answer (English)", 
      accessor: "en", 
      cell: ({ row }) => row.en || "No English answer" 
    },
    { 
      header: "Answer (Odia)", 
      accessor: "od", 
      cell: ({ row }) => row.od || "No Odia answer" 
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.status === 'Active'
            ? (
              <button 
                onClick={() => openConfirmationModal(row)} 
                className="p-2 text-red-500 bg-red-100 rounded-full hover:bg-red-200"
                title="Deactivate"
              >
                <FaTimes />
              </button>
            )
            : (
              <button 
                onClick={() => openConfirmationModal(row)} 
                className="p-2 text-green-500 bg-green-100 rounded-full hover:bg-green-200"
                title="Activate"
              >
                <FaCheck />
              </button>
            )
          }
          <button 
            onClick={() => navigate(`/admin/manage-chatbot/edit-answer/${row.id}`)} 
            className="p-2 text-blue-500 bg-blue-100 rounded-full hover:bg-blue-200"
            title="Edit"
          >
            <FaEdit />
          </button>
        </div>
      )
    }
  ], [navigate]);

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable
        Ltext="Chatbot Answers"
        Rtext="Add Answer"
        data={answers}
        columns={columns}
        addPath="/admin/manage-chatbot/add-answer"
        loading={loading}
        onOpenSort={() => setShowSortModal(true)}
      />

      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={answers}
        onSave={handleSaveOrder}
        title="Reorder Answers"
        displayKey="question"
        secondaryKey="category"
      />

      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeConfirmationModal}
          onConfirm={handleStatusUpdateConfirm}
          title="Confirm Status Change"
          message={`Are you sure you want to set the answer for "${getQuestionText(modalState.itemToUpdate)}" to ${modalState.itemToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}?`}
          icon={AlertTriangle}
          confirmText={modalState.itemToUpdate?.status === 'Active' ? 'Deactivate' : 'Activate'}
          confirmButtonVariant={modalState.itemToUpdate?.status === 'Active' ? 'danger' : 'success'}
        />
      )}
    </div>
  );
};

export default ChatBotAnswer;