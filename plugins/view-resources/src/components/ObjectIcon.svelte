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
  import view from '@digitranslab/view'
  import { Component, Icon, IconSize } from '@digitranslab/ui'
  import type { Doc } from '@digitranslab/core'
  import { getClient } from '@digitranslab/presentation'

  import { classIcon } from '../utils'

  export let value: Doc
  export let size: IconSize = 'small'

  const client = getClient()
  const hierarchy = client.getHierarchy()

  $: iconMixin = hierarchy.classHierarchyMixin(value._class, view.mixin.ObjectIcon)
</script>

{#if iconMixin}
  <Component is={iconMixin.component} props={{ value, size }} />
{:else}
  {@const icon = classIcon(client, value._class)}
  {#if icon}
    <Icon {icon} {size} />
  {/if}
{/if}
