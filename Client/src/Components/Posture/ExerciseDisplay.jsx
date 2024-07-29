import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import PoseAnalyzer from './PoseAnalyzer.jsx';

const ExerciseDisplay = ({ selectedExercise }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [count, setCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [exerciseState, setExerciseState] = useState('ready');

  return (
    <div className="bg-gray-900 min-h-screen w-full text-white p-6">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Exercise Tracker
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative aspect-video">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-lg w-full h-full object-cover"
                videoConstraints={{ facingMode: "user" }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
          
          <div className="flex-1 bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              {selectedExercise} Pose Tracking
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Count:</span>
                <span className="text-2xl font-bold text-green-400">{count}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">State:</span>
                <span className="text-xl font-semibold text-yellow-400">
                  {exerciseState.charAt(0).toUpperCase() + exerciseState.slice(1)}
                </span>
              </div>
              <div>
                <span className="text-lg">Feedback:</span>
                <p className="mt-2 text-lg italic text-gray-300">{feedback}</p>
              </div>
            </div>
          </div>
        </div>
        
        <PoseAnalyzer
          webcamRef={webcamRef}
          canvasRef={canvasRef}
          selectedExercise={selectedExercise}
          count={count}
          setCount={setCount}
          feedback={feedback}
          setFeedback={setFeedback}
          exerciseState={exerciseState}
          setExerciseState={setExerciseState}
        />
      </div>
    </div>
  );
};

export default ExerciseDisplay;