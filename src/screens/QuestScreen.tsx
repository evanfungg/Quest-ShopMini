import React from 'react';
import {ScrollView} from 'react-native';
import {
  SafeAreaView,
  Box,
  Text,
  ProgressIndicators,
  Divider,
  useTheme,
} from '@shopify/shop-minis-platform-sdk';

import {useQuest} from '../hooks/useQuest';

import {useSharedValue} from 'react-native-reanimated';

export function QuestScreen() {
  const theme = useTheme();
  const {questState} = useQuest();

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.colors['backgrounds-regular']}}
    >
      <ScrollView>
        <Box flex={1} paddingHorizontal="gutter" marginBottom="s">
          <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 8, marginTop: 4}}>
            Your Quests
          </Text>
          <Text style={{fontSize: 18, marginBottom: 16}}>
            Complete tasks to unlock achievements!
          </Text>

          {questState.tasks.map(task => (
            <Box key={task.id} marginBottom="l">
              <Box flexDirection="row" justifyContent="space-between" marginBottom="xs">
                <Text style={{fontWeight: 'bold'}}>{task.title}</Text>
                <Text>
                  {task.current}/{task.required}
                </Text>
              </Box>
              <Text style={{fontSize: 14, marginBottom: 8}}>
                {task.description}
              </Text>
              <ProgressIndicators
                numberOfIndicators={task.required}
                currentStep={task.current}
                progress={useSharedValue(task.current / task.required)}
              />
              {task.isCompleted && (
                <Text style={{fontSize: 14, color: 'green', marginTop: 4}}>
                  Completed!
                </Text>
              )}
              <Divider marginTop="s" />
            </Box>
          ))}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
} 