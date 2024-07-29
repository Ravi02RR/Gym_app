import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const PoseAnalyzer = ({ webcamRef, canvasRef, selectedExercise, count, setCount, feedback, setFeedback, exerciseState, setExerciseState }) => {
  const detectorRef = useRef(null);
  const lastCountTime = useRef(0);

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl');
      const detectorConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };
      detectorRef.current = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, detectorConfig);
    };
    loadModel();
  }, []);

  useEffect(() => {
    const detectPose = async () => {
      if (!detectorRef.current) return;

      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const poses = await detectorRef.current.estimatePoses(video);

        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, videoWidth, videoHeight);

        if (poses.length > 0) {
          drawSkeleton(ctx, poses[0], videoWidth, videoHeight);
          analyzePose(ctx, poses[0]);
        }
      }
    };

  const drawSkeleton = (ctx, pose, videoWidth, videoHeight) => {
  const connections = [
    ['nose', 'left_eye'], ['nose', 'right_eye'],
    ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
    ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
    ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
  ];

  // Clear the canvas
  ctx.clearRect(0, 0, videoWidth, videoHeight);

  // Draw semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, videoWidth, videoHeight);

  // Set styles for skeleton
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';

  // Draw connections
  connections.forEach(([startPoint, endPoint]) => {
    const start = pose.keypoints.find((kp) => kp.name === startPoint);
    const end = pose.keypoints.find((kp) => kp.name === endPoint);

    if (start && end && start.score > 0.5 && end.score > 0.5) {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  });

  // Draw keypoints
  pose.keypoints.forEach((keypoint) => {
    if (keypoint.score > 0.5) {
      const { x, y } = keypoint;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
  });

  // Function to calculate angle between three points
  const calculateAngle = (pointA, pointB, pointC) => {
    const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
                    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  };

  // Function to draw angles
  const drawAngle = (pointA, pointB, pointC, label) => {
    if (pointA && pointB && pointC && pointA.score > 0.5 && pointB.score > 0.5 && pointC.score > 0.5) {
      const angle = calculateAngle(pointA, pointB, pointC);
      ctx.beginPath();
      ctx.moveTo(pointB.x, pointB.y);
      ctx.arc(pointB.x, pointB.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = angle > 90 && angle < 160 ? 'rgba(255, 255, 0, 0.5)' : (angle <= 90 ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)');
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.fillText(`${angle.toFixed(0)}°`, pointB.x - 15, pointB.y + 5);
      return angle;
    }
    return null;
  };

  // Draw specific angles based on exercise
  let angle;
  if (selectedExercise === 'Squats') {
    const leftHip = pose.keypoints.find(kp => kp.name === 'left_hip');
    const leftKnee = pose.keypoints.find(kp => kp.name === 'left_knee');
    const leftAnkle = pose.keypoints.find(kp => kp.name === 'left_ankle');
    angle = drawAngle(leftHip, leftKnee, leftAnkle, 'Knee');
  } else if (selectedExercise === 'Push-ups') {
    const leftShoulder = pose.keypoints.find(kp => kp.name === 'left_shoulder');
    const leftElbow = pose.keypoints.find(kp => kp.name === 'left_elbow');
    const leftWrist = pose.keypoints.find(kp => kp.name === 'left_wrist');
    angle = drawAngle(leftShoulder, leftElbow, leftWrist, 'Elbow');
  }

  // Set up text styles
  ctx.textBaseline = 'top';
  ctx.font = 'bold 20px Arial';
  
  // Create a semi-transparent background for text
  const textBackgroundHeight = 160;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, videoWidth, textBackgroundHeight);

  // Draw exercise information
  ctx.fillStyle = 'white';
  const leftPadding = 20;
  const lineHeight = 30;
  ctx.fillText(`Exercise: ${selectedExercise}`, leftPadding, 10);
  ctx.fillText(`Count: ${count}`, leftPadding, 10 + lineHeight);
  ctx.fillText(`State: ${exerciseState}`, leftPadding, 10 + 2 * lineHeight);

  // Draw feedback with color coding
  ctx.font = '18px Arial';
  if (feedback) {
    ctx.fillStyle = feedback.includes('Good') ? '#4ade80' : (feedback.includes('Lower') ? '#f87171' : '#fbbf24');
    ctx.fillText(`Feedback: ${feedback}`, leftPadding, 10 + 3 * lineHeight);
  }

  // Draw angle information
  if (angle !== null) {
    const angleType = selectedExercise === 'Squats' ? 'Knee' : 'Elbow';
    ctx.fillStyle = angle < 90 ? '#4ade80' : (angle < 160 ? '#fbbf24' : '#f87171');
    ctx.fillText(`${angleType} Angle: ${angle.toFixed(0)}°`, leftPadding, 10 + 4 * 10);
  }

  // Update exercise state and count
  updateExerciseState(angle);
};

// Function to update exercise state and count
const updateExerciseState = (angle) => {
  if (selectedExercise === 'Squats') {
    if (angle < 100 && exerciseState === 'up') {
      exerciseState = 'down';
    } else if (angle > 160 && exerciseState === 'down') {
      exerciseState = 'up';
      count++;
    }
  } else if (selectedExercise === 'Push-ups') {
    if (angle < 90 && exerciseState === 'up') {
      exerciseState = 'down';
    } else if (angle > 160 && exerciseState === 'down') {
      exerciseState = 'up';
      count++;
    }
  }

  // Update feedback
  if (selectedExercise === 'Squats') {
    if (angle > 100 && angle < 140) {
      feedback = 'Good form! Keep going!';
    } else if (angle <= 100) {
      feedback = 'Lower your squat for better form.';
    } else {
      feedback = 'Stand up straighter between reps.';
    }
  } else if (selectedExercise === 'Push-ups') {
    if (angle < 90) {
      feedback = 'Good form! Push back up!';
    } else if (angle > 160) {
      feedback = 'Lower your body for the next rep.';
    } else {
      feedback = 'Lower more for full range of motion.';
    }
  }
};
    const analyzePose = (ctx, pose) => {
      switch (selectedExercise) {
        case 'Squats':
          analyzeSquats(ctx, pose);
          break;
        case 'Push-ups':
          analyzePushups(ctx, pose);
          break;
        default:
          setFeedback('Select an exercise to begin');
      }
    };

    const analyzeSquats = (ctx, pose) => {
      const leftHip = pose.keypoints.find(kp => kp.name === 'left_hip');
      const leftKnee = pose.keypoints.find(kp => kp.name === 'left_knee');
      const leftAnkle = pose.keypoints.find(kp => kp.name === 'left_ankle');

      if (leftHip && leftKnee && leftAnkle) {
        const angle = calculateAngle(leftHip, leftKnee, leftAnkle);

        if (angle > 160 && exerciseState === 'down') {
          setExerciseState('up');
          setCount(prevCount => prevCount + 1);
          lastCountTime.current = Date.now();
        } else if (angle < 90 && exerciseState === 'up') {
          setExerciseState('down');
        }

        // Draw angle and feedback on screen
        ctx.font = '24px Arial';
        ctx.fillStyle = angle < 90 ? 'green' : 'red';
        ctx.fillText(`Knee Angle: ${angle.toFixed(0)}°`, 10, 30);

        let feedbackText = '';
        if (angle < 90) {
          feedbackText = 'Good depth!';
          ctx.fillStyle = 'green';
        } else if (angle < 160) {
          feedbackText = 'Lower!';
          ctx.fillStyle = 'red';
        } else {
          feedbackText = 'Stand tall';
          ctx.fillStyle = 'green';
        }
        ctx.fillText(feedbackText, 10, 60);
        setFeedback(feedbackText);
      }
    };

    const analyzePushups = (ctx, pose) => {
      const leftShoulder = pose.keypoints.find(kp => kp.name === 'left_shoulder');
      const leftElbow = pose.keypoints.find(kp => kp.name === 'left_elbow');
      const leftWrist = pose.keypoints.find(kp => kp.name === 'left_wrist');

      if (leftShoulder && leftElbow && leftWrist) {
        const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);

        if (angle > 160 && exerciseState === 'down') {
          setExerciseState('up');
          setCount(prevCount => prevCount + 1);
          lastCountTime.current = Date.now();
        } else if (angle < 90 && exerciseState === 'up') {
          setExerciseState('down');
        }

        // Draw angle and feedback on screen
        ctx.font = '24px Arial';
        ctx.fillStyle = angle < 90 ? 'green' : 'red';
        ctx.fillText(`Elbow Angle: ${angle.toFixed(0)}°`, 10, 30);

        let feedbackText = '';
        if (angle < 90) {
          feedbackText = 'Push up!';
          ctx.fillStyle = 'green';
        } else if (angle < 160) {
          feedbackText = 'Lower!';
          ctx.fillStyle = 'red';
        } else {
          feedbackText = 'Good form';
          ctx.fillStyle = 'green';
        }
        ctx.fillText(feedbackText, 10, 60);
        setFeedback(feedbackText);
      }
    };

    const calculateAngle = (pointA, pointB, pointC) => {
      const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
        Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
      let angle = Math.abs(radians * 180.0 / Math.PI);
      if (angle > 180.0) {
        angle = 360 - angle;
      }
      return angle;
    };

    const intervalId = setInterval(detectPose, 100);

    return () => clearInterval(intervalId);
  }, [webcamRef, canvasRef, selectedExercise, exerciseState, count]);

  return null;
};

export default PoseAnalyzer;
