<!--
//
// Copyright © 2023, 2024 Digitrans Inc.
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
//
-->
<script lang="ts">
  import { getNodeViewContext } from './context'

  export let as = 'div'

  const { onDragStart } = getNodeViewContext()
</script>

<svelte:element this={as} data-node-view-wrapper="" role="none" on:dragstart={onDragStart} {...$$restProps}>
  <slot />
</svelte:element>
