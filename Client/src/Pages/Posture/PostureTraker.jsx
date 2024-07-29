import ExerciseSelector from '../../Components/Posture/ExerciseSelector';
import ExerciseDisplay from '../../Components/Posture/ExerciseDisplay';
import { useState } from 'react';

const PostureTracker = () => {
    const [selectedExercise, setSelectedExercise] = useState('Squats');
    const exercises = ['Squats', 'Push-ups'];

    return (
        <div className="bg-gray-900  text-white overflow-x-hidden">
            <div className="w-screen mx-auto px-4 py-8">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-blue-400 mb-4">
                        Exercise Tracker
                    </h1>
                    <p className="text-xl text-gray-300">
                        Track your form and progress with AI-powered analysis
                    </p>
                </header>

                <div className="mb-8">
                    <ExerciseSelector
                        exercises={exercises}
                        selectedExercise={selectedExercise}
                        onSelect={setSelectedExercise}
                    />
                </div>

                <main>
                    <ExerciseDisplay selectedExercise={selectedExercise} />
                </main>
            </div>
        </div>
    );
};

export default PostureTracker;