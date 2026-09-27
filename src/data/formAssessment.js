// These are intentionally simple demo cues based on visible 2D landmarks.
// They are not clinical measurements and cannot check contact, pain, or balance.
const RULES = {
  'chest-8': {
    name: 'Wide-arm chest opener',
    view: 'front',
    cameraTip: 'Face the camera with both arms visible.',
    type: 'armsOpen',
  },
  'chest-9': {
    name: 'Behind-the-back chest reach',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'armsBehind',
  },
  'chest-3': {
    name: 'Seated hands-clasped chest opener',
    view: 'side',
    cameraTip: 'Sit side-on; keep your shoulders, elbows, and wrists visible.',
    type: 'armsBehind',
  },
  'chest-13': {
    name: 'Seated towel chest opener',
    view: 'side',
    cameraTip: 'Sit side-on; keep your shoulders, elbows, and wrists visible.',
    type: 'armsBehind',
  },
  'chest-17': {
    name: 'Standing palm-back chest stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'armsBehind',
  },
  'chest-18': {
    name: 'Seated chair-back chest opener',
    view: 'side',
    cameraTip: 'Sit side-on; keep your shoulders, elbows, and wrists visible.',
    type: 'armsBehind',
  },
  'shoulders-1': {
    name: 'Cross-body shoulder stretch',
    view: 'front',
    cameraTip: 'Face the camera with shoulders and wrists visible.',
    type: 'crossBody',
  },
  'shoulders-2': {
    name: 'Overhead side reach',
    view: 'front',
    cameraTip: 'Face the camera; keep your hips and raised arm visible.',
    type: 'sideBend',
  },
  'shoulders-3': {
    name: 'Eagle-arm shoulder stretch',
    view: 'front',
    cameraTip: 'Face the camera with both shoulders, elbows, and wrists visible.',
    type: 'eagleArms',
  },
  'shoulders-5': {
    name: 'Shoulder flexion reach',
    view: 'front',
    cameraTip: 'Face the camera with the raised arm visible.',
    type: 'armOverhead',
  },
  'shoulders-9': {
    name: 'Arms-behind shoulder opener',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'armsBehind',
  },
  'shoulders-11': {
    name: 'Wall shoulder slide',
    view: 'front',
    cameraTip: 'Face the camera with both arms and shoulders visible.',
    type: 'bothArmsOverhead',
  },
  'shoulders-12': {
    name: 'Supported cross-body shoulder hold',
    view: 'front',
    cameraTip: 'Face the camera with shoulders and wrists visible.',
    type: 'crossBody',
  },
  'shoulders-13': {
    name: 'Overhead elbow side stretch',
    view: 'front',
    cameraTip: 'Face the camera; keep your hips and raised arm visible.',
    type: 'sideBendBentArm',
  },
  'shoulders-14': {
    name: 'Seated shoulder-blade reach',
    view: 'side',
    cameraTip: 'Sit side-on, facing right; keep both elbows and wrists visible.',
    type: 'armsForward',
  },
  'shoulders-17': {
    name: 'Across-and-down shoulder reach',
    view: 'front',
    cameraTip: 'Face the camera with shoulders and wrists visible.',
    type: 'crossBodyDown',
  },
  'shoulders-19': {
    name: 'Supported shoulder extension',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'armsBehind',
  },
  'upperArms-1': {
    name: 'Overhead triceps stretch',
    view: 'front',
    cameraTip: 'Face the camera with your head, elbow, and wrist visible.',
    type: 'bentArmOverhead',
  },
  'upperArms-2': {
    name: 'Wall biceps stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right; keep the extended arm visible.',
    type: 'armsBehind',
  },
  'upperArms-3': {
    name: 'Seated overhead triceps reach',
    view: 'front',
    cameraTip: 'Face the camera with your head, elbow, and wrist visible.',
    type: 'bentArmOverhead',
  },
  'upperArms-4': {
    name: 'Straight-arm biceps opener',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'armsBehind',
  },
  'upperArms-6': {
    name: 'Standing biceps wall turn',
    view: 'side',
    cameraTip: 'Stand side-on, facing right; keep the extended arm visible.',
    type: 'armsBehind',
  },
  'upperArms-7': {
    name: 'Cross-body triceps reach',
    view: 'front',
    cameraTip: 'Face the camera with shoulders and wrists visible.',
    type: 'crossBodyBent',
  },
  'upperArms-11': {
    name: 'Standing triceps side lean',
    view: 'front',
    cameraTip: 'Face the camera; keep your hips and raised arm visible.',
    type: 'sideBendBentArm',
  },
  'upperArms-9': {
    name: 'Low doorframe biceps stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right; keep the extended arm visible.',
    type: 'armsBehind',
  },
  'upperArms-15': {
    name: 'Overhead elbow-and-wrist stretch',
    view: 'front',
    cameraTip: 'Face the camera with your head, elbow, and wrist visible.',
    type: 'bentArmOverhead',
  },
  'upperArms-17': {
    name: 'Cross-body upper-arm release',
    view: 'front',
    cameraTip: 'Face the camera with shoulders and wrists visible.',
    type: 'crossBodyBent',
  },
  'upperArms-14': {
    name: 'Supported biceps doorway hold',
    view: 'side',
    cameraTip: 'Stand side-on, facing right; keep the extended arm visible.',
    type: 'armsBehind',
  },
  'upperArms-19': {
    name: 'Standing biceps palm turn',
    view: 'side',
    cameraTip: 'Stand side-on, facing right; keep the extended arm visible.',
    type: 'armsBehind',
  },
  'upperBack-1': {
    name: 'Upper-back hug',
    view: 'front',
    cameraTip: 'Face the camera with both arms visible.',
    type: 'selfHug',
  },
  'upperBack-15': {
    name: 'Supported table back lengthener',
    view: 'side',
    cameraTip: 'Stand side-on, facing right; keep your shoulders and hips visible.',
    type: 'hipHinge',
  },
  'upperBack-20': {
    name: 'Hands-clasped back-of-shoulder stretch',
    view: 'side',
    cameraTip: 'Sit or stand side-on, facing right; keep both arms visible.',
    type: 'armsForward',
  },
  'upperBack-9': {
    name: 'Standing self-hug reach',
    view: 'front',
    cameraTip: 'Face the camera with both arms visible.',
    type: 'selfHug',
  },
  'lowerBack-5': {
    name: 'Seated forward hinge',
    view: 'side',
    cameraTip: 'Sit side-on to the camera, facing right in the frame.',
    type: 'hipHinge',
  },
  'lowerBack-6': {
    name: 'Standing side bend',
    view: 'front',
    cameraTip: 'Face the camera with your hips and shoulders visible.',
    type: 'sideBend',
  },
  'lowerBack-14': {
    name: 'Supported back lengthener',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'hipHinge',
  },
  'lowerBack-18': {
    name: 'Seated side reach',
    view: 'front',
    cameraTip: 'Sit facing the camera with your hips and shoulders visible.',
    type: 'sideBend',
  },
  'core-1': {
    name: 'Standing side-body reach',
    view: 'front',
    cameraTip: 'Face the camera with your hips and raised arm visible.',
    type: 'sideBend',
  },
  'core-4': {
    name: 'Kneeling side reach',
    view: 'front',
    cameraTip: 'Face the camera with your hips and raised arm visible.',
    type: 'sideBend',
  },
  'core-9': {
    name: 'Seated crescent reach',
    view: 'front',
    cameraTip: 'Sit facing the camera with your hips and raised arm visible.',
    type: 'sideBend',
  },
  'core-11': {
    name: 'Alternating standing side reach',
    view: 'front',
    cameraTip: 'Face the camera with your hips and raised arm visible.',
    type: 'sideBend',
  },
  'core-16': {
    name: 'Seated overhead side bend',
    view: 'front',
    cameraTip: 'Sit facing the camera with your hips and raised arm visible.',
    type: 'sideBend',
  },
  'core-18': {
    name: 'Wall-supported side-body stretch',
    view: 'front',
    cameraTip: 'Face the camera with your hips and raised arm visible.',
    type: 'sideBend',
  },
  'hips-3': {
    name: 'Seated figure-four',
    view: 'front',
    cameraTip: 'Sit facing the camera; keep both knees and ankles visible.',
    type: 'figureFour',
  },
  'hips-1': {
    name: 'Half-kneeling hip-flexor stretch',
    view: 'side',
    cameraTip: 'Kneel side-on, facing right; keep both legs visible.',
    type: 'frontKneeBend',
  },
  'hips-5': {
    name: 'Standing quad-and-hip stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'standingQuad',
  },
  'hips-6': {
    name: 'Butterfly inner-hip stretch',
    view: 'front',
    cameraTip: 'Sit facing the camera with both knees and ankles visible.',
    type: 'butterfly',
  },
  'hips-9': {
    name: 'Standing glute stretch',
    view: 'front',
    cameraTip: 'Face the camera; keep both hips, knees, and ankles visible.',
    type: 'standingFigureFour',
  },
  'hips-10': {
    name: 'Low lunge hip opener',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'frontKneeBend',
  },
  'hips-13': {
    name: 'Standing hip-flexor reach',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'rearStep',
  },
  'hips-15': {
    name: 'Side-lying quad and hip stretch',
    view: 'side',
    cameraTip: 'Lie side-on with your hips, knees, and ankles visible.',
    type: 'lyingQuad',
  },
  'hips-19': {
    name: 'Half-kneeling side-hip reach',
    view: 'front',
    cameraTip: 'Face the camera with your hips and raised arm visible.',
    type: 'sideBend',
  },
  'hamstrings-3': {
    name: 'Standing hamstring hinge',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'hamstringHinge',
  },
  'hamstrings-2': {
    name: 'Seated hamstring hinge',
    view: 'side',
    cameraTip: 'Sit side-on with your extended leg visible.',
    type: 'hamstringHinge',
  },
  'hamstrings-6': {
    name: 'Supported chair hamstring stretch',
    view: 'side',
    cameraTip: 'Sit side-on with your extended leg visible.',
    type: 'hamstringHinge',
  },
  'hamstrings-10': {
    name: 'Cross-leg hamstring stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'hipHinge',
  },
  'hamstrings-11': {
    name: 'Supported hamstring reach',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'hamstringHinge',
  },
  'hamstrings-13': {
    name: 'Seated one-leg forward hinge',
    view: 'side',
    cameraTip: 'Sit side-on with your extended leg visible.',
    type: 'hamstringHinge',
  },
  'hamstrings-14': {
    name: 'Elevated-heel hamstring stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'hamstringHinge',
  },
  'hamstrings-7': {
    name: 'Half-split hamstring stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right; keep both hips, knees, and ankles visible.',
    type: 'hamstringHinge',
  },
  'hamstrings-17': {
    name: 'Half-kneeling long hamstring reach',
    view: 'side',
    cameraTip: 'Kneel side-on; keep your shoulders, hips, knees, and ankles visible.',
    type: 'hamstringHinge',
  },
  'hamstrings-20': {
    name: 'Towel-supported seated hamstring stretch',
    view: 'side',
    cameraTip: 'Sit side-on with your extended leg visible.',
    type: 'hamstringHinge',
  },
  'hamstrings-18': {
    name: 'Standing hamstring side shift',
    view: 'side',
    cameraTip: 'Stand side-on, facing right in the frame.',
    type: 'hamstringSideShift',
  },
  'calves-1': {
    name: 'Wall calf stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right. Keep both legs visible.',
    type: 'rearKneeStraight',
  },
  'calves-3': {
    name: 'Step-edge calf lower',
    view: 'side',
    cameraTip: 'Stand side-on; keep one foot and ankle in clear view.',
    type: 'heelDrop',
  },
  'calves-2': {
    name: 'Bent-knee soleus stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right. Keep both legs visible.',
    type: 'rearKneeBent',
  },
  'calves-6': {
    name: 'Wall ankle mobility rock',
    view: 'side',
    cameraTip: 'Stand side-on, facing right; keep the front knee and ankle visible.',
    type: 'ankleGlide',
  },
  'calves-7': {
    name: 'Standing bent-knee calf lean',
    view: 'side',
    cameraTip: 'Stand side-on, facing right. Keep both legs visible.',
    type: 'rearKneeBent',
  },
  'calves-9': {
    name: 'Soleus chair stretch',
    view: 'side',
    cameraTip: 'Sit side-on, facing right; keep the bent knee, ankle, and foot visible.',
    type: 'ankleGlide',
  },
  'calves-10': {
    name: 'Runner’s wall stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right. Keep both legs visible.',
    type: 'rearKneeStraight',
  },
  'calves-13': {
    name: 'Supported straight-knee calf stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right. Keep both legs visible.',
    type: 'rearKneeStraight',
  },
  'calves-14': {
    name: 'Supported bent-knee calf stretch',
    view: 'side',
    cameraTip: 'Stand side-on, facing right. Keep both legs visible.',
    type: 'rearKneeBent',
  },
  'calves-16': {
    name: 'Standing heel-down ankle glide',
    view: 'side',
    cameraTip: 'Stand side-on, facing right; keep the front ankle and knee visible.',
    type: 'ankleGlide',
  },
  'calves-18': {
    name: 'Step-supported heel drop',
    view: 'side',
    cameraTip: 'Stand side-on; keep one foot and ankle in clear view.',
    type: 'heelDrop',
  },
}

function point(landmarks, index, aspectRatio) {
  const landmark = landmarks?.[index]
  const confidence = landmark?.visibility ?? landmark?.presence
  if (
    !Number.isFinite(landmark?.x) ||
    !Number.isFinite(landmark?.y) ||
    (confidence !== undefined && confidence < 0.45)
  ) {
    return null
  }
  return { x: landmark.x * aspectRatio, y: landmark.y }
}

function jointAngle(landmarks, first, joint, last, aspectRatio) {
  const a = point(landmarks, first, aspectRatio)
  const b = point(landmarks, joint, aspectRatio)
  const c = point(landmarks, last, aspectRatio)
  if (!a || !b || !c) return null

  const firstVector = { x: a.x - b.x, y: a.y - b.y }
  const lastVector = { x: c.x - b.x, y: c.y - b.y }
  const dot = firstVector.x * lastVector.x + firstVector.y * lastVector.y
  const lengths = Math.hypot(firstVector.x, firstVector.y) * Math.hypot(lastVector.x, lastVector.y)
  if (lengths === 0) return null
  const cosine = Math.max(-1, Math.min(1, dot / lengths))
  return (Math.acos(cosine) * 180) / Math.PI
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function torsoTilt(landmarks, aspectRatio) {
  const leftShoulder = point(landmarks, 11, aspectRatio)
  const rightShoulder = point(landmarks, 12, aspectRatio)
  const leftHip = point(landmarks, 23, aspectRatio)
  const rightHip = point(landmarks, 24, aspectRatio)
  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return null

  const shoulders = midpoint(leftShoulder, rightShoulder)
  const hips = midpoint(leftHip, rightHip)
  return (Math.atan2(shoulders.x - hips.x, hips.y - shoulders.y) * 180) / Math.PI
}

function armCandidates(landmarks, aspectRatio) {
  return [
    { shoulder: 11, elbow: 13, wrist: 15 },
    { shoulder: 12, elbow: 14, wrist: 16 },
  ].map((arm) => ({
    ...arm,
    shoulderPoint: point(landmarks, arm.shoulder, aspectRatio),
    elbowPoint: point(landmarks, arm.elbow, aspectRatio),
    wristPoint: point(landmarks, arm.wrist, aspectRatio),
    elbowAngle: jointAngle(landmarks, arm.shoulder, arm.elbow, arm.wrist, aspectRatio),
  }))
}

function pass(message) {
  return { status: 'pass', message }
}

function adjust(message) {
  return { status: 'adjust', message }
}

function unknown(message = 'Move so the required joints are visible to the camera.') {
  return { status: 'unknown', message }
}

function assessArmsOpen(landmarks, aspectRatio) {
  const arms = armCandidates(landmarks, aspectRatio)
  if (arms.some((arm) => !arm.shoulderPoint || !arm.elbowPoint || !arm.wristPoint)) return unknown()
  const left = arms[0]
  const right = arms[1]
  const shoulderWidth = Math.abs(left.shoulderPoint.x - right.shoulderPoint.x)
  const wristSpan = Math.abs(left.wristPoint.x - right.wristPoint.x)
  const elbowsStraight = left.elbowAngle > 135 && right.elbowAngle > 135
  const wristsNearShoulderHeight =
    Math.abs(left.wristPoint.y - left.shoulderPoint.y) < 0.28 &&
    Math.abs(right.wristPoint.y - right.shoulderPoint.y) < 0.28
  if (elbowsStraight && wristSpan > shoulderWidth * 1.4 && wristsNearShoulderHeight) {
    return pass(
      'Both arms look open near shoulder height. The camera cannot assess shoulder-blade tension.',
    )
  }
  return adjust('Open both arms comfortably out to the sides near shoulder height.')
}

function assessCrossBody(landmarks, aspectRatio, { down = false, bent = false } = {}) {
  const shoulders = [point(landmarks, 11, aspectRatio), point(landmarks, 12, aspectRatio)]
  if (!shoulders[0] || !shoulders[1]) return unknown()
  const centerX = (shoulders[0].x + shoulders[1].x) / 2
  const arms = armCandidates(landmarks, aspectRatio)
  if (arms.some((arm) => !arm.shoulderPoint || !arm.elbowPoint || !arm.wristPoint)) return unknown()

  const crossingArm = arms.find((arm) => {
    const startedOnOneSide = arm.shoulderPoint.x < centerX || arm.shoulderPoint.x > centerX
    const crossesMidline = (arm.shoulderPoint.x - centerX) * (arm.wristPoint.x - centerX) < 0
    const elbowFits = bent ? arm.elbowAngle >= 45 && arm.elbowAngle <= 155 : arm.elbowAngle >= 140
    const levelFits = down
      ? arm.wristPoint.y >= arm.shoulderPoint.y - 0.04
      : Math.abs(arm.wristPoint.y - arm.shoulderPoint.y) < 0.3
    return startedOnOneSide && crossesMidline && elbowFits && levelFits
  })

  if (crossingArm) {
    return pass(
      'The arm is across your body. The supporting-hand position and stretch sensation are not measured.',
    )
  }
  return adjust(
    down
      ? 'Guide one arm across and slightly down.'
      : 'Bring one arm across your chest at a comfortable height.',
  )
}

function assessOverhead(landmarks, aspectRatio, { bent = false } = {}) {
  const arms = armCandidates(landmarks, aspectRatio)
  if (arms.some((arm) => !arm.shoulderPoint || !arm.elbowPoint || !arm.wristPoint)) return unknown()
  const raised = arms.find((arm) => arm.wristPoint.y < arm.shoulderPoint.y - 0.04)
  if (!raised) return adjust('Raise one arm overhead only as far as comfortable.')
  if (bent && raised.elbowAngle > 150) return adjust('Bend the raised elbow gently.')
  if (bent && raised.elbowAngle < 35) return adjust('Ease the elbow bend slightly.')
  return pass(
    bent
      ? 'One arm is overhead with a bent elbow. The other hand guiding the elbow is not measured.'
      : 'One arm is raised above the shoulder. Wall contact and comfortable range are not measured.',
  )
}

function assessSideBend(landmarks, aspectRatio, { requireBentElbow = false } = {}) {
  const arms = armCandidates(landmarks, aspectRatio)
  if (arms.some((arm) => !arm.shoulderPoint || !arm.elbowPoint || !arm.wristPoint)) return unknown()
  const raised = arms.find((arm) => arm.wristPoint.y < arm.shoulderPoint.y - 0.04)
  if (!raised) return adjust('Reach one arm overhead before leaning to the opposite side.')
  if (requireBentElbow && raised.elbowAngle > 150)
    return adjust('Bend the raised elbow comfortably.')

  const tilt = torsoTilt(landmarks, aspectRatio)
  if (tilt === null) return unknown('Keep both shoulders and hips visible.')
  const shoulders = [point(landmarks, 11, aspectRatio), point(landmarks, 12, aspectRatio)]
  const hips = [point(landmarks, 23, aspectRatio), point(landmarks, 24, aspectRatio)]
  const centerX = (shoulders[0].x + shoulders[1].x + hips[0].x + hips[1].x) / 4
  const raisedArmIsRightOnScreen = raised.wristPoint.x > centerX
  const leansAway = raisedArmIsRightOnScreen ? tilt < -6 : tilt > 6

  if (Math.abs(tilt) > 35) return adjust('Ease out of the side bend a little.')
  if (!leansAway) return adjust('Lean gently away from the raised arm.')
  return pass('Your torso leans away from the raised arm. The amount of stretch is not measured.')
}

function assessHipHinge(landmarks, aspectRatio, { requireStraightLeg = false } = {}) {
  const tilt = torsoTilt(landmarks, aspectRatio)
  if (tilt === null) return unknown('Keep your shoulders and hips visible from the side.')
  const hinge = Math.abs(tilt)
  if (hinge < 12) return adjust('Tip forward gently from your hips.')
  if (hinge > 60) return adjust('Come up a little; keep the hinge comfortable.')

  if (requireStraightLeg) {
    const leftKnee = jointAngle(landmarks, 23, 25, 27, aspectRatio)
    const rightKnee = jointAngle(landmarks, 24, 26, 28, aspectRatio)
    if (leftKnee === null && rightKnee === null)
      return unknown('Keep at least one hip, knee, and ankle visible.')
    if (Math.max(leftKnee ?? 0, rightKnee ?? 0) < 140) {
      return adjust('Let one leg extend more, keeping a soft knee.')
    }
  }

  return pass(
    requireStraightLeg
      ? 'A hip hinge and a mostly extended leg are visible. Back alignment and stretch sensation are not measured.'
      : 'A forward hip hinge is visible. The camera cannot judge back comfort or support contact.',
  )
}

function assessHamstringSideShift(landmarks, aspectRatio) {
  const tilt = torsoTilt(landmarks, aspectRatio)
  if (tilt === null) return unknown('Keep your shoulders and hips visible from the side.')
  const hinge = Math.abs(tilt)
  if (hinge < 8)
    return adjust('Place one heel ahead, then hinge slightly and shift your hips back.')
  if (hinge > 55) return adjust('Ease the hinge while keeping both knees soft.')

  const frontFootWithSoftKnee = [
    {
      hip: point(landmarks, 23, aspectRatio),
      ankle: point(landmarks, 27, aspectRatio),
      angle: jointAngle(landmarks, 23, 25, 27, aspectRatio),
    },
    {
      hip: point(landmarks, 24, aspectRatio),
      ankle: point(landmarks, 28, aspectRatio),
      angle: jointAngle(landmarks, 24, 26, 28, aspectRatio),
    },
  ].some(
    (leg) =>
      leg.hip &&
      leg.ankle &&
      leg.angle !== null &&
      leg.ankle.x > leg.hip.x + 0.03 &&
      leg.angle >= 80 &&
      leg.angle < 175,
  )

  if (!frontFootWithSoftKnee)
    return adjust('Set one heel slightly forward and keep that knee softly bent.')
  return pass(
    'A forward heel, soft knee, and torso hinge are visible. The precise hip shift and stretch sensation are not measured.',
  )
}

function kneeAngles(landmarks, aspectRatio) {
  return [
    {
      ankle: point(landmarks, 27, aspectRatio),
      angle: jointAngle(landmarks, 23, 25, 27, aspectRatio),
    },
    {
      ankle: point(landmarks, 28, aspectRatio),
      angle: jointAngle(landmarks, 24, 26, 28, aspectRatio),
    },
  ]
}

function assessRearKnee(landmarks, aspectRatio, { bent = false } = {}) {
  const legs = kneeAngles(landmarks, aspectRatio)
  if (legs.some((leg) => !leg.ankle || leg.angle === null)) {
    return unknown('Keep both hips, knees, and ankles visible from the side.')
  }
  if (Math.abs(legs[0].ankle.x - legs[1].ankle.x) < 0.06) {
    return adjust('Use a staggered stance and face right in the frame.')
  }
  const rearLeg = legs[0].ankle.x < legs[1].ankle.x ? legs[0] : legs[1]
  if (bent) {
    if (rearLeg.angle > 155) return adjust('Soften the back knee while keeping the stretch gentle.')
    if (rearLeg.angle < 95) return adjust('Ease the bend in your back knee.')
    return pass(
      'The back knee appears bent. The camera cannot confirm heel contact with the floor.',
    )
  }
  if (rearLeg.angle < 150) return adjust('Straighten the back knee comfortably.')
  return pass(
    'The back knee appears straight. The camera cannot confirm heel contact with the floor.',
  )
}

function assessStandingQuad(landmarks, aspectRatio) {
  const legs = [
    { hip: point(landmarks, 23, aspectRatio), hipIndex: 23, knee: 25, ankle: 27 },
    { hip: point(landmarks, 24, aspectRatio), hipIndex: 24, knee: 26, ankle: 28 },
  ]
  const bentBehind = legs.find((leg) => {
    const ankle = point(landmarks, leg.ankle, aspectRatio)
    const angle = jointAngle(landmarks, leg.hipIndex, leg.knee, leg.ankle, aspectRatio)
    return leg.hip && ankle && angle !== null && ankle.x < leg.hip.x - 0.02 && angle < 130
  })
  if (bentBehind) {
    return pass(
      'One knee bends behind the body. The hand-to-ankle hold and balance support are not measured.',
    )
  }
  if (
    legs.some(
      (leg) =>
        !leg.hip ||
        !point(landmarks, leg.knee, aspectRatio) ||
        !point(landmarks, leg.ankle, aspectRatio),
    )
  ) {
    return unknown()
  }
  return adjust('Bend one knee behind you, using support for balance as needed.')
}

function assessFrontKneeBend(landmarks, aspectRatio) {
  const legs = kneeAngles(landmarks, aspectRatio)
  if (legs.some((leg) => !leg.ankle || leg.angle === null)) {
    return unknown('Keep both hips, knees, and ankles visible from the side.')
  }
  if (Math.abs(legs[0].ankle.x - legs[1].ankle.x) < 0.06) {
    return adjust('Step one foot forward and face right in the frame.')
  }
  const frontLeg = legs[0].ankle.x > legs[1].ankle.x ? legs[0] : legs[1]
  if (frontLeg.angle > 150) return adjust('Bend the front knee gently into the lunge.')
  if (frontLeg.angle < 65) return adjust('Reduce the bend in the front knee.')
  return pass('The front knee appears bent. Depth, balance, and hip sensation are not measured.')
}

function assessRearStep(landmarks, aspectRatio) {
  const legs = [
    { hip: point(landmarks, 23, aspectRatio), ankle: point(landmarks, 27, aspectRatio) },
    { hip: point(landmarks, 24, aspectRatio), ankle: point(landmarks, 28, aspectRatio) },
  ]
  if (legs.some((leg) => !leg.hip || !leg.ankle))
    return unknown('Keep both hips and ankles visible from the side.')
  const stepsBack = legs.some((leg) => leg.ankle.x < leg.hip.x - 0.05)
  const tilt = torsoTilt(landmarks, aspectRatio)
  if (!stepsBack) return adjust('Step one foot behind you while staying tall.')
  if (tilt === null) return unknown('Keep your shoulders and hips visible.')
  if (Math.abs(tilt) > 22) return adjust('Bring your torso closer to upright.')
  return pass(
    'One foot is behind you and your torso looks upright. Pelvic position is not measured.',
  )
}

function assessFigureFour(landmarks, aspectRatio) {
  const ankles = [point(landmarks, 27, aspectRatio), point(landmarks, 28, aspectRatio)]
  const knees = [point(landmarks, 25, aspectRatio), point(landmarks, 26, aspectRatio)]
  if (ankles.some((item) => !item) || knees.some((item) => !item))
    return unknown('Keep both knees and ankles visible from the front.')
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
  const crossedNearKnee = distance(ankles[0], knees[1]) < 0.2 || distance(ankles[1], knees[0]) < 0.2
  if (crossedNearKnee) {
    return pass(
      'An ankle is near the opposite knee. The support-hand position and hip comfort are not measured.',
    )
  }
  return adjust('Cross one ankle over the opposite thigh or knee, without forcing it.')
}

function assessStandingFigureFour(landmarks, aspectRatio) {
  const ankles = [point(landmarks, 27, aspectRatio), point(landmarks, 28, aspectRatio)]
  const knees = [point(landmarks, 25, aspectRatio), point(landmarks, 26, aspectRatio)]
  const kneeAngles = [
    jointAngle(landmarks, 23, 25, 27, aspectRatio),
    jointAngle(landmarks, 24, 26, 28, aspectRatio),
  ]
  if (
    ankles.some((item) => !item) ||
    knees.some((item) => !item) ||
    kneeAngles.some((angle) => angle === null)
  ) {
    return unknown('Keep both hips, knees, and ankles visible from the front.')
  }
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
  const crossedNearKnee = distance(ankles[0], knees[1]) < 0.2 || distance(ankles[1], knees[0]) < 0.2
  if (!crossedNearKnee)
    return adjust('Cross one ankle over the opposite thigh while holding a support.')
  if (!kneeAngles.some((angle) => angle >= 65 && angle < 155)) {
    return adjust(
      'Keep the ankle crossed and sit your hips back by bending the supporting knee a little.',
    )
  }
  return pass(
    'An ankle is crossed over the opposite leg and a supporting knee is bent. Balance and hip comfort are not measured.',
  )
}

function assessButterfly(landmarks, aspectRatio) {
  const hips = [point(landmarks, 23, aspectRatio), point(landmarks, 24, aspectRatio)]
  const knees = [point(landmarks, 25, aspectRatio), point(landmarks, 26, aspectRatio)]
  const ankles = [point(landmarks, 27, aspectRatio), point(landmarks, 28, aspectRatio)]
  if ([...hips, ...knees, ...ankles].some((item) => !item))
    return unknown('Keep hips, knees, and ankles visible from the front.')
  const hipWidth = Math.abs(hips[0].x - hips[1].x)
  const kneeWidth = Math.abs(knees[0].x - knees[1].x)
  const ankleGap = Math.abs(ankles[0].x - ankles[1].x)
  if (kneeWidth > hipWidth * 1.25 && ankleGap < hipWidth * 0.9) {
    return pass(
      'Your knees are open and your ankles are close. The camera cannot assess pressure or comfort.',
    )
  }
  return adjust('Bring the soles of your feet together and let your knees relax outward.')
}

function assessAnkleGlide(landmarks, aspectRatio) {
  const legs = [
    {
      ankle: point(landmarks, 27, aspectRatio),
      angle: jointAngle(landmarks, 23, 25, 27, aspectRatio),
      knee: point(landmarks, 25, aspectRatio),
    },
    {
      ankle: point(landmarks, 28, aspectRatio),
      angle: jointAngle(landmarks, 24, 26, 28, aspectRatio),
      knee: point(landmarks, 26, aspectRatio),
    },
  ]
  if (legs.some((leg) => !leg.ankle || !leg.knee || leg.angle === null))
    return unknown('Keep the front knee and ankle visible from the side.')
  const advancing = legs.find(
    (leg) => leg.knee.x > leg.ankle.x + 0.02 && leg.angle >= 75 && leg.angle <= 155,
  )
  if (advancing)
    return pass(
      'A knee glides forward over the foot. The camera cannot confirm the heel stays down.',
    )
  return adjust('Bend one knee and glide it forward over the foot without lifting the heel.')
}

function assessArmBehind(landmarks, aspectRatio) {
  const arms = armCandidates(landmarks, aspectRatio)
  if (arms.some((arm) => !arm.shoulderPoint || !arm.elbowPoint || !arm.wristPoint)) return unknown()
  const hips = [point(landmarks, 23, aspectRatio), point(landmarks, 24, aspectRatio)]
  if (hips.some((item) => !item)) return unknown('Keep your hips and arm visible from the side.')
  const hipX = (hips[0].x + hips[1].x) / 2
  const extendedBehind = arms.find((arm) => arm.wristPoint.x < hipX - 0.02 && arm.elbowAngle > 135)
  if (extendedBehind)
    return pass(
      'An arm extends behind the hip. Palm direction and support contact are not measured.',
    )
  return adjust('Reach one arm back with a comfortable, mostly straight elbow.')
}

function assessEagleArms(landmarks, aspectRatio) {
  const arms = armCandidates(landmarks, aspectRatio)
  if (
    arms.some(
      (arm) => !arm.shoulderPoint || !arm.elbowPoint || !arm.wristPoint || arm.elbowAngle === null,
    )
  ) {
    return unknown('Keep both shoulders, elbows, and wrists visible from the front.')
  }
  const centerX = (arms[0].shoulderPoint.x + arms[1].shoulderPoint.x) / 2
  const wristsNearCenter = arms.every((arm) => Math.abs(arm.wristPoint.x - centerX) < 0.16)
  const elbowsBent = arms.every((arm) => arm.elbowAngle >= 45 && arm.elbowAngle <= 145)
  const forearmsRaised = arms.some((arm) => arm.wristPoint.y < arm.elbowPoint.y + 0.03)
  if (wristsNearCenter && elbowsBent && forearmsRaised) {
    return pass(
      'Both arms are bent and the wrists meet near the center. Palm contact is not measured.',
    )
  }
  return adjust('Cross and bend both arms in front of your chest; keep the shoulders relaxed.')
}

function assessBothArmsOverhead(landmarks, aspectRatio) {
  const arms = armCandidates(landmarks, aspectRatio)
  if (arms.some((arm) => !arm.shoulderPoint || !arm.wristPoint)) return unknown()
  if (arms.every((arm) => arm.wristPoint.y < arm.shoulderPoint.y - 0.03)) {
    return pass(
      'Both wrists are above shoulder height. Wall contact and comfortable range are not measured.',
    )
  }
  return adjust('Slide both arms upward only as far as feels comfortable.')
}

function assessArmsForward(landmarks, aspectRatio) {
  const arms = armCandidates(landmarks, aspectRatio)
  if (
    arms.some(
      (arm) => !arm.shoulderPoint || !arm.elbowPoint || !arm.wristPoint || arm.elbowAngle === null,
    )
  ) {
    return unknown('Keep at least one full arm visible from the side.')
  }
  const reachingForward = arms.some(
    (arm) => arm.elbowAngle > 125 && arm.wristPoint.x > arm.shoulderPoint.x + 0.04,
  )
  if (reachingForward)
    return pass(
      'A mostly extended arm reaches forward. Hand position and shoulder-blade movement are not measured.',
    )
  return adjust('Reach both hands forward and gently spread your shoulder blades.')
}

function assessLyingQuad(landmarks, aspectRatio) {
  const legs = [
    { hip: point(landmarks, 23, aspectRatio), hipIndex: 23, knee: 25, ankle: 27 },
    { hip: point(landmarks, 24, aspectRatio), hipIndex: 24, knee: 26, ankle: 28 },
  ].map((leg) => ({
    ...leg,
    anklePoint: point(landmarks, leg.ankle, aspectRatio),
    angle: jointAngle(landmarks, leg.hipIndex, leg.knee, leg.ankle, aspectRatio),
  }))
  const foldedLeg = legs.find((leg) => {
    if (!leg.hip || !leg.anklePoint || leg.angle === null) return false
    const ankleToHip = Math.hypot(leg.anklePoint.x - leg.hip.x, leg.anklePoint.y - leg.hip.y)
    return leg.angle < 135 && ankleToHip < 0.42
  })
  if (foldedLeg)
    return pass(
      'One leg is bent with the ankle near the hip. The hand hold and spinal position are not measured.',
    )
  if (legs.some((leg) => !leg.hip || !leg.anklePoint || leg.angle === null)) return unknown()
  return adjust(
    'Bend the upper knee and bring the heel toward your seat without arching your back.',
  )
}

function assessHeelDrop(landmarks, aspectRatio) {
  const feet = [
    { heel: point(landmarks, 29, aspectRatio), toe: point(landmarks, 31, aspectRatio) },
    { heel: point(landmarks, 30, aspectRatio), toe: point(landmarks, 32, aspectRatio) },
  ]
  const visibleFeet = feet.filter((foot) => foot.heel && foot.toe)
  if (!visibleFeet.length) return unknown('Keep one foot and ankle visible from the side.')
  const heelBelowForefoot = visibleFeet.some((foot) => foot.heel.y > foot.toe.y + 0.025)
  if (heelBelowForefoot)
    return pass(
      'The heel appears lower than the forefoot. Step contact and balance are not measured.',
    )
  return adjust('Lower one heel gently below the level of the forefoot, without bouncing.')
}

function assessSelfHug(landmarks, aspectRatio) {
  const shoulders = [point(landmarks, 11, aspectRatio), point(landmarks, 12, aspectRatio)]
  const arms = armCandidates(landmarks, aspectRatio)
  if (
    shoulders.some((item) => !item) ||
    arms.some((arm) => !arm.shoulderPoint || !arm.elbowPoint || !arm.wristPoint)
  )
    return unknown()
  const center = (shoulders[0].x + shoulders[1].x) / 2
  const crossedArms = arms.filter(
    (arm) =>
      (arm.shoulderPoint.x - center) * (arm.wristPoint.x - center) < 0 && arm.elbowAngle < 150,
  )
  if (crossedArms.length === 2)
    return pass('Both arms cross the torso. The hand-to-shoulder placement is not measured.')
  return adjust('Cross your arms around your upper body and gently widen your shoulder blades.')
}

function evaluate(rule, landmarks, aspectRatio) {
  switch (rule.type) {
    case 'armsOpen':
      return assessArmsOpen(landmarks, aspectRatio)
    case 'crossBody':
      return assessCrossBody(landmarks, aspectRatio)
    case 'crossBodyDown':
      return assessCrossBody(landmarks, aspectRatio, { down: true })
    case 'crossBodyBent':
      return assessCrossBody(landmarks, aspectRatio, { bent: true })
    case 'armOverhead':
      return assessOverhead(landmarks, aspectRatio)
    case 'bentArmOverhead':
      return assessOverhead(landmarks, aspectRatio, { bent: true })
    case 'sideBend':
      return assessSideBend(landmarks, aspectRatio)
    case 'sideBendBentArm':
      return assessSideBend(landmarks, aspectRatio, { requireBentElbow: true })
    case 'hipHinge':
      return assessHipHinge(landmarks, aspectRatio)
    case 'hamstringHinge':
      return assessHipHinge(landmarks, aspectRatio, { requireStraightLeg: true })
    case 'hamstringSideShift':
      return assessHamstringSideShift(landmarks, aspectRatio)
    case 'rearKneeStraight':
      return assessRearKnee(landmarks, aspectRatio)
    case 'rearKneeBent':
      return assessRearKnee(landmarks, aspectRatio, { bent: true })
    case 'standingQuad':
      return assessStandingQuad(landmarks, aspectRatio)
    case 'frontKneeBend':
      return assessFrontKneeBend(landmarks, aspectRatio)
    case 'rearStep':
      return assessRearStep(landmarks, aspectRatio)
    case 'figureFour':
      return assessFigureFour(landmarks, aspectRatio)
    case 'standingFigureFour':
      return assessStandingFigureFour(landmarks, aspectRatio)
    case 'butterfly':
      return assessButterfly(landmarks, aspectRatio)
    case 'ankleGlide':
      return assessAnkleGlide(landmarks, aspectRatio)
    case 'armsBehind':
      return assessArmBehind(landmarks, aspectRatio)
    case 'selfHug':
      return assessSelfHug(landmarks, aspectRatio)
    case 'eagleArms':
      return assessEagleArms(landmarks, aspectRatio)
    case 'bothArmsOverhead':
      return assessBothArmsOverhead(landmarks, aspectRatio)
    case 'armsForward':
      return assessArmsForward(landmarks, aspectRatio)
    case 'lyingQuad':
      return assessLyingQuad(landmarks, aspectRatio)
    case 'heelDrop':
      return assessHeelDrop(landmarks, aspectRatio)
    default:
      return unknown('No demo rule is configured for this stretch.')
  }
}

export function getFormRule(stretchId) {
  return RULES[stretchId] ?? null
}

export function assessStretchForm(stretchId, landmarks, aspectRatio = 16 / 9) {
  const rule = getFormRule(stretchId)
  if (!rule) {
    return {
      status: 'tracking-only',
      message: 'No demo form check is configured. Follow the written cues for this stretch.',
    }
  }
  return {
    ...evaluate(rule, landmarks, aspectRatio),
    ruleName: rule.name,
    cameraTip: rule.cameraTip,
  }
}

export const supportedFormRuleCount = Object.keys(RULES).length
