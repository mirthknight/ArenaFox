export type MemberRole = 'super_admin' | 'admin' | 'member';

export interface MemberProfile {
    id: string;
    displayName: string;
    email: string;
    role: MemberRole;
    bio: string;
    badges: string[];
    likes: number;
    isLiked?: boolean;
    isVerified: boolean;
    isEnabled: boolean;
    statusLabel?: string | null;
    avatarUrl?: string | null;
    avatarColor?: string;
}

export const defaultProfiles: MemberProfile[] = [
    {
        id: '1',
        displayName: 'MirthKnight',
        email: 'mirthknight@gmail.com',
        role: 'super_admin',
        bio: 'Oversees competitive balance and unlocks verified status.',
        badges: ['Founder', 'Strategist'],
        likes: 42,
        isVerified: true,
        isEnabled: true,
        statusLabel: 'Leading the arena',
        avatarColor: 'fox',
    },
    {
        id: '2',
        displayName: 'ArenaFox',
        email: 'bot@fox.gg',
        role: 'admin',
        bio: 'Keeps the ladders clean and invites rising talent.',
        badges: ['Moderator', 'Curator'],
        likes: 28,
        isVerified: true,
        isEnabled: true,
        statusLabel: 'Inviting contenders',
        avatarColor: 'violet',
    },
    {
        id: '3',
        displayName: 'Guest User',
        email: 'guest@example.com',
        role: 'member',
        bio: 'Practicing fundamentals and hunting for badges.',
        badges: ['Rookie'],
        likes: 9,
        isVerified: false,
        isEnabled: false,
        statusLabel: 'Disabled by admin',
        avatarColor: 'gray',
    },
    {
        id: '4',
        displayName: 'NightFalcon',
        email: 'falcon@arena.gg',
        role: 'member',
        bio: 'Team tactician focused on assists and crowd control.',
        badges: ['Support', 'Tactician'],
        likes: 17,
        isVerified: false,
        isEnabled: true,
        statusLabel: 'Ready to compete',
        avatarColor: 'cyan',
    },
];

