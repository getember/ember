<!--
// Copyright © 2020 Digitrans Inc.
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
  import { DateRangeMode } from '@digitranslab/core'
  import DatePresenter from './DatePresenter.svelte'

  export let value: number | null | undefined
  export let mondayStart: boolean = true
  export let editable: boolean = false
</script>

<DatePresenter bind:value mode={DateRangeMode.DATETIME} {mondayStart} {editable} />
