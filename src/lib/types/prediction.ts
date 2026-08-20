export interface PredictionFacts {
  version: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Insufficient Data';
  riskScore: number;
  flaggedConditions: string[];
  recommendedAction: 'monitor' | 'consult_doctor' | 'urgent_care';
  computedBy: 'offline_rules' | 'server_rules' | 'server_rules_ml';
  timestamp: string;
  safetyGateStatus?: 'usable' | 'uncertain_further_evaluation';
}

export interface PredictionData {
  risk: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Insufficient Data';
  confidence: number;
  reasoning: string[];
  recommendations: string[];
  urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
  missing_fields?: string[];
  sos_guidance?: string | null;
  disclaimer: string;
  computedBy: 'offline_rules' | 'server_rules' | 'server_rules_ml' | 'llm_narrative';
  // Explainable AI & Quality Fields
  heatmapUrl?: string;
  compositeUrl?: string;
  originalImageUrl?: string;
  safetyGateStatus?: 'usable' | 'uncertain_further_evaluation';
  qualityMetrics?: {
    blurScore: number;
    brightnessScore: number;
    contrastScore: number;
    status: 'excellent' | 'acceptable' | 'poor';
  };
}
