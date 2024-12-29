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

import { Account, type Mixin, Ref } from '@digitranslab/core'
import type { Metadata, Plugin } from '@digitranslab/platform'
import { plugin } from '@digitranslab/platform'
import { ChatMessage } from '@digitranslab/chunter'

export * from './types'
export * from './rest'

export const aiBotId = 'ai-bot' as Plugin

export const aiBotAccountEmail = 'ember.ai.bot@digitrans.lab'

export interface TransferredMessage extends ChatMessage {
  messageId: Ref<ChatMessage>
  parentMessageId?: Ref<ChatMessage>
}

const aiBot = plugin(aiBotId, {
  metadata: {
    EndpointURL: '' as Metadata<string>
  },
  mixin: {
    TransferredMessage: '' as Ref<Mixin<TransferredMessage>>
  },
  account: {
    AIBot: '' as Ref<Account>
  }
})

export default aiBot
