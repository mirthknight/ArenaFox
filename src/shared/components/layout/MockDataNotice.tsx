import { Alert, Group, Text } from '@mantine/core';
import { Info } from 'lucide-react';

export const MockDataNotice = () => (
    <Alert
        color="fox"
        variant="light"
        icon={<Info size={16} />}
        radius="md"
        className="bg-[rgba(0,173,181,0.12)] border border-[var(--af-border)] text-[var(--af-ink)]"
        title="Preview data"
    >
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
            <Text size="sm" c="gray.5">
                This dashboard is currently showing mock data for layout review. Connect Supabase to replace it with live content.
            </Text>
        </Group>
    </Alert>
);
