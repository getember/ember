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

import { type Builder } from '@digitranslab/model'
import core, { type Domain } from '@digitranslab/core'
import chunter from '@digitranslab/chunter'
import analyticsCollector from '@digitranslab/analytics-collector'

import aiBot from './plugin'

export { aiBotId } from '@digitranslab/ai-bot'
export { aiBotOperation } from './migration'
export default aiBot

export const DOMAIN_AI_BOT = 'ai_bot' as Domain

export function createModel (builder: Builder): void {
  builder.createDoc(chunter.class.ChunterExtension, core.space.Model, {
    point: 'aside',
    ofClass: analyticsCollector.class.OnboardingChannel,
    component: aiBot.component.OnboardingChannelPanelExtension
  })
}
