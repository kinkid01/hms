'use client';
import React, { ReactNode } from 'react';
import 'styles/App.css';
import 'styles/Contact.css';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from 'contexts/AuthContext';
import theme from '../theme/theme';
import EmotionRegistry from './EmotionRegistry';

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <EmotionRegistry>
      <ChakraProvider theme={theme}>
        <AuthProvider>{children}</AuthProvider>
      </ChakraProvider>
    </EmotionRegistry>
  );
}
