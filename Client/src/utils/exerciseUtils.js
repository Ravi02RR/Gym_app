export const drawSkeleton = (ctx, pose, videoWidth, videoHeight, selectedExercise, angle) => {
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
  
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, videoWidth, videoHeight);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
  
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
  
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.5) {
        const { x, y } = keypoint;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  
    const boxHeight = 120;
    const boxY = videoHeight - boxHeight;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, boxY, videoWidth, boxHeight);
  
    if (angle !== null) {
      const angleType = selectedExercise === 'Squats' ? 'Knee' : 'Elbow';
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(`${angleType} Angle: ${angle.toFixed(0)}°`, 20, boxY + 30);
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
  
  export const analyzePose = (pose, selectedExercise, setAngle, exerciseStateRef, setExerciseState, setCount, setFeedback) => {
    let newAngle;
    if (selectedExercise === 'Squats') {
      newAngle = analyzeSquats(pose, exerciseStateRef, setExerciseState, setCount, setFeedback);
    } else if (selectedExercise === 'Push-ups') {
      newAngle = analyzePushups(pose, exerciseStateRef, setExerciseState, setCount, setFeedback);
    }
    setAngle(newAngle);
  };
  
  const analyzeSquats = (pose, exerciseStateRef, setExerciseState, setCount, setFeedback) => {
    const leftHip = pose.keypoints.find(kp => kp.name === 'left_hip');
    const leftKnee = pose.keypoints.find(kp => kp.name === 'left_knee');
    const leftAnkle = pose.keypoints.find(kp => kp.name === 'left_ankle');
  
    if (leftHip && leftKnee && leftAnkle) {
      const angle = calculateAngle(leftHip, leftKnee, leftAnkle);
  
      if (angle > 160 && exerciseStateRef.current === 'down') {
        setExerciseState('up');
        exerciseStateRef.current = 'up';
        setCount(prevCount => prevCount + 1);
      } else if (angle < 90 && exerciseStateRef.current === 'up') {
        setExerciseState('down');
        exerciseStateRef.current = 'down';
      }
  
      let feedbackText = '';
      if (angle < 90) {
        feedbackText = 'Good depth!';
      } else if (angle < 160) {
        feedbackText = 'Lower!';
      } else {
        feedbackText = 'Stand tall';
      }
      setFeedback(feedbackText);
  
      return angle;
    }
    return null;
  };
  
  const analyzePushups = (pose, exerciseStateRef, setExerciseState, setCount, setFeedback) => {
    const leftShoulder = pose.keypoints.find(kp => kp.name === 'left_shoulder');
    const leftElbow = pose.keypoints.find(kp => kp.name === 'left_elbow');
    const leftWrist = pose.keypoints.find(kp => kp.name === 'left_wrist');
  
    if (leftShoulder && leftElbow && leftWrist) {
      const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  
      if (angle > 160 && exerciseStateRef.current === 'down') {
        setExerciseState('up');
        exerciseStateRef.current = 'up';
        setCount(prevCount => prevCount + 1);
      } else if (angle < 90 && exerciseStateRef.current === 'up') {
        setExerciseState('down');
        exerciseStateRef.current = 'down';
      }
  
      let feedbackText = '';
      if (angle < 90) {
        feedbackText = 'Push up!';
      } else if (angle < 160) {
        feedbackText = 'Lower!';
      } else {
        feedbackText = 'Good form';
      }
      setFeedback(feedbackText);
  
      return angle;
    }
    return null;
  };
  