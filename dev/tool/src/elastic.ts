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

import { Client as ElasticClient } from '@elastic/elasticsearch'
import core, { DOMAIN_DOC_INDEX_STATE, toWorkspaceString, type WorkspaceId } from '@digitranslab/core'
import { getMongoClient, getWorkspaceMongoDB } from '@digitranslab/mongo'
import { type StorageAdapter } from '@digitranslab/server-core'

export async function rebuildElastic (
  mongoUrl: string,
  workspaceId: WorkspaceId,
  storageAdapter: StorageAdapter,
  elasticUrl: string
): Promise<void> {
  const client = getMongoClient(mongoUrl)
  try {
    const _client = await client.getClient()
    const db = getWorkspaceMongoDB(_client, workspaceId)
    await db
      .collection(DOMAIN_DOC_INDEX_STATE)
      .updateMany({ _class: core.class.DocIndexState }, { $set: { elastic: false } })
  } finally {
    client.close()
  }

  await dropElastic(elasticUrl, workspaceId)
}

async function dropElastic (elasticUrl: string, workspaceId: WorkspaceId): Promise<void> {
  console.log('drop existing elastic docment')
  const client = new ElasticClient({
    node: elasticUrl
  })
  const productWs = toWorkspaceString(workspaceId)
  await new Promise((resolve, reject) => {
    client.indices.exists(
      {
        index: productWs
      },
      (err: any, result: any) => {
        if (err != null) reject(err)
        if (result.body === true) {
          client.indices.delete(
            {
              index: productWs
            },
            (err: any, result: any) => {
              if (err != null) reject(err)
              resolve(result)
            }
          )
        } else {
          resolve(result)
        }
      }
    )
  })
  await client.close()
}
