const fs = require('fs');
const path = require('path');
const dir = 'd:/anigravity_project_rahul/arogyasahayak/src/pages/predictors';
const files = fs.readdirSync(dir).filter(f => f.endsWith('tsx') && f !== 'PredictorsHub.tsx');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace imports
  content = content.replace(
    /import type \{ PredictionData \} from '\.\.\/\.\.\/components\/medical\/PredictionResult';/g,
    'import type { PredictionData } from \'../../lib/types/prediction\';\nimport { templateRenderer } from \'../../utils/templateRenderer\';'
  );

  content = content.replace(
    /import \{ PredictionData \} from '\.\.\/\.\.\/components\/medical\/PredictionResult';/g,
    'import { PredictionData } from \'../../lib/types/prediction\';\nimport { templateRenderer } from \'../../utils/templateRenderer\';'
  );

  const match = content.match(/getLocalPredictionFallback\('([^']+)'/);
  if (!match) return;
  const pId = match[1];

  content = content.replace(
    /if \(error\) throw error;\s*setResult\(data\);\s*logPrediction\('[^']+', validationResult\.data, data\);\s*\} catch \((err|error|[^)]*)\) \{/g,
    `if (error) throw error;
      let finalResult = data;
      if (data.llm_failed && data.facts) {
        finalResult = templateRenderer(data.facts);
        showToast("AI Narrative generation failed. Displaying Basic Assessment.", "warning");
      }
      setResult(finalResult);
      logPrediction('${pId}', validationResult.data, finalResult);
    } catch ($1) {`
  );
  
  content = content.replace(
    /const fallbackResult = getLocalPredictionFallback\('[^']+', validationResult\.data\);\s*setResult\(fallbackResult\);/g,
    `const offlineFacts = getLocalPredictionFallback('${pId}', validationResult.data);
      const fallbackResult = templateRenderer(offlineFacts);
      setResult(fallbackResult);`
  );

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
