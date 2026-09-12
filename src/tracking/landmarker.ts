import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

let landmarkerInstance: HandLandmarker | null = null;
let initPromise: Promise<HandLandmarker> | null = null;

export async function getHandLandmarker(): Promise<HandLandmarker> {
  if (landmarkerInstance) {
    return landmarkerInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    let vision;
    const isFileProto = typeof window !== 'undefined' && window.location.protocol === 'file:';

    // 1. Resolve WASM files (Local server /wasm -> relative ./wasm -> jsdelivr CDN)
    try {
      vision = await FilesetResolver.forVisionTasks(isFileProto ? './wasm' : '/wasm');
    } catch (e1) {
      console.warn('Primary WASM load failed, trying fallback path...', e1);
      try {
        vision = await FilesetResolver.forVisionTasks('./wasm');
      } catch (e2) {
        console.warn('Local WASM fallback failed, falling back to jsdelivr CDN...', e2);
        vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
      }
    }

    // 2. Initialize HandLandmarker (Local GPU -> Local CPU -> CDN CPU)
    let landmarker: HandLandmarker | null = null;
    const localModelPath = isFileProto ? './models/hand_landmarker.task' : '/models/hand_landmarker.task';

    const candidateConfigs = [
      { path: localModelPath, delegate: 'GPU' as const },
      { path: localModelPath, delegate: 'CPU' as const },
      { path: './models/hand_landmarker.task', delegate: 'CPU' as const },
      { path: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: 'CPU' as const }
    ];

    let lastError: unknown = null;
    for (const cfg of candidateConfigs) {
      try {
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: cfg.path,
            delegate: cfg.delegate
          },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.4,
          minHandPresenceConfidence: 0.4,
          minTrackingConfidence: 0.4
        });
        console.log(`[MediaPipe] HandLandmarker successfully loaded (model: ${cfg.path}, delegate: ${cfg.delegate})`);
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[MediaPipe] Candidate failed (${cfg.path}, ${cfg.delegate}):`, err);
      }
    }

    if (!landmarker) {
      throw lastError || new Error('Failed to create HandLandmarker on all delegates');
    }

    landmarkerInstance = landmarker;
    return landmarker;
  })().catch((err) => {
    initPromise = null;
    throw err;
  });

  return initPromise;
}

if (typeof window !== 'undefined') {
  (window as any).__getHandLandmarker = getHandLandmarker;
}
