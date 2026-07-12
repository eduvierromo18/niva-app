type GoalProgressInput = {
  current: number;
  target: number;
};

export function getFeaturedGoalProgress(goal?: GoalProgressInput) {
  if (!goal || goal.target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((goal.current / goal.target) * 100)));
}
