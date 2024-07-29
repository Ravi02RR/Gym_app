import ExerciseSelector from '../../Components/Posture/ExerciseSelector';
import ExerciseDisplay from '../../Components/Posture/ExerciseDisplay';
import { useState } from 'react';

const PostureTraker = () => {
    const [selectedExercise, setSelectedExercise] = useState('curl');
    const exercises = ['curl', 'pushup', 'pullup'];

    return (
        <div className="home-page flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6">Exercise Tracker</h1>
            <ExerciseSelector
                exercises={exercises}
                selectedExercise={selectedExercise}
                onSelect={setSelectedExercise}
            />
            <ExerciseDisplay selectedExercise={selectedExercise} />
        </div>
    );
};

export default PostureTraker;
