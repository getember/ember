<!--
  Copyright @ 2024 Digitrans Inc.
-->

<script lang="ts">
  import type { TrainingAttempt } from '@digitranslab/training'
  import { createQuery } from '@digitranslab/presentation'
  import { Label, Loading } from '@digitranslab/ui'
  import training from '../plugin'
  import TrainingRequestMaxAttemptsPresenter from './TrainingRequestMaxAttemptsPresenter.svelte'

  export let value: TrainingAttempt
  export let showLabel: boolean = false

  let maxAttempts: number | null | undefined = undefined
  const query = createQuery()
  $: query.query(
    value._class,
    { _id: value._id },
    (result) => {
      maxAttempts = result[0]?.$lookup?.attachedTo?.maxAttempts ?? null
    },
    {
      lookup: {
        attachedTo: training.class.TrainingRequest
      }
    }
  )
</script>

{#if maxAttempts === undefined}
  <Loading size="small" />
{:else}
  <span class="no-word-wrap">
    {#if showLabel}
      <Label label={training.string.TrainingAttempt} />
    {/if}
    {value.seqNumber}/<TrainingRequestMaxAttemptsPresenter value={maxAttempts} />
  </span>
{/if}
