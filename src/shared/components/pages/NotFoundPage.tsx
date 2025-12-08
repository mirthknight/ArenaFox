import { Button, Container, Title, Text, Stack } from '@mantine/core';
import { Ghost, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeIconFrame } from '@/shared/components/ui';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container className="h-full flex items-center justify-center p-8">
            <Stack align="center" gap="lg" className="text-center">
                <ThemeIconFrame icon={<Ghost size={32} />} className="w-20 h-20" />

                <div>
                    <Title order={1} className="text-4xl text-white mb-2">404: Page Not Found</Title>
                    <Text c="dimmed" size="lg" maw={500}>
                        The page you are looking for has vanished into the void. It might have been moved, deleted, or never existed in the first place.
                    </Text>
                </div>

                <Button
                    size="lg"
                    variant="light"
                    color="gray"
                    leftSection={<Home size={18} />}
                    onClick={() => navigate('/')}
                >
                    Return to Dashboard
                </Button>
            </Stack>
        </Container>
    );
};
