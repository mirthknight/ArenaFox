import { Group, Text } from '@mantine/core';

export const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white/80 backdrop-blur px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
                <Group gap="xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                    <Text size="xs" c="dimmed">
                        Secure access enforced
                    </Text>
                </Group>
                <Text size="xs" c="dimmed" className="tracking-wide">
                    Arena Fox Dashboard
                </Text>
            </div>
        </footer>
    );
};

