// MobileNet model loader and on-device inference executor

let model: any = null;

export async function loadMobileNetModel(onProgress: (progress: number) => void) {
  if (model) {
    onProgress(100);
    return model;
  }
  
  try {
    onProgress(10);
    // Dynamically import TF.js and MobileNet models
    const tf = await import('@tensorflow/tfjs');
    onProgress(30);
    
    // Ensure TF.js is fully initialized
    await tf.ready();
    onProgress(50);
    
    const mobilenet = await import('@tensorflow-models/mobilenet');
    onProgress(70);
    
    // Load MobileNetV2 with version 2
    model = await mobilenet.load({
      version: 2,
      alpha: 1.0
    });
    
    onProgress(100);
    return model;
  } catch (err) {
    console.error('Failed to load TensorFlow.js or MobileNetV2 model', err);
    throw err;
  }
}

export async function extractFeatures(
  imageElement: HTMLImageElement | HTMLCanvasElement
): Promise<{ vector: number[]; score: number; label: string }> {
  if (!model) {
    throw new Error('Model is not loaded. Call loadMobileNetModel first.');
  }

  // 1. Run local MobileNet classification
  const classifications = await model.classify(imageElement);
  const topClassification = classifications[0] || { className: 'Unknown', probability: 0 };

  // 2. Extract 1024-dimensional feature vector activation maps
  // model.infer(img, true) extracts the penultimate layer activations (1024 values)
  const activationTensor = model.infer(imageElement, true);
  const vector = Array.from(await activationTensor.data()) as number[];

  // Clean up WebGL tensor allocations to prevent memory leaks
  activationTensor.dispose();

  return {
    vector,
    score: topClassification.probability,
    label: topClassification.className
  };
}
