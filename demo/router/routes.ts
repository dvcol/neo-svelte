import type { RouterOptions } from '@dvcol/svelte-simple-router/models';
import type { ComponentOrLazy } from '@dvcol/svelte-utils/component';

import DemoButtons from '../components/buttons/DemoButtons.svelte';
import TestHarness from '../components/TestHarness.svelte';

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
  // Generic dev-time URL `#/test/<name>?prop=value` rendered by TestHarness.
  // It dynamically loads `Test<Name>.browser.test.svelte` (the same harness
  // exercised by the matching browser test) and forwards coerced query params
  // as props. Visual debugging URL stays in sync with the test surface.
  Test: 'test/:name' as const,
  Any: 'any' as const,
} as const;

export type Routes = (typeof Route)[keyof typeof Route];

type RouteKeys = keyof typeof Route;

// Demo pages live in scope subfolders mirroring src/lib (e.g. floating/tooltips/).
// Each route key explicitly points at its `Demo<Name>.svelte` so adding or
// moving a page is a one-line, type-checked edit. `Buttons` is statically
// imported above (eager landing page) and `Test`/`Any` aren't backed by a
// Demo file, so they're excluded.
//
// `async` matters: the router's `isLazyComponent` check accepts AsyncFunctions
// (constructor.name === 'AsyncFunction'). A plain `() => import(...)` would be
// treated as a sync component and the router would silently render nothing.
type LoadableRouteKey = Exclude<RouteKeys, 'Buttons' | 'Test' | 'Any'>;
const RouteLoader: Record<LoadableRouteKey, ComponentOrLazy> = {
  ButtonGroups: async () => import('../components/buttons/DemoButtonGroups.svelte'),
  Pill: async () => import('../components/pill/DemoPill.svelte'),
  Tabs: async () => import('../components/nav/DemoTabs.svelte'),
  TabsPanels: async () => import('../components/nav/DemoTabsPanels.svelte'),
  Dividers: async () => import('../components/divider/DemoDividers.svelte'),
  Text: async () => import('../components/text/DemoText.svelte'),
  Cards: async () => import('../components/cards/DemoCards.svelte'),
  Skeleton: async () => import('../components/skeletons/DemoSkeleton.svelte'),
  Media: async () => import('../components/media/DemoMedia.svelte'),
  Inputs: async () => import('../components/inputs/DemoInputs.svelte'),
  Lists: async () => import('../components/list/DemoLists.svelte'),
  Progress: async () => import('../components/progress/DemoProgress.svelte'),
  Collapse: async () => import('../components/collapse/DemoCollapse.svelte'),
  Stepper: async () => import('../components/stepper/DemoStepper.svelte'),
  Cursor: async () => import('../components/cursor/DemoCursor.svelte'),
  Tooltips: async () => import('../components/floating/tooltips/DemoTooltips.svelte'),
  Dialog: async () => import('../components/floating/dialog/DemoDialog.svelte'),
  Menu: async () => import('../components/floating/menu/DemoMenu.svelte'),
  Notification: async () => import('../components/floating/notification/DemoNotification.svelte'),
};

export const Path = {} as Record<RouteKeys, string>;
export const PathMap = {} as Record<Routes, string>;

(Object.entries(Route) as [RouteKeys, Routes][]).forEach(([k, v]) => {
  Path[k] = `/${v}`;
  PathMap[v] = v === Route.Any ? '*' : `/${v}`;
});

// `Test` is a parameterized adapter, not a top-level demo entry — exclude it
// from the navigation list alongside the wildcard.
export const routes = Object.values(Route).filter(key => key !== Route.Any && key !== Route.Test);

export const options: RouterOptions<Routes> = {
  hash: true,
  listen: 'navigation',
  routes: Object.entries(Route).map(([k, v]) => {
    if (v === Route.Any) return { name: v, path: PathMap[v], redirect: { name: Route.Buttons } };
    if (v === Route.Buttons) return { name: v, path: PathMap[v], component: DemoButtons };
    if (v === Route.Test) return { name: v, path: PathMap[v], component: TestHarness };
    return { name: v, path: PathMap[v], component: RouteLoader[k as LoadableRouteKey] };
  }),
} as const;
