<!--
// Copyright © 2023 Digitrans Inc.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
-->
<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte'
  import ui from '../../plugin'
  import Icon from '../Icon.svelte'
  import Label from '../Label.svelte'
  import IconClose from '../icons/Close.svelte'
  import { daysInMonth, fromCurrentToTz, getUserTimezone } from './internal/DateUtils'

  export let currentDate: Date | null
  export let withTime: boolean = false
  export let kind: 'default' | 'plain' = 'default'
  export let timeZone: string = getUserTimezone()

  type TEdits = 'day' | 'month' | 'year' | 'hour' | 'min'
  interface IEdits {
    id: TEdits
    value: number
    el?: HTMLElement
  }
  const editsType: TEdits[] = ['day', 'month', 'year', 'hour', 'min']
  const getIndex = (id: TEdits): number => editsType.indexOf(id)
  let edits: IEdits[] = editsType.map((edit) => {
    return { id: edit, value: -1 }
  })
  let selected: TEdits | null = 'day'
  let startTyping: boolean = false

  const dispatch = createEventDispatcher()

  const setValue = (val: number, date: Date | null, id: TEdits): Date => {
    if (date == null) date = new Date()
    const value = timeZone ? fromCurrentToTz(date, timeZone) : date
    switch (id) {
      case 'day':
        date = new Date(value.setDate(val))
        break
      case 'month':
        date = new Date(value.setMonth(val - 1))
        break
      case 'year':
        date = new Date(value.setFullYear(val))
        break
      case 'hour':
        date = new Date(value.setHours(val))
        break
      case 'min':
        date = new Date(value.setMinutes(val))
        break
    }
    return date
  }

  const getMaxValue = (date: Date | null, id: TEdits): number => {
    if (date == null) date = new Date()
    switch (id) {
      case 'day':
        return daysInMonth(date)
      case 'month':
        return 12
      case 'year':
        return 3000
      case 'hour':
        return 23
      case 'min':
        return 59
    }
  }

  const getValue = (date: Date, id: TEdits): number => {
    const val = timeZone ? fromCurrentToTz(date, timeZone) : date
    switch (id) {
      case 'day':
        return val.getDate()
      case 'month':
        return val.getMonth() + 1
      case 'year':
        return val.getFullYear()
      case 'hour':
        return val.getHours()
      case 'min':
        return val.getMinutes()
    }
  }

  const dateToEdits = (currentDate: Date | null): void => {
    if (currentDate == null) {
      edits.forEach((edit) => {
        edit.value = -1
      })
    } else {
      for (const edit of edits) {
        edit.value = getValue(currentDate, edit.id)
      }
    }
    edits = edits
  }

  export const isNull = (currentDate: Date | null | undefined = undefined, full: boolean = false): boolean => {
    if (currentDate !== undefined) {
      dateToEdits(currentDate)
    }
    let result: boolean = false
    edits.forEach((edit, i) => {
      if (edit.value === -1 && full && i > 2) result = true
      if (edit.value === -1 && !full && i < 3) result = true
      if (i === 0 && edit.value === 0) result = true
      if (i === 1 && edit.value === 0) result = true
      if (i === 2 && (edit.value < 1970 || edit.value > 3000)) result = true
    })
    return result
  }

  const keyDown = (ev: KeyboardEvent, ed: TEdits): void => {
    if (selected === ed) {
      const index = getIndex(ed)
      if (ev.key >= '0' && ev.key <= '9') {
        const shouldNext = !startTyping && selected !== 'year'
        const num: number = parseInt(ev.key, 10)
        if (startTyping) {
          if (num === 0) edits[index].value = 0
          else {
            edits[index].value = num
          }
          startTyping = false
        } else if (edits[index].value * 10 + num > getMaxValue(currentDate, ed)) {
          edits[index].value = getMaxValue(currentDate, ed)
        } else {
          edits[index].value = edits[index].value * 10 + num
        }
        if (!isNull() && !startTyping) {
          fixEdits()
          currentDate = setValue(edits[index].value, currentDate, ed)
          dateToEdits(currentDate)
        }
        edits = edits

        if (selected === 'day' && (shouldNext || edits[0].value > getMaxValue(currentDate, 'day') / 10)) {
          selected = 'month'
        } else if (selected === 'month' && (shouldNext || edits[1].value > 1)) selected = 'year'
        else if (selected === 'year' && withTime && (shouldNext || edits[2].value > 999)) selected = 'hour'
        else if (selected === 'hour' && (shouldNext || edits[3].value > 2)) selected = 'min'
      }
      if (ev.code === 'Enter') {
        if (!isNull(currentDate)) dispatch('close')
      }
      if (ev.code === 'Backspace') {
        edits[index].value = -1
        startTyping = true
      }
      if (ev.code === 'ArrowUp' || (ev.code === 'ArrowDown' && edits[index].el)) {
        if (edits[index].value !== -1) {
          const val = ev.code === 'ArrowUp' ? edits[index].value + 1 : edits[index].value - 1
          if (currentDate) {
            currentDate = setValue(val, currentDate, ed)
            dateToEdits(currentDate)
          }
        }
      }
      if (ev.code === 'ArrowLeft' && edits[index].el) {
        selected = index === 0 ? edits[withTime ? 4 : 2].id : edits[index - 1].id
      }
      if (ev.code === 'ArrowRight' && edits[index].el) {
        selected = index === (withTime ? 4 : 2) ? edits[0].id : edits[index + 1].id
      }
      if (ev.code === 'Tab') {
        if ((ed === 'year' && !withTime) || (ed === 'min' && withTime)) dispatch('save')
      }
    }
  }
  const focused = (ed: TEdits): void => {
    selected = ed
    startTyping = true
  }
  const clearEdits = (): void => {
    edits.forEach((edit) => (edit.value = -1))
    if (edits[0].el) edits[0].el.focus()
    dispatch('save')
  }
  const fixEdits = (): void => {
    const h: number = edits[3].value === -1 ? 0 : edits[3].value
    const m: number = edits[4].value === -1 ? 0 : edits[4].value
    currentDate = new Date(edits[2].value, edits[1].value - 1, edits[0].value, h, m)
    dispatch('save')
  }

  $: dateToEdits(currentDate)
  $: if (selected && edits[getIndex(selected)].el) edits[getIndex(selected)].el?.focus()

  afterUpdate(() => {
    if (selected) edits[getIndex(selected)].el?.focus()
  })
</script>

<div class="datetime-input {kind}">
  <div class="flex-row-center">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span
      bind:this={edits[0].el}
      class="digit"
      tabindex="0"
      on:keydown={(ev) => {
        keyDown(ev, edits[0].id)
      }}
      on:focus={() => {
        focused(edits[0].id)
      }}
      on:blur={() => (selected = null)}
    >
      {#if edits[0].value > -1}
        {edits[0].value.toString().padStart(2, '0')}
      {:else}<Label label={ui.string.DD} />{/if}
    </span>
    <span class="separator">.</span>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span
      bind:this={edits[1].el}
      class="digit"
      tabindex="0"
      on:keydown={(ev) => {
        keyDown(ev, edits[1].id)
      }}
      on:focus={() => {
        focused(edits[1].id)
      }}
      on:blur={() => (selected = null)}
    >
      {#if edits[1].value > -1}
        {edits[1].value.toString().padStart(2, '0')}
      {:else}<Label label={ui.string.MM} />{/if}
    </span>
    <span class="separator">.</span>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span
      bind:this={edits[2].el}
      class="digit"
      tabindex="0"
      on:keydown={(ev) => {
        keyDown(ev, edits[2].id)
      }}
      on:focus={() => {
        focused(edits[2].id)
      }}
      on:blur={() => (selected = null)}
    >
      {#if edits[2].value > -1}
        {edits[2].value.toString().padStart(4, '0')}
      {:else}<Label label={ui.string.YYYY} />{/if}
    </span>
    {#if withTime}
      <div class="time-divider" />
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span
        bind:this={edits[3].el}
        class="digit"
        tabindex="0"
        on:keydown={(ev) => {
          keyDown(ev, edits[3].id)
        }}
        on:focus={() => {
          focused(edits[3].id)
        }}
        on:blur={() => (selected = null)}
      >
        {#if edits[3].value > -1}
          {edits[3].value.toString().padStart(2, '0')}
        {:else}<Label label={ui.string.HH} />{/if}
      </span>
      <span class="separator">:</span>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span
        bind:this={edits[4].el}
        class="digit"
        tabindex="0"
        on:keydown={(ev) => {
          keyDown(ev, edits[4].id)
        }}
        on:focus={() => {
          focused(edits[4].id)
        }}
        on:blur={() => (selected = null)}
      >
        {#if edits[4].value > -1}
          {edits[4].value.toString().padStart(2, '0')}
        {:else}<Label label={ui.string.MM} />{/if}
      </span>
    {/if}
  </div>
  {#if currentDate}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="close-btn"
      tabindex={0}
      on:click={() => {
        selected = 'day'
        startTyping = true
        currentDate = null
        clearEdits()
      }}
      on:blur={() => (selected = null)}
    >
      <Icon icon={IconClose} size={'x-small'} />
    </div>
  {/if}
</div>

<style lang="scss">
  .datetime-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    margin: 0;
    height: 3rem;
    font-family: inherit;
    color: var(--theme-content-color);

    &:hover {
      border-color: var(--theme-button-default);
    }
    &:focus-within {
      color: var(--theme-caption-color);
      border-color: var(--primary-edit-border-color);
    }

    .close-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 0.25rem;
      width: 0.75rem;
      height: 0.75rem;
      color: var(--theme-content-color);
      background-color: var(--theme-button-default);
      outline: none;
      border-radius: 50%;
      cursor: pointer;

      &:hover {
        color: var(--theme-caption-color);
        background-color: var(--theme-button-hovered);
      }
    }

    .digit {
      position: relative;
      color: var(--theme-caption-color);
      outline: none;
      border-radius: 0.125rem;

      &:focus {
        color: var(--primary-button-color);
        background-color: var(--primary-button-default);
      }
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 11000;
        cursor: pointer;
      }
    }
    .time-divider {
      flex-shrink: 0;
      width: 1px;
      min-width: 1px;
      background-color: var(--theme-button-border);
    }

    &.plain:not(.default) {
      padding: 0.5rem 0;
      font-size: 1.25rem;

      .digit {
        padding: 0.5rem 0.125rem;
        line-height: 1.25rem;
      }
      .separator {
        margin: 0;
      }
      .time-divider {
        margin: 0 0.375rem;
        height: 1.5rem;
      }
    }
    &.default:not(.plain) {
      padding: 0.75rem;
      font-size: 1rem;
      background-color: var(--theme-bg-color);
      border: 1px solid var(--theme-button-border);
      border-radius: 0.25rem;
      transition: border-color 0.15s ease;

      .digit {
        padding: 0 0.125rem;
        height: 1.5rem;
        line-height: 1.5rem;
      }
      .separator {
        margin: 0 0.1rem;
      }
      .time-divider {
        margin: 0 0.25rem;
        height: 0.75rem;
      }
    }
  }
</style>
