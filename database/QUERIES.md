# Supabase Query Snippets

Use these SQL snippets in the Supabase SQL editor (or CLI) after applying `schema.sql`. Adjust role values and IDs to your environment.

## Profile Listing with Badges and Like Counts
```sql
select
  ua.id,
  ua.email,
  ua.display_name,
  ua.avatar_url,
  ua.bio,
  ua.status_label,
  ua.role,
  ua.is_enabled,
  ua.is_verified,
  coalesce(lk.like_count, 0) as like_count,
  coalesce(pb.badges, '[]'::json) as badges
from public.user_accounts ua
left join (
  select profile_id, count(*) as like_count
  from public.profile_likes
  group by profile_id
) lk on lk.profile_id = ua.id
left join (
  select
    profile_id,
    json_agg(json_build_object(
      'badgeId', badge_id,
      'name', b.name,
      'color', b.color,
      'assignedBy', assigned_by,
      'assignedAt', assigned_at
    )) as badges
  from public.profile_badges pb
  join public.badges b on b.id = pb.badge_id
  group by profile_id
) pb on pb.profile_id = ua.id
where ua.is_enabled = true;
```

## Like / Unlike a Profile
```sql
-- Add a like
insert into public.profile_likes (profile_id, liked_by)
values ('<profile-uuid>', auth.uid());

-- Remove a like
delete from public.profile_likes
where profile_id = '<profile-uuid>' and liked_by = auth.uid();
```

## Assign or Remove a Badge (admin or super admin)
```sql
-- Assign
insert into public.profile_badges (profile_id, badge_id, assigned_by)
values ('<profile-uuid>', '<badge-uuid>', auth.uid())
ON CONFLICT (profile_id, badge_id) DO NOTHING;

-- Remove
delete from public.profile_badges
where profile_id = '<profile-uuid>' and badge_id = '<badge-uuid>';
```

## Manage Invites (email-only onboarding)
```sql
-- Create an invite
delete from public.user_invites -- optional: clean old invite before adding
where invitee_email = '<email>' and status in ('pending', 'sent');

insert into public.user_invites (invitee_email, role, invited_by, invite_code, expires_at)
values ('<email>', 'admin', auth.uid(), gen_random_uuid()::text, now() + interval '7 days');

-- Mark invite accepted
update public.user_invites
set status = 'accepted'
where invite_code = '<invite-code>';
```

## Enable / Disable an Account
```sql
update public.user_accounts
set is_enabled = false
where id = '<user-uuid>';
```

## Keep Profiles in Sync After Sign-Up
```sql
-- Seed profile row if it does not exist
insert into public.user_profiles (id, display_name, avatar_url, bio)
values ('<user-uuid>', '<name>', '', '')
on conflict (id) do update set updated_at = timezone('utc', now());
```
