<script lang="ts">
  import { Space } from '@digitranslab/core'
  import { Card } from '@digitranslab/presentation'
  import ui from '@digitranslab/ui'
  import { createEventDispatcher } from 'svelte'
  import tracker from '../plugin'
  import EditRelatedTargets from './EditRelatedTargets.svelte'

  export let value: Space
  const dispatch = createEventDispatcher()
</script>

<Card
  label={tracker.string.RelatedIssues}
  canSave={true}
  okAction={() => {
    dispatch('close')
  }}
  okLabel={ui.string.Ok}
  on:close
>
  <EditRelatedTargets {value} on:close />
</Card>
