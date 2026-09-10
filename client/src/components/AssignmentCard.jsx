const AssignmentCard = ({ assignment, onClick, onDelete }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition border border-gray-100 flex items-center justify-between"
    >
      <div>
        <h2 className="font-semibold text-gray-800">{assignment.title}</h2>
        <p className="text-gray-500 text-sm mt-1">
          Deadline: {new Date(assignment.deadline).toLocaleString()}
        </p>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default AssignmentCard;