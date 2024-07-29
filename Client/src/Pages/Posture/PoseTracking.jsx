import { useRef, useEffect, useState } from 'react';
import '@mediapipe/pose';
import { Pose } from '@mediapipe/pose';
import * as tf from '@tensorflow/tfjs';

const PoseTracking = () => {
  const [poseData, setPoseData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startVideo = async () => {
      const video = videoRef.current;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        video.srcObject = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
      }
    };

    const initializePose = async () => {
      await tf.setBackend('webgl');
      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      pose.onResults(onResults);

      // eslint-disable-next-line no-undef
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    };

    const onResults = (results) => {
      if (results.poseLandmarks) {
        setPoseData(results.poseLandmarks);
        drawLandmarks(results.poseLandmarks);
      }
    };

    const drawLandmarks = (landmarks) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'red';
      ctx.fillStyle = 'red';
      ctx.lineWidth = 2;

      landmarks.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    startVideo();
    initializePose();
  }, []);

  return (
    <div className="pose-tracking">
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="640" height="480" />
      <div>
        {poseData && (
          <div>
            <h2>Pose Data:</h2>
            <pre>{JSON.stringify(poseData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoseTracking;
