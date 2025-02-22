<!--
  Copyright @ 2024 Digitrans Inc.
-->
<script lang="ts">
  import { type TrainingAttempt, TrainingAttemptState, type TrainingRequest } from '@digitranslab/training'
  import type { IntlString } from '@digitranslab/platform'
  import { createQuery } from '@digitranslab/presentation'
  import { Loading, StateTag, StateType } from '@digitranslab/ui'
  import type { ComponentProps } from 'svelte'
  import training from '../plugin'
  import { queryLatestOwnAttempt } from '../utils'

  export let value: TrainingRequest

  let attempt: TrainingAttempt | null = null
  const query = createQuery()
  $: queryLatestOwnAttempt(query, value, (result) => {
    attempt = result ?? null
  })

  let stateProps: ComponentProps<StateTag<IntlString>> | null = null
  $: {
    if (value.canceledOn !== null) {
      stateProps = {
        label: training.string.IncomingRequestStateCanceled,
        params: {},
        type: StateType.Ghost
      }
    } else {
      switch (attempt?.state) {
        case TrainingAttemptState.Draft:
          stateProps = {
            label: training.string.IncomingRequestStateDraft,
            params: {},
            type: StateType.Regular
          }
          break

        case TrainingAttemptState.Passed:
          stateProps = {
            label: training.string.IncomingRequestStatePassed,
            params: {},
            type: StateType.Positive
          }
          break

        case TrainingAttemptState.Failed:
          stateProps = {
            label: training.string.IncomingRequestStateFailed,
            params: {},
            type: StateType.Negative
          }
          break

        default:
          stateProps = {
            label: training.string.IncomingRequestStatePending,
            params: {},
            type: StateType.Ghost
          }
          break
      }
    }
  }
</script>

{#if stateProps === null}
  <Loading size="small" />
{:else}
  <div class="inline-flex">
    <StateTag {...stateProps} />
  </div>
{/if}
