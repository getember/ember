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
  import contact, { Channel } from '@digitranslab/contact'
  import { Class, Doc, Ref } from '@digitranslab/core'
  import { createQuery, getClient } from '@digitranslab/presentation'
  import { AnyComponent, Component } from '@digitranslab/ui'
  import { channelProviders } from '../utils'
  import { DocUpdateMessage } from '@digitranslab/activity'

  export let _id: Ref<Channel>
  export let _class: Ref<Class<Channel>>
  export let embedded: boolean = false
  export let selectedDoc: Ref<Doc> | undefined = undefined
  export let activityMessage: DocUpdateMessage | undefined = undefined

  const client = getClient()

  let channel: Channel | undefined = undefined

  const query = createQuery()
  $: query.query(_class, { _id }, (res) => {
    ;[channel] = res
  })

  async function getPresenter (channel: Channel | undefined): Promise<AnyComponent | undefined> {
    if (channel === undefined) return
    const provider =
      $channelProviders.find((it) => it._id === channel.provider) ??
      (await client.findOne(contact.class.ChannelProvider, { _id: channel.provider }))
    return provider?.presenter
  }
</script>

{#await getPresenter(channel) then presenter}
  {#if presenter}
    <Component
      is={presenter}
      props={{
        embedded,
        _id: channel?.attachedTo,
        _class: channel?.attachedToClass,
        channel,
        messageId: selectedDoc ?? activityMessage?.objectId
      }}
      on:close
    />
  {/if}
{/await}
