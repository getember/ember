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

import { Class, Ref } from '@digitranslab/core'
import type { Asset, IntlString, Plugin, Resource } from '@digitranslab/platform'
import { plugin } from '@digitranslab/platform'
import { SupportClientFactory, SupportConversation, SupportSystem } from './types'

export * from './types'
export { deleteSupportConversation, updateSupportConversation } from './utils'

export const supportLink = 'https://ember.link/slack'
export const reportBugLink = 'https://github.com/digitranslab/platform/issues/new'
export const docsLink = 'http://docs.ember.io/'
export const privacyPolicyLink = 'https://v1.ember.io/legal/privacy/'

/**
 * @public
 */
export const supportId = 'support' as Plugin

export default plugin(supportId, {
  class: {
    SupportConversation: '' as Ref<Class<SupportConversation>>,
    SupportSystem: '' as Ref<Class<SupportSystem>>
  },
  function: {
    GetSupport: '' as Resource<SupportClientFactory>
  },
  icon: {
    Support: '' as Asset
  },
  string: {
    ContactUs: '' as IntlString,
    ReportBug: '' as IntlString,
    PrivacyPolicy: '' as IntlString
  }
})
