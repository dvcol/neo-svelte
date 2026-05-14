<script lang="ts">
  import NeoForm from '~/form/NeoForm.svelte';

  interface HarnessProps {
    childrenText?: string;
    legend?: string;
    [key: string]: unknown;
  }

  const { childrenText, legend, ...rest }: HarnessProps = $props();
</script>

<NeoForm {...rest} {legend}>
  <span data-testid="form-content">{childrenText}</span>
</NeoForm>
