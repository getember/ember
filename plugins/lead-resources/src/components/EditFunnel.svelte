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
  import { Attachments } from '@digitranslab/attachment-resources'
  import type { Ref } from '@digitranslab/core'
  import core from '@digitranslab/core'
  import { Panel } from '@digitranslab/panel'
  import { createQuery, getClient } from '@digitranslab/presentation'
  import { MembersBox } from '@digitranslab/contact-resources'
  import type { Funnel } from '@digitranslab/lead'
  import { FullDescriptionBox } from '@digitranslab/text-editor-resources'
  import { EditBox, Grid } from '@digitranslab/ui'
  import { ClassAttributeBar } from '@digitranslab/view-resources'
  import { createEventDispatcher } from 'svelte'
  import lead from '../plugin'

  export let _id: Ref<Funnel>

  let object: Required<Funnel>
  let rawName: string = ''
  let rawDesc: string = ''

  const dispatch = createEventDispatcher()

  const client = getClient()

  const query = createQuery()

  function updateObject (_id: Ref<Funnel>): void {
    query.query(lead.class.Funnel, { _id }, (result) => {
      object = result[0] as Required<Funnel>
      rawName = object.name
      rawDesc = object.description
    })
  }

  $: updateObject(_id)

  function onChange (key: string, value: any): void {
    client.updateDoc(object._class, object.space, object._id, { [key]: value })
  }
</script>

{#if object}
  <Panel
    title={object.name}
    isHeader={false}
    isAside={true}
    {object}
    on:close={() => {
      dispatch('close')
    }}
  >
    <svelte:fragment slot="attributes" let:direction={dir}>
      {#if dir === 'column'}
        <div class="ac-subtitle">
          <div class="ac-subtitle-content">
            <ClassAttributeBar
              {object}
              _class={object._class}
              ignoreKeys={['name', 'description', 'fullDescription']}
              to={core.class.Space}
            />
          </div>
        </div>
      {/if}
    </svelte:fragment>

    <Grid column={1} rowGap={1.5}>
      <EditBox
        bind:value={object.name}
        placeholder={lead.string.FunnelPlaceholder}
        kind={'large-style'}
        autoFocus
        focusable
        on:blur={() => {
          if (rawName !== object.name) onChange('name', object.name)
        }}
      />
      <EditBox
        bind:value={object.description}
        placeholder={lead.string.Description}
        focusable
        on:blur={() => {
          if (rawDesc !== object.description) onChange('description', object.description)
        }}
      />
      <FullDescriptionBox
        content={object.fullDescription}
        on:save={(res) => {
          onChange('fullDescription', res.detail)
        }}
      />
      <Attachments
        objectId={object._id}
        _class={object._class}
        space={object.space}
        attachments={object.attachments ?? 0}
      />
      <MembersBox label={lead.string.Members} space={object} />
    </Grid>
  </Panel>
{/if}
