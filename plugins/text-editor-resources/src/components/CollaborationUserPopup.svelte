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
  import core from '@digitranslab/core'
  import { Component } from '@digitranslab/ui'
  import view from '@digitranslab/view'
  import { CollaborationUser } from '@digitranslab/text-editor'

  export let user: CollaborationUser
</script>

<Component
  is={view.component.ObjectPresenter}
  props={{
    objectId: user.id,
    _class: core.class.Account,
    shouldShowAvatar: true,
    shouldShowName: true
  }}
/>
