<!--
  Copyright @ 2024 Digitrans Inc.
-->
<script lang="ts" context="module">
  import type { ComponentProps } from 'svelte'
  import { StateTag, StateType } from '@digitranslab/ui'
  import { TrainingAttemptState } from '@digitranslab/training'
  import type { IntlString } from '@digitranslab/platform'

  import training from '../plugin'

  export const propsByStates: Record<TrainingAttemptState, ComponentProps<StateTag<IntlString>>> = {
    [TrainingAttemptState.Draft]: {
      label: training.string.TrainingAttemptStateDraft,
      params: {},
      type: StateType.Regular
    },
    [TrainingAttemptState.Failed]: {
      label: training.string.TrainingAttemptStateFailed,
      params: {},
      type: StateType.Negative
    },
    [TrainingAttemptState.Passed]: {
      label: training.string.TrainingAttemptStatePassed,
      params: {},
      type: StateType.Positive
    }
  }
</script>

<script lang="ts">
  export let value: TrainingAttemptState
</script>

<div class="inline-flex">
  <StateTag {...propsByStates[value]} />
</div>
