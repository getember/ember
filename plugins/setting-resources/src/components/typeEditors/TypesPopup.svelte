<!--
// Copyright © 2022 Digitrans Inc.
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
  import core from '@digitranslab/core'
  import { getClient } from '@digitranslab/presentation'
  import { Label, resizeObserver, Scroller } from '@digitranslab/ui'
  import { DropdownIntlItem } from '@digitranslab/ui/src/types'
  import { createEventDispatcher } from 'svelte'
  import view from '@digitranslab/view'

  const dispatch = createEventDispatcher()

  const client = getClient()
  const hierarchy = client.getHierarchy()

  function getTypes (): DropdownIntlItem[] {
    const descendants = hierarchy.getDescendants(core.class.Type)
    const res: DropdownIntlItem[] = []
    for (const descendant of descendants) {
      const _class = hierarchy.getClass(descendant)
      if (_class.label !== undefined && hierarchy.hasMixin(_class, view.mixin.ObjectEditor)) {
        res.push({
          label: _class.label,
          id: _class._id
        })
      }
    }
    return res
  }

  const items = getTypes()

  const handleSelection = (id: string | number) => {
    dispatch('close', id)
  }
</script>

<div class="emberPopup-container" use:resizeObserver={() => dispatch('changeContent')}>
  <Scroller padding={'var(--spacing-0_5)'} gap={'flex-gap-0-5'}>
    {#each items as item}
      <button
        class="emberPopup-row"
        on:click={() => {
          handleSelection(item.id)
        }}
      >
        <span class="emberPopup-row__label overflow-label">
          <Label label={item.label} />
        </span>
      </button>
    {/each}
  </Scroller>
</div>
