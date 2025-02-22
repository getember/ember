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
import activity, { type ActivityMessage, type SavedMessage } from '@digitranslab/activity'
import core, { type Ref, SortingOrder, type WithLookup } from '@digitranslab/core'
import { writable } from 'svelte/store'
import { createQuery, getClient } from '@digitranslab/presentation'

export const savedMessagesStore = writable<Array<WithLookup<SavedMessage>>>([])
export const messageInFocus = writable<Ref<ActivityMessage> | undefined>(undefined)

const savedMessagesQuery = createQuery(true)

export function loadSavedMessages (): void {
  const client = getClient()

  if (client !== undefined) {
    savedMessagesQuery.query(
      activity.class.SavedMessage,
      { space: core.space.Workspace },
      (res) => {
        savedMessagesStore.set(res.filter(({ $lookup }) => $lookup?.attachedTo !== undefined))
      },
      { lookup: { attachedTo: activity.class.ActivityMessage }, sort: { modifiedOn: SortingOrder.Descending } }
    )
  } else {
    setTimeout(() => {
      loadSavedMessages()
    }, 50)
  }
}

loadSavedMessages()
