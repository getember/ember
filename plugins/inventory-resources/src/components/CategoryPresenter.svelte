<!--
// Copyright © 2020, 2024 digitrans Inc.
// Copyright © 2021, 2022 Digitrans Inc.
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
  import { Category } from '@digitranslab/inventory'
  import { DocNavLink, ObjectMention } from '@digitranslab/view-resources'

  export let value: Category
  export let inline: boolean = false
</script>

{#if value}
  {#if inline}
    <ObjectMention object={value} />
  {:else}
    <DocNavLink object={value}>
      <div class="flex-presenter overflow-label sm-tool-icon">
        {value.name}
      </div>
    </DocNavLink>
  {/if}
{/if}
