import type { MemberProfile } from '@/features/profiles/data/mockProfiles';

export type AdminUser = MemberProfile & { invitationStatus: 'active' | 'pending' };
