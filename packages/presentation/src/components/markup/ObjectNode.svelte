<!--
// Copyright © 2024 Digitrans Inc.
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
  import { Class, Doc, Ref } from '@digitranslab/core'
  import { Component } from '@digitranslab/ui'
  import view from '@digitranslab/view'

  import { createQuery } from '../../utils'

  export let _id: Ref<Doc> | undefined = undefined
  export let _class: Ref<Class<Doc>> | undefined = undefined
  export let title: string = ''

  const docQuery = createQuery()

  let doc: Doc | undefined = undefined

  $: if (_class != null && _id != null) {
    docQuery.query(_class, { _id }, (r) => {
      doc = r.shift()
    })
  }
</script>

{#if !doc}
  <span class="antiMention">@{title}</span>
{:else}
  <Component
    is={view.component.ObjectMention}
    showLoading={false}
    props={{
      object: doc,
      title
    }}
  />
{/if}
