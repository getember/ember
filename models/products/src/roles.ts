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

import core from '@digitranslab/core'
import documents from '@digitranslab/controlled-documents'
import products from './plugin'

export const roles = [
  {
    _id: products.role.QualifiedUser,
    name: 'Qualified User',
    permissions: [
      documents.permission.CreateDocument,
      documents.permission.ReviewDocument,
      documents.permission.ApproveDocument,
      documents.permission.CoAuthorDocument
    ]
  },
  {
    _id: products.role.Manager,
    name: 'Manager',
    permissions: [
      core.permission.ArchiveSpace,
      core.permission.UpdateSpace,
      documents.permission.CreateDocument,
      documents.permission.ReviewDocument,
      documents.permission.ApproveDocument,
      documents.permission.CoAuthorDocument
    ]
  },
  {
    _id: products.role.QARA,
    name: 'QARA',
    permissions: [
      core.permission.ArchiveSpace,
      core.permission.UpdateSpace,
      documents.permission.CreateDocument,
      documents.permission.ReviewDocument,
      documents.permission.ApproveDocument,
      documents.permission.CoAuthorDocument,
      documents.permission.ArchiveDocument,
      documents.permission.UpdateDocumentOwner
    ]
  }
]
