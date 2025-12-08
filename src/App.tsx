import React, { useMemo, useState } from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CalendarClock,
  FolderKanban,
  LogIn,
  LucideIcon,
  ShieldCheck,
  Sparkles,
  Users2,
  Wand2,
  LayoutDashboard,
  ShieldEllipsis,
  Cpu,
  HeartHandshake
} from 'lucide-react';
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

const featureCards: Array<{ title: string; description: string; icon: LucideIcon; accent: string }> = [
  {
    title: 'Workspace-aware login',
    description: 'Jump back into your Kingshot server context with remembered alliances and quick-switch navigation.',
    icon: LayoutDashboard,
    accent: 'from-sky-400/50 to-indigo-500/40'
  },
  {
    title: 'Alliance onboarding',
    description: 'Spin up alliances with auto-generated member, calendar, and bear battle pages the moment you sign in.',
    icon: FolderKanban,
    accent: 'from-emerald-400/45 to-cyan-500/30'
  },
  {
    title: 'Event intelligence',
    description: 'Stay ahead with synced Kingshot events, manual rally reminders, and animated status signals.',
    icon: CalendarClock,
    accent: 'from-amber-400/45 to-pink-500/30'
  },
  {
    title: 'Bear battle tracker',
    description: 'Upload images, capture HP and damage data, and animate trap status in one streamlined console.',
    icon: ShieldEllipsis,
    accent: 'from-fuchsia-400/40 to-purple-500/30'
  }
];

const quickStats = [
  { label: 'Servers live', value: '23', progress: 62, tone: 'teal' },
  { label: 'Alliances tracked', value: '108', progress: 78, tone: 'violet' },
  { label: 'Bear battles', value: '742', progress: 84, tone: 'cyan' }
];

const allianceQuickLinks = [
  { title: 'Alliance members', description: 'Manage ranks, roles, join dates, and performance.', icon: Users2 },
  { title: 'Custom data pages', description: 'Create scouting, rally, and contribution pages instantly.', icon: BarChart3 }
];

function AccentBadge({ label }: { label: string }) {
  return (
    <Badge
      variant="light"
      color="teal"
      radius="lg"
      className="bg-white/5 text-teal-100 border border-white/10"
    >
      {label}
    </Badge>
  );
}

function FeatureCard({ title, description, icon: Icon, accent }: (typeof featureCards)[number]) {
  return (
    <Card radius="lg" padding="lg" className="relative overflow-hidden border border-white/10 bg-white/5">
      <div className={`absolute inset-0 opacity-60 bg-gradient-to-br ${accent}`} />
      <div className="relative flex gap-3">
        <ThemeIconFrame icon={<Icon size={20} />} />
        <div>
          <Text fw={600} c="white">
            {title}
          </Text>
          <Text size="sm" c="gray.2">
            {description}
          </Text>
        </div>
      </div>
    </Card>
  );
}

function ThemeIconFrame({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-teal-200 ring-1 ring-white/10">
      <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}>
        {icon}
      </motion.div>
    </div>
  );
}

function App() {
  const [rememberWorkspace, setRememberWorkspace] = useState(true);
  const [workspace, setWorkspace] = useState('Server 1161');

  const heroBadges = useMemo(
    () => [
      'Kingshot ready',
      'Dark & Light',
      'Modular UI',
      'Gemini-ready logs'
    ],
    []
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    notifications.show({
      title: 'Arena Fox',
      message: `Booting ${workspace} with alliance shortcuts...`,
      color: 'teal',
      icon: <LogIn size={16} />
    });
  };

  return (
    <Box className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(101,243,197,0.16),transparent_18%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.1),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.1),transparent_30%)]" />
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.07)_70%,rgba(255,255,255,0)_100%)]" />
      </div>

      <Container size="lg" py="xl" className="relative z-10">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Stack gap="lg">
            <Paper radius="xl" p="lg" className="glass-panel">
              <Group gap="sm" align="center">
                <ThemeIconFrame icon={<Sparkles size={18} />} />
                <Stack gap={2}>
                  <Text size="xs" fw={700} tt="uppercase" className="tracking-[0.3em] text-slate-200/80">
                    Arena Fox
                  </Text>
                  <Text size="sm" c="gray.3">
                    Dashboard UI & Feature Spec
                  </Text>
                </Stack>
              </Group>

              <Stack gap="sm" mt="md">
                <Group gap="xs" wrap="wrap">
                  {heroBadges.map((badge) => (
                    <AccentBadge key={badge} label={badge} />
                  ))}
                </Group>
                <Title order={1} className="gradient-text leading-tight" fz={{ base: 30, sm: 38, md: 46 }}>
                  Modern, interactive login for Kingshot workspaces.
                </Title>
                <Text size="lg" c="gray.1" maw={640}>
                  Authenticate into Arena Fox with workspace awareness, alliance shortcuts, and animated status cues. Every sign-in
                  primes your dashboard for members, calendars, bear battles, and custom data pages.
                </Text>
                <Group gap="sm" mt="xs">
                  <Button leftSection={<LogIn size={16} />} radius="md" size="md" color="teal" variant="gradient" gradient={{ from: 'teal', to: 'cyan' }}>
                    Enter dashboard
                  </Button>
                  <Button leftSection={<ShieldCheck size={16} />} radius="md" size="md" variant="outline" color="gray.4">
                    Security review
                  </Button>
                </Group>
              </Stack>

              <SimpleGrid cols={{ base: 1, sm: 3 }} mt="lg" spacing="sm">
                {quickStats.map((stat) => (
                  <Card key={stat.label} radius="lg" padding="md" className="bg-white/5 border border-white/10">
                    <Text size="sm" c="gray.3">
                      {stat.label}
                    </Text>
                    <Text size="xl" fw={700} c="white">
                      {stat.value}
                    </Text>
                    <Progress value={stat.progress} color={stat.tone} radius="xl" size="sm" mt="sm" />
                  </Card>
                ))}
              </SimpleGrid>
            </Paper>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {featureCards.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </SimpleGrid>

            <Card radius="lg" padding="md" className="border border-dashed border-slate-600/70 bg-white/5">
              <Group justify="space-between" align="center">
                <Group gap="sm">
                  <ThemeIconFrame icon={<Wand2 size={18} />} />
                  <Stack gap={2}>
                    <Text fw={600} c="white">
                      Vector & icon placeholder
                    </Text>
                    <Text size="sm" c="gray.2">
                      Drop alliance crests or a geometric fox illustration here for your hero.
                    </Text>
                  </Stack>
                </Group>
                <Badge variant="light" radius="lg" color="violet">
                  Illustration slot
                </Badge>
              </Group>
            </Card>
          </Stack>

          <Stack gap="md">
            <Paper radius="xl" p="lg" className="glass-panel">
              <Group justify="space-between" align="center">
                <div>
                  <Text size="sm" c="gray.3">
                    Secure access
                  </Text>
                  <Title order={2} c="white">
                    Log in to Arena Fox
                  </Title>
                </div>
                <Badge leftSection={<Sparkles size={14} />} radius="xl" color="teal" variant="light" className="bg-white/5 border border-white/10">
                  Interactive UI
                </Badge>
              </Group>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <TextInput
                  required
                  label="Workspace"
                  placeholder="Server 1161"
                  value={workspace}
                  onChange={(event) => setWorkspace(event.currentTarget.value)}
                  leftSection={<Cpu size={16} />}
                  radius="md"
                  styles={{ label: { color: 'var(--mantine-color-gray-4)' } }}
                />
                <TextInput
                  required
                  type="email"
                  label="Email"
                  placeholder="captain@arenafox.gg"
                  leftSection={<ShieldCheck size={16} />}
                  radius="md"
                  styles={{ label: { color: 'var(--mantine-color-gray-4)' } }}
                />
                <TextInput
                  required
                  type="password"
                  label="Access key"
                  placeholder="••••••••••••"
                  leftSection={<AlertCircle size={16} />}
                  radius="md"
                  styles={{ label: { color: 'var(--mantine-color-gray-4)' } }}
                />

                <Group justify="space-between" align="center" mt="sm">
                  <Group gap="sm" align="center">
                    <HeadlessSwitch
                      checked={rememberWorkspace}
                      onChange={setRememberWorkspace}
                      className={`relative inline-flex h-9 w-16 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${
                        rememberWorkspace ? 'bg-teal-400/80' : 'bg-slate-600/70'
                      }`}
                    >
                      <span
                        className={`${
                          rememberWorkspace ? 'translate-x-8 bg-slate-900' : 'translate-x-2 bg-white'
                        } inline-block h-6 w-6 transform rounded-full shadow duration-200`}
                      />
                    </HeadlessSwitch>
                    <Stack gap={0}>
                      <Text size="sm" c="white">
                        Remember workspace
                      </Text>
                      <Text size="xs" c="gray.3">
                        Keeps alliance context for quick navigation.
                      </Text>
                    </Stack>
                  </Group>
                  <Anchor size="sm" href="#" underline="hover" c="teal.2">
                    Forgot access?
                  </Anchor>
                </Group>

                <Group gap="sm" mt="md" grow>
                  <Button type="submit" leftSection={<LogIn size={16} />} radius="md" size="md" color="teal">
                    Continue to dashboard
                  </Button>
                  <Button type="button" variant="outline" radius="md" size="md" rightSection={<ArrowRight size={16} />}>
                    Guest preview
                  </Button>
                </Group>
              </form>

              <Divider my="md" variant="dashed" color="gray.7" />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {allianceQuickLinks.map((link) => (
                  <Card key={link.title} padding="md" radius="lg" className="bg-white/5 border border-white/10">
                    <Group gap="sm" align="flex-start">
                      <ThemeIconFrame icon={<link.icon size={18} />} />
                      <div>
                        <Text fw={600} c="white">
                          {link.title}
                        </Text>
                        <Text size="sm" c="gray.2">
                          {link.description}
                        </Text>
                      </div>
                    </Group>
                  </Card>
                ))}
              </SimpleGrid>

              <Card radius="lg" padding="md" className="bg-gradient-to-r from-white/5 to-white/10 border border-white/10 mt-3">
                <Group justify="space-between" align="center">
                  <Group gap="sm">
                    <ThemeIconFrame icon={<HeartHandshake size={18} />} />
                    <div>
                      <Text fw={600} c="white">
                        Kingshot API ready
                      </Text>
                      <Text size="sm" c="gray.2">
                        Live sync for calendars, bear battles, and alliances.
                      </Text>
                    </div>
                  </Group>
                  <Tooltip label="Mock API status" color="teal">
                    <ActionIcon variant="filled" color="teal">
                      <Sparkles size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Card>
            </Paper>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default App;
