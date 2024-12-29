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

import { concatLink } from '@digitranslab/core'
import { getMetadata } from '@digitranslab/platform'
import serverCore, { type TriggerControl } from '@digitranslab/server-core'
import type { Presenter } from '@digitranslab/server-notification'
import { workbenchId } from '@digitranslab/workbench'
import { trainingId, type TrainingRequest } from '@digitranslab/training'
import { TrainingRequestTextPresenter } from './TrainingRequestTextPresenter'

/** @public */
export const TrainingRequestHTMLPresenter: Presenter<TrainingRequest> = async (
  request: TrainingRequest,
  control: TriggerControl
) => {
  const front = control.branding?.front ?? getMetadata(serverCore.metadata.FrontUrl) ?? ''
  // TODO: Don't hardcode URLs, find a way to share routes info between front and server resources, and DRY
  const path = `${workbenchId}/${control.workspace.workspaceUrl}/${trainingId}/requests/${request._id}`
  const link = concatLink(front, path)
  const name = await TrainingRequestTextPresenter(request, control)
  return `<a href='${link}'>${name}</a>`
}
