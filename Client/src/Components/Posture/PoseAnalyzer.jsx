import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { drawSkeleton, analyzePose } from '../../utils/exerciseUtils';

const PoseAnalyzer = ({ webcamRef, canvasRef, selectedExercise, setCount, setFeedback, setExerciseState, setIsLoading }) => {
  const detectorRef = useRef(null);
  const [angle, setAngle] = useState(null);
  const exerciseStateRef = useRef('ready');

  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      await tf.setBackend('webgl');
      const detectorConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };
      detectorRef.current = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, detectorConfig);
      setIsLoading(false);
    };
    loadModel();
  }, [setIsLoading]);

  useEffect(() => {
    const detectPose = async () => {
      if (!detectorRef.current || !webcamRef.current || !canvasRef.current) return;

      if (webcamRef.current.video.readyState === 4) {
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
          drawSkeleton(ctx, poses[0], videoWidth, videoHeight, selectedExercise, angle);
          analyzePose(poses[0], selectedExercise, setAngle, exerciseStateRef, setExerciseState, setCount, setFeedback);
        }
      }
    };

    const intervalId = setInterval(detectPose, 100);
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamRef, canvasRef, selectedExercise, angle]);

  return null;
};

PoseAnalyzer.propTypes = {
  webcamRef: PropTypes.shape({
    current: PropTypes.shape({
      video: PropTypes.instanceOf(HTMLVideoElement),
    }),
  }).isRequired,
  canvasRef: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLCanvasElement),
  }).isRequired,
  selectedExercise: PropTypes.string.isRequired,
  setCount: PropTypes.func.isRequired,
  setFeedback: PropTypes.func.isRequired,
  setExerciseState: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default PoseAnalyzer;
