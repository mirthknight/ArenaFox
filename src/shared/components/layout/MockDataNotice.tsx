import { Alert, Group, Text } from '@mantine/core';
import { Info } from 'lucide-react';

export const MockDataNotice = () => (
    <Alert
        color="indigo"
        variant="light"
        icon={<Info size={16} />}
        radius="md"
        className="bg-indigo-50 border-indigo-100"
        title="Preview data"
    >
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
            <Text size="sm" c="dimmed">
                This dashboard is currently showing mock data for layout review. Connect Supabase to replace it with live content.
            </Text>
        </Group>
    </Alert>
);
