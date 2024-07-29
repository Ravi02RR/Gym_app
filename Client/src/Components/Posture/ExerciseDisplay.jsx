import { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const ExerciseDisplay = ({ selectedExercise }) => {
  const [angle, setAngle] = useState(null);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          try {
            const response = await axios.post(`http://localhost:3001/postureservice/exercise/${selectedExercise}`, { image: imageSrc });
            console.log('Response from backend:', response.data);
            setAngle(response.data.angle);
            setError(null); // Clear error if request is successful
          } catch (error) {
            console.error('Error fetching exercise data:', error);
            setError('Failed to fetch exercise data.'); // Update state with error message
          }
        } else {
          console.warn('No image captured');
        }
      }
    };

    const intervalId = setInterval(fetchExerciseData, 2000);

    return () => clearInterval(intervalId);
  }, [selectedExercise]);

  return (
    <div className="exercise-display flex flex-col items-center mt-6">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg mb-4"
      />
      <h2 className="text-2xl font-bold">
        {selectedExercise} Angle: {angle !== null ? angle : 'Loading...'}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ExerciseDisplay;
