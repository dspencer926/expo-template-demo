import React from 'react';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export function RegisterScreen({ navigation }: any) {
  return (
    <Screen title="Create Account" subtitle="Join us today" centered>
      <Text variant="body-md" color="secondary" style={{ marginBottom: 24 }}>
        Registration form would be implemented here
      </Text>
      <Button onPress={() => navigation.goBack()}>Back to Login</Button>
    </Screen>
  );
}
