<!--
// Copyright © 2021, 2023 Digitrans Inc.
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
  import type { Asset, IntlString } from '@digitranslab/platform'
  import { getEmbeddedLabel } from '@digitranslab/platform'
  import {
    Icon,
    Label,
    IconDown,
    AnySvelteComponent,
    IconSize,
    getTreeCollapsed,
    setTreeCollapsed,
    tooltip,
    IconFolderExpanded,
    IconFolderCollapsed
  } from '..'

  export let icon: Asset | AnySvelteComponent | undefined = undefined
  export let folderIcon: boolean = false
  export let iconProps: any | undefined = undefined
  export let iconSize: IconSize = 'small'
  export let label: IntlString | undefined = undefined
  export let title: string | undefined = undefined
  export let description: string | undefined = undefined
  export let type: 'type-link' | 'type-tag' | 'type-anchor-link' | 'type-object' = 'type-link'
  export let color: string | null = null
  export let count: number | null = null
  export let selected: boolean = false
  export let indent: boolean = false
  export let bold: boolean = false
  export let disabled: boolean = false
  export let isFold: boolean = false
  export let isOpen: boolean = false
  export let withBackground: boolean = false
  export let showMenu: boolean = false
  export let shouldTooltip: boolean = false
  export let empty: boolean = false
  export let collapsedPrefix: string = ''
  export let visible: boolean = false
  export let forciblyСollapsed: boolean = false
  export let level: number = 0
  export let _id: any = undefined

  export let draggable: boolean = false

  let labelEl: HTMLSpanElement
  let labelWidth: number
  let levelReset: boolean = false
  let hovered: boolean = false

  $: if (!showMenu && levelReset && !hovered) levelReset = false
  $: isOpen = !getTreeCollapsed(_id, collapsedPrefix)
  $: setTreeCollapsed(_id, !isOpen, collapsedPrefix)
  $: visibleIcon = folderIcon ? (isOpen && !empty ? IconFolderExpanded : IconFolderCollapsed) : icon

  const mouseOver = () => {
    if (!hovered) {
      labelWidth = labelEl.getBoundingClientRect().width
      hovered = true
    }
    if (!levelReset && labelWidth < 16 && level > 0) levelReset = true
  }
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button
  class="emberNavItem-container line-height-auto {type} {type === 'type-anchor-link'
    ? 'font-regular-12'
    : 'font-regular-14'}"
  class:selected
  class:bold
  class:indent
  class:disabled
  class:showMenu
  {draggable}
  class:noActions={$$slots.actions === undefined}
  on:dragstart
  on:dragover
  on:dragend
  on:drop
  on:mouseover={mouseOver}
  on:mouseleave={() => {
    if (levelReset && !showMenu) levelReset = false
    hovered = false
  }}
  on:click={() => {
    if (selected && isFold) isOpen = !isOpen
  }}
  on:click
  on:contextmenu
>
  {#if isFold}
    <button
      class="emberNavItem-chevron"
      class:isOpen
      style:margin-left={`${(levelReset ? 0 : level) * 1.25}rem`}
      disabled={empty}
      on:click|stopPropagation={() => {
        if (!empty) isOpen = !isOpen
      }}
    >
      {#if !empty}<IconDown size={'x-small'} />{/if}
    </button>
  {/if}
  {#if visibleIcon || (type === 'type-tag' && color)}
    <div class="emberNavItem-icon" class:withBackground class:w-auto={iconSize === 'x-small'}>
      {#if type !== 'type-tag' && visibleIcon}
        <Icon icon={visibleIcon} size={iconSize} {iconProps} />
      {:else if type === 'type-tag'}
        <div style:background-color={color} class="emberNavItem-icon__tag" />
      {/if}
    </div>
  {/if}
  <span
    bind:this={labelEl}
    use:tooltip={shouldTooltip ? { label: label ?? getEmbeddedLabel(title ?? ''), direction: 'top' } : undefined}
    class="{description ? 'emberNavItem-wideLabel' : 'emberNavItem-label'} overflow-label"
    class:flex-grow={!(type === 'type-anchor-link')}
    style:color={type === 'type-tag' && selected ? color : null}
  >
    {#if description}
      <span class="emberNavItem-label font-medium-12 line-height-auto mr-0-5">
        {#if label}<Label {label} />{/if}
        {#if title}{title}{/if}
        <slot />
      </span>
      {description}
    {:else}
      {#if label}<Label {label} />{/if}
      {#if title}{title}{/if}
      <slot />
    {/if}
  </span>
  {#if $$slots.extra}<slot name="extra" />{/if}
  {#if showMenu || $$slots.actions}
    <div class="emberNavItem-actions">
      <slot name="actions" />
    </div>
  {/if}
  {#if count !== null}
    <span class="emberNavItem-count font-bold-12">
      {count}
    </span>
  {/if}
  <slot name="notify" />
</button>
{#if (isFold && (isOpen || (!isOpen && visible)) && !empty) || forciblyСollapsed}
  <div class="emberNavItem-dropbox">
    {#if (!isOpen && visible) || forciblyСollapsed}
      <slot name="visible" {isOpen} />
    {:else}
      <slot name="dropbox" />
    {/if}
  </div>
{/if}

<style lang="scss">
  .emberNavItem-container {
    overflow: hidden;
    display: flex;
    justify-content: stretch;
    align-items: center;
    padding: 0;
    min-width: 0;
    min-height: var(--global-small-Size);
    border: none;
    border-radius: var(--small-BorderRadius);
    outline: none;

    .emberNavItem-chevron,
    .emberNavItem-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }
    .emberNavItem-chevron {
      margin: 0;
      margin-right: var(--spacing-0_75);
      padding: 0;
      width: 0.75rem;
      height: 0.75rem;
      color: var(--global-tertiary-TextColor);
      border: none;
      border-radius: var(--min-BorderRadius);
      outline: none;

      &:disabled {
        pointer-events: none;
      }
    }
    .emberNavItem-icon {
      margin-right: var(--spacing-1);
      width: var(--global-min-Size);
      height: var(--global-min-Size);
      color: var(--global-primary-TextColor);

      &__tag {
        flex-shrink: 0;
        width: 0.625rem;
        height: 0.625rem;
        border-radius: var(--min-BorderRadius);
      }
      &.withBackground {
        width: var(--global-extra-small-Size);
        height: var(--global-extra-small-Size);
        background: var(--global-ui-BackgroundColor);
        border: 1px solid var(--global-subtle-ui-BorderColor);
        border-radius: var(--extra-small-BorderRadius);
      }
    }
    .emberNavItem-label,
    .emberNavItem-wideLabel {
      text-align: left;
      color: var(--global-primary-TextColor);
    }
    .emberNavItem-wideLabel {
      font-size: 0.875rem;
    }
    .emberNavItem-actions {
      display: none;
      align-items: center;
      flex-shrink: 0;
      min-width: 0;
      min-height: 0;
      gap: var(--spacing-0_25);
    }
    .emberNavItem-count {
      margin: 0 var(--spacing-1);
      color: var(--global-tertiary-TextColor);
    }
    &:not(.selected):hover,
    &:not(.selected).showMenu {
      background-color: var(--global-ui-hover-highlight-BackgroundColor);
    }
    &.selected {
      cursor: default;
      background-color: var(--global-ui-highlight-BackgroundColor);

      .emberNavItem-count {
        color: var(--global-secondary-TextColor);
      }
    }

    &.type-link {
      padding: 0 var(--spacing-0_5) 0 var(--spacing-1_25);

      &.selected {
        &.indent {
          padding-left: var(--spacing-4);
        }
        .emberNavItem-icon {
          color: var(--global-accent-TextColor);
        }
        .emberNavItem-label:not(.description) {
          color: var(--global-accent-TextColor);
        }
      }
    }
    &.type-tag {
      padding: 0 var(--spacing-1_25);

      .emberNavItem-icon {
        width: 0.75rem;
        margin-right: 0.625rem;
      }
    }
    &.type-object {
      padding: 0 var(--spacing-0_5);

      .emberNavItem-icon {
        margin-right: var(--spacing-0_75);
        width: var(--global-extra-small-Size);
        height: var(--global-extra-small-Size);
        background-color: var(--global-ui-BackgroundColor);
        border-radius: var(--extra-small-BorderRadius);
      }
      &.selected {
        .emberNavItem-label:not(.description) {
          color: var(--global-accent-TextColor);
        }
        .emberNavItem-icon {
          color: var(--global-accent-TextColor);
        }
      }
    }
    &.type-anchor-link {
      padding: 0 var(--spacing-1_5) 0 var(--spacing-1_25);
      width: fit-content;
      min-height: 1.75rem;

      .emberNavItem-icon,
      .emberNavItem-label {
        color: var(--global-secondary-TextColor);
      }
      .emberNavItem-label {
        font-weight: 500;
      }
      &.selected .emberNavItem-icon,
      &.selected .emberNavItem-label {
        color: var(--global-primary-TextColor);
      }
    }
    &.indent {
      padding-left: var(--spacing-4);
    }
    &:hover .emberNavItem-chevron:enabled {
      color: var(--global-secondary-TextColor);
      background-color: var(--button-tertiary-hover-BackgroundColor);
    }

    &:not(.noActions):hover .emberNavItem-actions,
    &:not(.noActions).showMenu .emberNavItem-actions {
      display: flex;
    }
    &.disabled {
      cursor: not-allowed;

      .emberNavItem-icon {
        opacity: 0.5;
      }
      .emberNavItem-label {
        color: rgb(var(--theme-caption-color) / 40%);
      }
    }
  }
  .emberNavItem-dropbox {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }
</style>
