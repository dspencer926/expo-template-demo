const fs = require('fs');
const path = require('path');

const screens = [
  // Auth screens
  { name: 'ResetPasswordScreen', path: 'src/screens/auth', title: 'Reset Password' },
  { name: 'BiometricSetupScreen', path: 'src/screens/auth', title: 'Biometric Setup' },
  { name: 'MFASetupScreen', path: 'src/screens/auth', title: 'MFA Setup' },
  { name: 'MFAVerifyScreen', path: 'src/screens/auth', title: 'MFA Verification' },

  // Home screens
  { name: 'DetailsScreen', path: 'src/screens/home', title: 'Details' },
  { name: 'SearchScreen', path: 'src/screens/home', title: 'Search' },
  { name: 'NotificationsScreen', path: 'src/screens/home', title: 'Notifications' },

  // Profile screens
  { name: 'ProfileScreen', path: 'src/screens/profile', title: 'Profile' },
  { name: 'EditProfileScreen', path: 'src/screens/profile', title: 'Edit Profile' },
  { name: 'ChangePasswordScreen', path: 'src/screens/profile', title: 'Change Password' },
  { name: 'ProfilePictureScreen', path: 'src/screens/profile', title: 'Profile Picture' },

  // Settings screens
  { name: 'SettingsScreen', path: 'src/screens/settings', title: 'Settings' },
  { name: 'AccountScreen', path: 'src/screens/settings', title: 'Account' },
  { name: 'SecurityScreen', path: 'src/screens/settings', title: 'Security' },
  { name: 'PrivacyScreen', path: 'src/screens/settings', title: 'Privacy' },
  { name: 'LanguageScreen', path: 'src/screens/settings', title: 'Language' },
  { name: 'ThemeScreen', path: 'src/screens/settings', title: 'Theme' },
  { name: 'AboutScreen', path: 'src/screens/settings', title: 'About' },
  { name: 'SupportScreen', path: 'src/screens/settings', title: 'Support' },
];

const template = (name, title) => `import React from 'react';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

export function ${name}() {
  return (
    <Screen title="${title}" centered>
      <Text variant="body-md" color="secondary">
        ${title} implementation would go here
      </Text>
    </Screen>
  );
}
`;

screens.forEach(({ name, path: screenPath, title }) => {
  const dir = path.join(__dirname, '..', screenPath);
  const filePath = path.join(dir, `${name}.tsx`);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, template(name, title));
    console.log(`Created ${filePath}`);
  }
});

console.log('All placeholder screens created!');
