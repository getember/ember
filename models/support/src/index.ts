//
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
//

import core, { DOMAIN_MODEL, type Domain, IndexKind } from '@digitranslab/core'
import { type Builder, Index, Model } from '@digitranslab/model'
import preference, { TPreference } from '@digitranslab/model-preference'
import support, {
  type SupportConversation,
  type SupportSystem,
  type SupportWidgetFactory
} from '@digitranslab/support'

import { TDoc } from '@digitranslab/model-core'
import { type Resource } from '@digitranslab/platform'

export { supportId } from '@digitranslab/support'
export { support as default }

export const DOMAIN_SUPPORT = 'support' as Domain

@Model(support.class.SupportConversation, preference.class.Preference)
export class TSupportConversation extends TPreference implements SupportConversation {
  @Index(IndexKind.Indexed)
    conversationId!: string

  hasUnreadMessages!: boolean
}

@Model(support.class.SupportSystem, core.class.Doc, DOMAIN_MODEL)
export class TSupportSystem extends TDoc implements SupportSystem {
  name!: string
  factory!: Resource<SupportWidgetFactory>
}

export function createModel (builder: Builder): void {
  builder.createModel(TSupportConversation, TSupportSystem)
}
