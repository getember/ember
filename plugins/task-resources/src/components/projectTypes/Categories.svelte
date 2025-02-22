<!--
// Copyright © 2020, 2024 digitrans Inc.
// Copyright © 2021 Digitrans Inc.
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
  import { Ref } from '@digitranslab/core'
  import { createQuery } from '@digitranslab/presentation'
  import setting from '@digitranslab/setting'
  import task, { ProjectTypeDescriptor } from '@digitranslab/task'
  import { Icon, IconChevronDown, Label } from '@digitranslab/ui'

  export let descriptor: ProjectTypeDescriptor | undefined
  export let descriptorId: Ref<ProjectTypeDescriptor> | undefined
  let categories: ProjectTypeDescriptor[] = []
  const query = createQuery()
  $: query.query(task.class.ProjectTypeDescriptor, {}, (result) => {
    categories = result
    if (descriptorId !== undefined) {
      descriptor = categories.find((p) => p._id === descriptorId)
    }
  })

  $: if (descriptor === undefined && categories.length > 0) {
    descriptor = categories.filter((f) => f.icon)[0]
  }

  function select (item: ProjectTypeDescriptor): void {
    descriptor = item
  }
</script>

<div class="flex-between trans-title header mb-3">
  <Label label={setting.string.Categories} />
</div>
<div class="flex-col overflow-y-auto">
  {#each categories as f (f._id)}
    {#if f.icon}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="flex-between item"
        class:selected={f._id === descriptor?._id}
        on:click={() => {
          select(f)
        }}
      >
        <div class="icon flex-no-shrink mr-4">
          <Icon icon={f.icon} size={'small'} />
        </div>
        <div class="flex-grow flex-col">
          <div class="fs-title overflow-label">
            <Label label={f.name} />
          </div>
          <div class="text-sm content-dark-color overflow-label">
            <Label label={f.description} />
          </div>
        </div>
        {#if f._id === descriptor?._id}
          <div class="caption-color ml-4">
            <slot name="tools">
              <Icon icon={IconChevronDown} size={'small'} />
            </slot>
          </div>
        {/if}
      </div>
      <slot name="content" categoryId={f._id} />
    {/if}
  {/each}
</div>

<style lang="scss">
  .header {
    min-height: 1.75rem;
  }
  .item {
    padding: 0.25rem 0.25rem 0.25rem 0.25rem;
    // background-color: var(--theme-button-default);
    border: 1px solid var(--theme-button-border);
    border-radius: 0.75rem;
    cursor: pointer;

    &:hover {
      background-color: var(--theme-button-hovered);
    }
    &.selected {
      background-color: var(--theme-button-pressed);
      cursor: auto;
    }
  }
  .item + .item {
    margin-top: 0.75rem;
  }

  .icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    overflow: hidden;
  }
</style>
