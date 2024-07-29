import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const ExerciseDisplay = ({ selectedExercise }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const detectorConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };
      const detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, detectorConfig);
      setDetector(detector);
    };
    loadModel();
  }, []);

  useEffect(() => {
    const detectPose = async () => {
      if (detector && webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const poses = await detector.estimatePoses(video);

        if (poses.length > 0) {
          drawPose(poses[0]);
        }
      }
    };

    const drawPose = (pose) => {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      pose.keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.5) {
          const { x, y } = keypoint;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      });

      pose.keypoints.forEach((keypoint) => {
        const { x, y } = keypoint;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      });
    };

    const intervalId = setInterval(detectPose, 100);

    return () => clearInterval(intervalId);
  }, [detector]);

  return (
    <div className="exercise-display flex flex-col items-center mt-6">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg mb-4"
        videoConstraints={{ facingMode: "user" }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <h2 className="text-2xl font-bold">
        {selectedExercise} Pose Tracking
      </h2>
    </div>
  );
};

export default ExerciseDisplay;
