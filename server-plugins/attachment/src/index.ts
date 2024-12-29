//
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
//

import type { Plugin, Resource } from '@digitranslab/platform'
import { plugin } from '@digitranslab/platform'
import type { TriggerFunc } from '@digitranslab/server-core'

/**
 * @public
 */
export const serverAttachmentId = 'server-attachment' as Plugin

/**
 * @public
 */
export default plugin(serverAttachmentId, {
  trigger: {
    OnAttachmentDelete: '' as Resource<TriggerFunc>
  }
})
