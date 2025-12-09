import { Group, Text, TextInput, Title } from '@mantine/core';
import { Search } from 'lucide-react';

interface AdminPageHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export const AdminPageHeader = ({ search, onSearchChange }: AdminPageHeaderProps) => (
    <Group justify="space-between" align="flex-start" className="flex-col gap-3 sm:flex-row">
        <div className="space-y-1">
            <Title order={2} className="text-2xl md:text-3xl font-black tracking-tight text-[var(--af-ink)]">
                User management
            </Title>
            <Text c="gray.5" size="sm">
                Keep profiles tidy with the table below and edit everything through the modal.
            </Text>
        </div>
        <TextInput
            placeholder="Search people..."
            leftSection={<Search size={16} />}
            className="w-full max-w-xs"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
        />
    </Group>
);
