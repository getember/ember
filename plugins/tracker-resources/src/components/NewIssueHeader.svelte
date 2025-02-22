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
  import { AccountRole, Ref, Space, getCurrentAccount, hasAccountRole } from '@digitranslab/core'
  import { MultipleDraftController, getClient } from '@digitranslab/presentation'
  import { ButtonWithDropdown, IconAdd, IconDropdown, SelectPopupValueType, showPopup } from '@digitranslab/ui'
  import view from '@digitranslab/view'
  import { Project, TrackerEvents } from '@digitranslab/tracker'
  import { Analytics } from '@digitranslab/analytics'

  import { onDestroy } from 'svelte'
  import tracker from '../plugin'
  import CreateIssue from './CreateIssue.svelte'
  import { importTasks } from '..'

  export let currentSpace: Ref<Space> | undefined

  let closed = true

  let draftExists = false

  const draftController = new MultipleDraftController(tracker.ids.IssueDraft)
  onDestroy(
    draftController.hasNext((res) => {
      draftExists = res
    })
  )
  async function newIssue (): Promise<void> {
    closed = false
    Analytics.handleEvent(TrackerEvents.NewIssueButtonClicked)
    showPopup(CreateIssue, { space: currentSpace, shouldSaveDraft: true }, 'top', () => {
      closed = true
    })
  }

  $: label = draftExists || !closed ? tracker.string.ResumeDraft : tracker.string.NewIssue
  $: dropdownItems = hasAccountRole(getCurrentAccount(), AccountRole.User)
    ? [
        {
          id: tracker.string.CreateProject,
          label: tracker.string.CreateProject
        },
        {
          id: tracker.string.NewIssue,
          label
        },
        {
          id: tracker.string.Import,
          label: tracker.string.Import
        }
      ]
    : [
        {
          id: tracker.string.NewIssue,
          label
        }
      ]
  const client = getClient()

  let keys: string[] | undefined = undefined
  let inputFile: HTMLInputElement
  async function dropdownItemSelected (res?: SelectPopupValueType['id']): Promise<void> {
    if (res == null) return

    if (res === tracker.string.CreateProject) {
      closed = false
      showPopup(tracker.component.CreateProject, {}, 'top', () => {
        closed = true
      })
    } else if (res === tracker.string.Import) {
      inputFile.click()
    } else {
      await newIssue()
    }
  }

  async function fileSelected (): Promise<void> {
    const list = inputFile.files
    if (list === null || list.length === 0) return
    for (let index = 0; index < list.length; index++) {
      const file = list.item(index)
      if (file !== null && currentSpace != null) {
        await importTasks(file, currentSpace as Ref<Project>)
      }
    }
    inputFile.value = ''
  }
  client.findOne(view.class.Action, { _id: tracker.action.NewIssue }).then((p) => (keys = p?.keyBinding))
</script>

<div class="antiNav-subheader">
  <input
    bind:this={inputFile}
    disabled={inputFile == null}
    multiple
    type="file"
    name="file"
    id="tasksInput"
    accept="application/json"
    style="display: none"
    on:change={fileSelected}
  />
  <ButtonWithDropdown
    icon={IconAdd}
    justify={'left'}
    kind={'primary'}
    {label}
    on:click={newIssue}
    {dropdownItems}
    dropdownIcon={IconDropdown}
    on:dropdown-selected={(ev) => {
      dropdownItemSelected(ev.detail)
    }}
    mainButtonId={'new-issue'}
    showTooltipMain={{
      direction: 'bottom',
      label,
      keys
    }}
  >
    <div slot="content" class="draft-circle-container">
      {#if draftExists}
        <div class="draft-circle" />
      {/if}
    </div>
  </ButtonWithDropdown>
</div>

<style lang="scss">
  .draft-circle-container {
    margin-left: auto;
    padding-right: 12px;
  }

  .draft-circle {
    height: 6px;
    width: 6px;
    background-color: var(--primary-bg-color);
    border-radius: 50%;
  }
</style>
