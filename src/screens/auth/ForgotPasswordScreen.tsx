import React from 'react';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export function ForgotPasswordScreen({ navigation }: any) {
  return (
    <Screen title="Forgot Password" subtitle="Reset your password" centered>
      <Text variant="body-md" color="secondary" style={{ marginBottom: 24 }}>
        Password reset form would be implemented here
      </Text>
      <Button onPress={() => navigation.goBack()}>Back to Login</Button>
    </Screen>
  );
}
