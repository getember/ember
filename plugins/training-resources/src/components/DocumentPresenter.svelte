<!--
//
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
//
-->

<script lang="ts">
  import { NavLink } from '@digitranslab/presentation'
  import { locationToUrl } from '@digitranslab/ui'
  import { Document } from '@digitranslab/controlled-documents'
  import { documentRoute } from '../routing/routes/documentRoute'

  export let value: Document

  let href: string | undefined
  $: {
    href = `${window.location.origin}${locationToUrl(documentRoute.build({ id: value._id }))}`
  }
</script>

<NavLink {href}>
  {value.code}
</NavLink>
