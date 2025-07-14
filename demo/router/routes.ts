import type { RouterOptions } from '@dvcol/svelte-simple-router/models';
import type { ComponentOrLazy } from '@dvcol/svelte-utils/component';

import DemoButtons from '../components/DemoButtons.svelte';

export const Route = {
  Buttons: 'buttons' as const,
  ButtonGroups: 'button-groups' as const,
  Pill: 'pill' as const,
  Tabs: 'tabs' as const,
  TabsPanels: 'tabs-panels' as const,
  Dividers: 'dividers' as const,
  Text: 'text' as const,
  Cards: 'cards' as const,
  Skeleton: 'skeleton' as const,
  Media: 'media' as const,
  Inputs: 'inputs' as const,
  Lists: 'lists' as const,
  Progress: 'progress' as const,
  Collapse: 'collapse' as const,
  Stepper: 'stepper' as const,
  Cursor: 'cursor' as const,
  Tooltips: 'tooltips' as const,
  Dialog: 'dialog' as const,
  Menu: 'menu' as const,
  Notification: 'notification' as const,
  Any: 'any' as const,
} as const;

export type Routes = (typeof Route)[keyof typeof Route];

type RouteKeys = keyof typeof Route;
export const Path = {} as Record<RouteKeys, string>;
export const PathMap = {} as Record<Routes, string>;

(Object.entries(Route) as [RouteKeys, Routes][]).forEach(([k, v]) => {
  Path[k] = `/${v}`;
  PathMap[v] = v === Route.Any ? '*' : `/${v}`;
});

export const routes = Object.values(Route).filter(key => key !== Route.Any);

export const options: RouterOptions<Routes> = {
  hash: true,
  listen: 'navigation',
  routes: Object.entries(Route).map(([k, v]) => {
    if (v === Route.Any) return { name: v, path: PathMap[v], redirect: { name: Route.Buttons } };
    if (v === Route.Buttons) return { name: v, path: PathMap[v], component: DemoButtons };
    return { name: v, path: PathMap[v], component: async () => import(`../components/Demo${k}.svelte`) as Promise<ComponentOrLazy> };
  }),
} as const;
