import type { RouterOptions } from '@dvcol/svelte-simple-router/models';

export const Route = {
  Any: 'any' as const,
  Buttons: 'buttons' as const,
  ButtonGroups: 'button-groups' as const,
  Tabs: 'tabs' as const,
} as const;

export type Routes = (typeof Route)[keyof typeof Route];

export const routes = Object.values(Route).filter(key => key !== Route.Any);

export const options: RouterOptions<Routes> = {
  hash: true,
  routes: [
    {
      name: Route.Buttons,
      path: '/buttons',
      component: () => import('../components/DemoButtons.svelte'),
    },
    {
      name: Route.ButtonGroups,
      path: '/buttons/groups',
      component: () => import('../components/DemoButtonGroups.svelte'),
    },
    {
      name: Route.Tabs,
      path: '/tabs',
      component: () => import('../components/DemoTabs.svelte'),
    },
    {
      name: Route.Any,
      path: '*',
      redirect: {
        name: Route.Buttons,
      },
    },
  ] as const,
};
