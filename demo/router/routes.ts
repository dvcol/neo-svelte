import type { RouterOptions } from '@dvcol/svelte-simple-router/models';

export const Route = {
  Any: 'any' as const,
  Buttons: 'buttons' as const,
  ButtonGroups: 'button-groups' as const,
  Tabs: 'tabs' as const,
  TabsPanels: 'tabs-panels' as const,
  Cards: 'cards' as const,
  Skeleton: 'skeleton' as const,
  Inputs: 'inputs' as const,
} as const;

export type Routes = (typeof Route)[keyof typeof Route];

export const Path: Record<keyof typeof Route, string> = {
  Buttons: '/buttons' as const,
  ButtonGroups: '/buttons/groups' as const,
  Tabs: '/tabs' as const,
  TabsPanels: '/tabs/panels' as const,
  Cards: '/cards' as const,
  Skeleton: '/skeleton' as const,
  Inputs: '/inputs' as const,
  Any: '*' as const,
} as const;

export const routes = Object.values(Route).filter(key => key !== Route.Any);

export const options: RouterOptions<Routes> = {
  hash: true,
  listen: 'navigation',
  routes: [
    {
      name: Route.Buttons,
      path: Path.Buttons,
      component: () => import('../components/DemoButtons.svelte'),
    },
    {
      name: Route.ButtonGroups,
      path: Path.ButtonGroups,
      component: () => import('../components/DemoButtonGroups.svelte'),
    },
    {
      name: Route.Tabs,
      path: Path.Tabs,
      component: () => import('../components/DemoTabs.svelte'),
    },
    {
      name: Route.TabsPanels,
      path: Path.TabsPanels,
      component: () => import('../components/DemoTabsPanels.svelte'),
    },
    {
      name: Route.Cards,
      path: Path.Cards,
      component: () => import('../components/DemoCards.svelte'),
    },
    {
      name: Route.Skeleton,
      path: Path.Skeleton,
      component: () => import('../components/DemoSkeleton.svelte'),
    },
    {
      name: Route.Inputs,
      path: Path.Inputs,
      component: () => import('../components/DemoInputs.svelte'),
    },
    {
      name: Route.Any,
      path: Path.Any,
      redirect: {
        name: Route.Buttons,
      },
    },
  ] as const,
};
