import { Group, Text } from '@mantine/core';

export const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-gradient-to-r from-[#0b1220]/80 via-[#0f172a]/70 to-[#0b1220]/80 backdrop-blur-xl px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-zinc-400">
                <Group gap="xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.6)]" />
                    <Text size="xs" c="gray.4">
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

