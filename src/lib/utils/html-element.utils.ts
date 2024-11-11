import type { HTMLAttributes } from 'svelte/elements';

export type HTMLNeoBaseElement<T extends HTMLElement = HTMLDivElement> = Partial<HTMLAttributes<T>>;
