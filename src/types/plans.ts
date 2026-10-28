export type CriterionStatus = 'mandatory' | 'optional' | 'informative';
export type CriterionType = 'qualitative' | 'quantitative';
export type ViolationBehavior = 'warning' | 'breach' | 'info';

export interface PlanCriterion {
  id: string;
  name: string;
  description?: string;
  category: string;
  instructions?: string;
  status: CriterionStatus;
  type: CriterionType;
  weight: number;
  includeInScore: boolean;
  numericField?: 'rr' | 'risk' | 'pnl';
  numericThreshold?: number;
  numericOperator?: '>=' | '<=' | '>';
  violationBehavior: ViolationBehavior;
  notes?: string;
}

export interface TradingPlan {
  id: string;
  name: string;
  strategyTemplate: string;
  description?: string;
  version: number;
  isActive: boolean;
  scoringEnabled: boolean;
  minScoreToExecute?: number;
  criteria: PlanCriterion[];
  guardian: {
    maxRiskPerTrade: number;
    maxDailyLoss: number;
    maxTradesPerDay: number;
    minRR: number;
    maxConsecutiveLosses: number;
  };
  createdAt: string;
  updatedAt: string;
  /** Plan modèle créé automatiquement et jamais modifié : non synchronisé (évite les doublons entre appareils). */
  seeded?: boolean;
}

export interface CriterionEvaluation {
  criterionId: string;
  name: string;
  category: string;
  weight: number;
  includeInScore: boolean;
  status: CriterionStatus;
  type: CriterionType;
  validated: boolean;
  violated: boolean;
  violationReason?: string;
  violationBehavior: ViolationBehavior;
}

export interface PlanExecutionSnapshot {
  planId: string;
  planName: string;
  planVersion: number;
  scoringEnabled: boolean;
  score: number | null; // 0-100 if enabled
  maxPossibleScore: number;
  criteria: CriterionEvaluation[];
  violations: string[];
  guardianStatus: 'aligned' | 'warning' | 'breach';
  guardianRules: TradingPlan['guardian'];
}
