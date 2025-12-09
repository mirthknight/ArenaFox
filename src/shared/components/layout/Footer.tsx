import { Group, Text } from '@mantine/core';

export const Footer = () => {
    return (
        <footer className="border-t border-[var(--af-border)] bg-[rgba(34,40,49,0.9)] backdrop-blur px-6 py-3 text-[var(--af-ink)]">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[var(--af-ink-soft)]">
                <Group gap="xs">
                    <div className="w-2 h-2 rounded-full bg-[var(--af-accent)]/80" />
                    <Text size="xs" c="gray.5">
                        Secure access enforced
                    </Text>
                </Group>
                <Text size="xs" c="gray.5" className="tracking-wide">
                    Arena Fox Dashboard
                </Text>
            </div>
        </footer>
    );
};

