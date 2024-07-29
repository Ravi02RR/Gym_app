

// eslint-disable-next-line react/prop-types
const ExerciseSelector = ({ exercises, selectedExercise, onSelect }) => {
  return (
    <div className="exercise-selector flex flex-col items-center my-4">
      <label htmlFor="exercise" className="mb-2 text-lg font-semibold">Choose an exercise:</label>
      <select
        id="exercise"
        value={selectedExercise}
        onChange={(e) => onSelect(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {exercises.map((exercise, index) => (
          <option key={index} value={exercise}>
            {exercise}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExerciseSelector;
