//
// Copyright © 2020, 2021 Anticrm Platform Contributors.
// Copyright © 2021 Digitrans Inc.
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

import { bitrixId } from '@digitranslab/bitrix'
import bitrix from '@digitranslab/bitrix-resources/src/plugin'
import { type IntlString, mergeIds } from '@digitranslab/platform'
import { type Action } from '@digitranslab/view'

import { type Doc, type Ref } from '@digitranslab/core'
import type { AnyComponent } from '@digitranslab/ui/src/types'

export default mergeIds(bitrixId, bitrix, {
  component: {
    BitrixConnect: '' as AnyComponent,
    BitrixConfigure: '' as AnyComponent,
    BitrixImport: '' as AnyComponent
  },
  string: {
    BitrixImport: '' as IntlString,
    ConfigLabel: '' as IntlString,
    ConfigDescription: '' as IntlString
  },
  action: {
    BitrixImport: '' as Ref<Action<Doc, any>>
  }
})
