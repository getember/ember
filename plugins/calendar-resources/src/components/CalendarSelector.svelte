<script lang="ts">
  import { Calendar, ExternalCalendar } from '@digitranslab/calendar'
  import { Ref, getCurrentAccount } from '@digitranslab/core'
  import { createQuery } from '@digitranslab/presentation'
  import calendarPlugin from '../plugin'
  import { createEventDispatcher } from 'svelte'
  import { Dropdown, Icon } from '@digitranslab/ui'
  import calendar from '../plugin'

  export let value: Ref<Calendar> | undefined
  export let disabled: boolean = false
  export let focusIndex = -1

  const dispatch = createEventDispatcher()

  let calendars: ExternalCalendar[] = []
  const me = getCurrentAccount()
  const q = createQuery()
  q.query(calendarPlugin.class.ExternalCalendar, { createdBy: me._id, hidden: false }, (res) => {
    calendars = res
  })

  $: items = calendars.map((p) => {
    return {
      _id: p._id,
      label: p.name
    }
  })

  $: selected = value !== undefined ? items.find((p) => p._id === value) : undefined

  function change (id: Ref<ExternalCalendar>) {
    if (value !== id) {
      dispatch('change', { _id: id })
      value = id
    }
  }
</script>

{#if calendars.length > 0}
  <div class="flex-row-center flex-gap-1">
    <Icon icon={calendar.icon.Calendar} size={'small'} />
    <Dropdown
      kind={'ghost'}
      size={'medium'}
      placeholder={calendar.string.Calendar}
      {items}
      withSearch={false}
      {selected}
      {disabled}
      {focusIndex}
      on:selected={(e) => {
        change(e.detail._id)
      }}
    />
  </div>
{/if}
