<script lang="ts">
  import { Card, getClient } from '@digitranslab/presentation'
  import { EditBox } from '@digitranslab/ui'
  import { createEventDispatcher } from 'svelte'
  import love from '../plugin'
  import core, { Ref } from '@digitranslab/core'
  import { Floor } from '@digitranslab/love'

  export let id: Ref<Floor> | undefined = undefined

  const dispatch = createEventDispatcher()

  const client = getClient()

  let name: string = ''
  $: if (id !== undefined) {
    client.findOne(love.class.Floor, { _id: id }).then((res) => {
      name = res?.name ?? ''
    })
  }

  async function createFloor (): Promise<void> {
    await client.createDoc(love.class.Floor, core.space.Workspace, { name })
  }
  async function updateFloor (): Promise<void> {
    if (id === undefined) return
    await client.updateDoc(love.class.Floor, core.space.Workspace, id, { name })
  }
</script>

<Card
  label={love.string.Floor}
  okAction={() => {
    if (id === undefined) createFloor()
    else updateFloor()
  }}
  okLabel={id === undefined ? love.string.AddAFloor : love.string.RenameAFloor}
  canSave={name.trim().length > 0}
  on:close={() => dispatch('close')}
>
  <EditBox placeholder={love.string.Floor} bind:value={name} kind={'large-style'} autoFocus focusIndex={1} />
</Card>
