import type { RouterOptions } from '@dvcol/svelte-simple-router/models';

export const Route = {
  Any: 'any' as const,
  Buttons: 'buttons' as const,
  ButtonGroups: 'button-groups' as const,
  Pill: 'pill' as const,
  Tabs: 'tabs' as const,
  TabsPanels: 'tabs-panels' as const,
  Dividers: 'dividers' as const,
  Text: 'text' as const,
  Cards: 'cards' as const,
  Skeleton: 'skeleton' as const,
  Inputs: 'inputs' as const,
  Lists: 'lists' as const,
  Progress: 'progress' as const,
  Collapse: 'collapse' as const,
  Stepper: 'stepper' as const,
  Cursor: 'cursor' as const,
  Tooltips: 'tooltips' as const,
  Dialog: 'dialog' as const,
} as const;

export type Routes = (typeof Route)[keyof typeof Route];

export const Path: Record<keyof typeof Route, string> = {
  Buttons: '/buttons' as const,
  ButtonGroups: '/buttons/groups' as const,
  Pill: '/pill' as const,
  Tabs: '/tabs' as const,
  TabsPanels: '/tabs/panels' as const,
  Dividers: '/dividers' as const,
  Cards: '/cards' as const,
  Text: '/text' as const,
  Skeleton: '/skeleton' as const,
  Inputs: '/inputs' as const,
  Lists: '/lists' as const,
  Progress: '/progress' as const,
  Collapse: '/collapse' as const,
  Stepper: '/stepper' as const,
  Cursor: '/cursor' as const,
  Tooltips: '/tooltips' as const,
  Dialog: '/dialog' as const,
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
      name: Route.Pill,
      path: Path.Pill,
      component: () => import('../components/DemoPill.svelte'),
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
      name: Route.Dividers,
      path: Path.Dividers,
      component: () => import('../components/DemoDividers.svelte'),
    },
    {
      name: Route.Text,
      path: Path.Text,
      component: () => import('../components/DemoText.svelte'),
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
      name: Route.Lists,
      path: Path.Lists,
      component: () => import('../components/DemoLists.svelte'),
    },
    {
      name: Route.Progress,
      path: Path.Progress,
      component: () => import('../components/DemoProgress.svelte'),
    },
    {
      name: Route.Collapse,
      path: Path.Collapse,
      component: () => import('../components/DemoCollapse.svelte'),
    },
    {
      name: Route.Stepper,
      path: Path.Stepper,
      component: () => import('../components/DemoStepper.svelte'),
    },
    {
      name: Route.Cursor,
      path: Path.Cursor,
      component: () => import('../components/DemoCursor.svelte'),
    },
    {
      name: Route.Tooltips,
      path: Path.Tooltips,
      component: () => import('../components/DemoTooltips.svelte'),
    },
    {
      name: Route.Dialog,
      path: Path.Dialog,
      component: () => import('../components/DemoDialog.svelte'),
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
