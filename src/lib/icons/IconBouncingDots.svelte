<script lang="ts">
  const {
    size = '1rem',
    scale = 1.5,
    fill = 'currentColor',
    steps = [1, 0.5, 1],

    ...rest
  } = $props();
</script>

<svg viewBox="0 0 90 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style:scale {...rest}>
  <circle cx="15" cy="15" r="8" {fill}>
    <animate
      attributeName="cy"
      values="15;7;15;15"
      dur="1.6s"
      keyTimes="0;0.3;0.6;1"
      keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
      calcMode="spline"
      repeatCount="indefinite"
      begin="0s"
    />
    <animate attributeName="ry" values="8;8;6;8" dur="1.6s" keyTimes="0;0.3;0.6;1" repeatCount="indefinite" begin="0s" />
    <animate attributeName="rx" values="8;8;9;8" dur="1.6s" keyTimes="0;0.3;0.6;1" repeatCount="indefinite" begin="0s" />
    <animate attributeName="fill-opacity" values={steps?.join(';')} dur="1.6s" repeatCount="indefinite" begin="0s" />
  </circle>

  <circle cx="45" cy="15" r="8" {fill}>
    <animate
      attributeName="cy"
      values="15;7;15;15"
      dur="1.6s"
      keyTimes="0;0.3;0.6;1"
      keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
      calcMode="spline"
      repeatCount="indefinite"
      begin="0.4s"
    />
    <animate attributeName="ry" values="8;8;6;8" dur="1.6s" keyTimes="0;0.3;0.6;1" repeatCount="indefinite" begin="0.4s" />
    <animate attributeName="rx" values="8;8;9;8" dur="1.6s" keyTimes="0;0.3;0.6;1" repeatCount="indefinite" begin="0.4s" />
    <animate attributeName="fill-opacity" values={steps?.join(';')} dur="1.6s" repeatCount="indefinite" begin="0.4s" />
  </circle>

  <circle cx="75" cy="15" r="8" {fill}>
    <animate
      attributeName="cy"
      values="15;7;15;15"
      dur="1.6s"
      keyTimes="0;0.3;0.6;1"
      keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
      calcMode="spline"
      repeatCount="indefinite"
      begin="0.8s"
    />
    <animate attributeName="ry" values="8;8;6;8" dur="1.6s" keyTimes="0;0.3;0.6;1" repeatCount="indefinite" begin="0.8s" />
    <animate attributeName="rx" values="8;8;9;8" dur="1.6s" keyTimes="0;0.3;0.6;1" repeatCount="indefinite" begin="0.8s" />
    <animate attributeName="fill-opacity" values={steps?.join(';')} dur="1.6s" repeatCount="indefinite" begin="0.8s" />
  </circle>
</svg>
