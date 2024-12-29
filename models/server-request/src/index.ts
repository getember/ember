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

import { type Builder } from '@digitranslab/model'

import core from '@digitranslab/core'
import serverCore from '@digitranslab/server-core'
import serverRequest from '@digitranslab/server-request'
import serverNotification from '@digitranslab/server-notification'
import request from '@digitranslab/model-request'

export { serverRequestId } from '@digitranslab/server-request'

export function createModel (builder: Builder): void {
  builder.createDoc(serverCore.class.Trigger, core.space.Model, {
    trigger: serverRequest.trigger.OnRequest,
    txMatch: {
      objectClass: request.class.Request
    }
  })

  builder.mixin(request.class.Request, core.class.Class, serverNotification.mixin.TextPresenter, {
    presenter: serverRequest.function.RequestTextPresenter
  })
}
