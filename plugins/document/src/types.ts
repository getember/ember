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

import { Attachment } from '@digitranslab/attachment'
import { Account, Class, MarkupBlobRef, Doc, Rank, Ref, TypedSpace } from '@digitranslab/core'
import { Preference } from '@digitranslab/preference'
import { IconProps } from '@digitranslab/view'

/** @public */
export interface Teamspace extends TypedSpace, IconProps {}

/** @public */
export interface Document extends Doc, IconProps {
  title: string
  content: MarkupBlobRef | null
  parent: Ref<Document>
  space: Ref<Teamspace>

  lockedBy?: Ref<Account> | null

  snapshots?: number
  attachments?: number
  comments?: number
  embeddings?: number
  labels?: number
  references?: number

  rank: Rank
}

/** @public */
export interface DocumentSnapshot extends Doc {
  title: string
  content: MarkupBlobRef
  parent: Ref<Document>
}

/** @public */
export interface SavedDocument extends Preference {
  attachedTo: Ref<Document>
}

/** @public */
export interface DocumentEmbedding extends Attachment {
  attachedTo: Ref<Document>
  attachedToClass: Ref<Class<Document>>
}
