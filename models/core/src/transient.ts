//
// Copyright © 2022 Digitrans Inc.
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

import { DOMAIN_TRANSIENT, type Account, type Ref, type UserStatus } from '@digitranslab/core'
import { Model } from '@digitranslab/model'
import core from './component'
import { TDoc } from './core'

@Model(core.class.UserStatus, core.class.Doc, DOMAIN_TRANSIENT)
export class TUserStatus extends TDoc implements UserStatus {
  user!: Ref<Account>
  online!: boolean
}
