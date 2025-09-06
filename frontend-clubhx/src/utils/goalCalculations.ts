import { CategoryGoal } from '@/types/vendor';

export const calculateCategoryAchievement = (
  actual: number,
  goal: number
): number => {
  return Math.round((actual / goal) * 100);
};

export const calculateCategoriesWithProgress = (
  categoryGoals: CategoryGoal[],
  salesByCategory: Record<string, number>
) => {
  return categoryGoals.map(goal => {
    const actualSales = salesByCategory[goal.category] || 0;
    const progress = calculateCategoryAchievement(actualSales, goal.amount);
    const remaining = Math.max(0, goal.amount - actualSales);
    
    return {
      ...goal,
      actualSales,
      progress,
      remaining,
      status: progress >= 100 ? 'completed' : progress >= 80 ? 'on-track' : progress >= 60 ? 'near-target' : 'at-risk'
    };
  });
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 100) return 'text-goal-completed';
  if (progress >= 80) return 'text-goal-on-track';
  if (progress >= 60) return 'text-goal-near-target';
  return 'text-goal-at-risk';
};

export const getProgressBarColor = (progress: number): string => {
  if (progress >= 100) return 'bg-goal-completed';
  if (progress >= 80) return 'bg-goal-on-track';
  if (progress >= 60) return 'bg-goal-near-target';
  return 'bg-goal-at-risk';
};

export const getStatusBorderColor = (status: string): string => {
  switch (status) {
    case 'completed': return 'border-goal-completed/40 bg-goal-completed-bg';
    case 'on-track': return 'border-goal-on-track/40 bg-goal-on-track-bg';
    case 'near-target': return 'border-goal-near-target/40 bg-goal-near-target-bg';
    case 'at-risk': return 'border-goal-at-risk/40 bg-goal-at-risk-bg';
    default: return 'border-border bg-card';
  }
};