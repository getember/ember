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

import { type Doc, type Ref } from '@digitranslab/core'
import { mergeIds } from '@digitranslab/platform'
import { type ViewAction, type Action } from '@digitranslab/view'
import { type FilePreviewExtension } from '@digitranslab/presentation'
import { printId } from '@digitranslab/print'
// This import is needed because of similar import in print plugin
// Otherwise, TS complains about missing types for resulting merge
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type AnyComponent } from '@digitranslab/ui/src/types'
import print from '@digitranslab/print-resources/src/plugin'

export default mergeIds(printId, print, {
  action: {
    Print: '' as Ref<Action<Doc, Record<string, any>>>
  },
  actionImpl: {
    Print: '' as ViewAction
  },
  previewExtension: {
    DOCX: '' as Ref<FilePreviewExtension>
  }
})
