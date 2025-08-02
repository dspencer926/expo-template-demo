import React from 'react';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

export function AboutScreen() {
  return (
    <Screen title="About" centered>
      <Text variant="body-md" color="secondary">
        About implementation would go here
      </Text>
    </Screen>
  );
}
