import {useState, useEffect} from 'react';
import {useAsyncStorage} from '@shopify/shop-minis-platform-sdk';

import {QuestState, QuestProgress, QuestTask} from '../types/quest';

const QUEST_STORAGE_KEY = 'quest_progress';

const INITIAL_PROGRESS: QuestProgress = {
  addToCartCount: 0,
  likedProductsCount: 0,
  productViewCount: 0,
  quantityAdjustmentCount: 0,
};

const QUEST_TASKS: QuestTask[] = [
  {
    id: 'add_to_cart',
    title: 'Cart Master',
    description: 'Add 3 products to your cart',
    required: 3,
    current: 0,
    isCompleted: false,
  },
  {
    id: 'like_products',
    title: 'Product Enthusiast',
    description: 'Like 5 products',
    required: 5,
    current: 0,
    isCompleted: false,
  },
  {
    id: 'view_products',
    title: 'Window Shopper',
    description: 'View 10 product details',
    required: 10,
    current: 0,
    isCompleted: false,
  },
  {
    id: 'adjust_quantity',
    title: 'Quantity Manager',
    description: 'Adjust product quantities 5 times',
    required: 5,
    current: 0,
    isCompleted: false,
  },
];

export function useQuest() {
  const [questState, setQuestState] = useState<QuestState>({
    progress: INITIAL_PROGRESS,
    tasks: QUEST_TASKS,
  });
  
  const {getItem, setItem} = useAsyncStorage();

  useEffect(() => {
    loadQuestProgress();
  }, []);

  const loadQuestProgress = async () => {
    try {
      const savedProgress = await getItem(QUEST_STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setQuestState(parsed);
      }
    } catch (error) {
      console.error('Failed to load quest progress:', error);
    }
  };

  const saveQuestProgress = async (newState: QuestState) => {
    try {
      await setItem(QUEST_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save quest progress:', error);
    }
  };

  const updateProgress = (type: keyof QuestProgress) => {
    const newState = {
      progress: {
        ...questState.progress,
        [type]: questState.progress[type] + 1,
      },
      tasks: questState.tasks.map(task => {
        if (
          (task.id === 'add_to_cart' && type === 'addToCartCount') ||
          (task.id === 'like_products' && type === 'likedProductsCount') ||
          (task.id === 'view_products' && type === 'productViewCount') ||
          (task.id === 'adjust_quantity' && type === 'quantityAdjustmentCount')
        ) {
          const current = questState.progress[type] + 1;
          return {
            ...task,
            current,
            isCompleted: current >= task.required,
          };
        }
        return task;
      }),
    };

    setQuestState(newState);
    saveQuestProgress(newState);
  };

  return {
    questState,
    updateProgress,
  };
} 