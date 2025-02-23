export interface QuestProgress {
  addToCartCount: number;
  likedProductsCount: number;
  productViewCount: number;
  quantityAdjustmentCount: number;
}

export interface QuestTask {
  id: string;
  title: string;
  description: string;
  required: number;
  current: number;
  isCompleted: boolean;
}

export interface QuestState {
  progress: QuestProgress;
  tasks: QuestTask[];
} 