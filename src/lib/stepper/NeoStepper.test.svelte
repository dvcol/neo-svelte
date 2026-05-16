<script lang="ts">
  import type { NeoStepperStep } from '~/stepper/neo-stepper.model.js';

  import NeoStepper from '~/stepper/NeoStepper.svelte';

  type HarnessStep = NeoStepperStep & { label?: string };
  type StepperInstance = ReturnType<typeof NeoStepper>;

  let {
    steps = [],
    active = $bindable(0),
    vertical,
    progress,
    marks,
    controls,
    cancel,
    loop,
    disabled,
    onStep,
    onBeforeStep,
    ref = $bindable<HTMLElement | undefined>(undefined),
    instance = $bindable<StepperInstance | undefined>(undefined),
    onInstance,
  }: {
    steps?: HarnessStep[];
    active?: number;
    vertical?: boolean;
    progress?: boolean;
    marks?: boolean;
    controls?: boolean;
    cancel?: boolean;
    loop?: boolean;
    disabled?: boolean;
    onStep?: (...args: any[]) => void;
    onBeforeStep?: (...args: any[]) => void;
    ref?: HTMLElement;
    instance?: StepperInstance;
    onInstance?: (instance: StepperInstance | undefined) => void;
  } = $props();

  $effect(() => {
    onInstance?.(instance);
  });

  // Neutralize fly/scale transitions in jsdom — leftover transitions outlive
  // unmount and crash the Svelte 5 runtime with `get_fn(...) is not a function`
  // when the next test renders.
  const noopTransition = () => ({ duration: 0 });
</script>

<NeoStepper
  bind:this={instance}
  bind:ref
  {steps}
  bind:active
  {vertical}
  {progress}
  {marks}
  {controls}
  {cancel}
  {loop}
  {disabled}
  swipe={false}
  transition={noopTransition}
  transitionProps={{ in: noopTransition, out: noopTransition }}
  {onStep}
  {onBeforeStep}
>
  {#snippet children({ step })}
    {@const current = step?.current as HarnessStep | undefined}
    <span class="harness-step" data-step-id={current?.id}>step-{current?.label}</span>
  {/snippet}
</NeoStepper>
