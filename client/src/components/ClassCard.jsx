const ClassCard = ({ classData, onClick}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm p-5 cursor-pointer hover:shadow-md transition border border-gray-100"
    >
      <h2 className="text-lg font-semibold text-gray-800">{classData.name}</h2>
      <p className="text-gray-500 text-sm mt-1">{classData.subject}</p>
      <div className="mt-3 inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
        Code: {classData.classCode}
      </div>
    </div>
  );
};

export default ClassCard;
