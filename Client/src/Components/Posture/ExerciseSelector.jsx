import React from 'react';

const ExerciseSelector = ({ exercises, selectedExercise, onSelect }) => {
  return (
    <div className="exercise-selector flex flex-col items-center my-8">
      <label htmlFor="exercise" className="mb-3 text-xl font-semibold text-blue-400">
        Choose an exercise:
      </label>
      <select
        id="exercise"
        value={selectedExercise}
        onChange={(e) => onSelect(e.target.value)}
        className="p-3 w-64 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
      >
        {exercises.map((exercise, index) => (
          <option key={index} value={exercise} className="bg-gray-800">
            {exercise}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExerciseSelector;