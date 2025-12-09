'use client';

import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const router = useRouter();

  return (
    <Container size="sm" className="py-20 text-center text-[var(--af-ink)]">
      <Stack gap="md" align="center">
        <Title order={1} className="gradient-text">
          Page not found
        </Title>
        <Text c="gray.4" maw={420}>
          The page you are looking for does not exist or has been moved.
        </Text>
        <Button
          variant="light"
          color="fox"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => router.replace('/')}
        >
          Back to dashboard
        </Button>
      </Stack>
    </Container>
  );
};
