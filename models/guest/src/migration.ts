import {
  AccountRole,
  DOMAIN_MODEL_TX,
  type Account,
  type Ref,
  type Space,
  type TxCreateDoc,
  type TxUpdateDoc
} from '@digitranslab/core'
import { guestId } from '@digitranslab/guest'
import {
  migrateSpace,
  tryMigrate,
  type MigrateOperation,
  type MigrationClient,
  type MigrationUpgradeClient,
  type ModelLogger
} from '@digitranslab/model'
import core from '@digitranslab/model-core'
import { GUEST_DOMAIN } from '.'

export const guestOperation: MigrateOperation = {
  async migrate (client: MigrationClient, logger: ModelLogger): Promise<void> {
    await tryMigrate(client, guestId, [
      {
        state: 'migrateRoles',
        func: async (client) => {
          const stateMap = {
            0: AccountRole.User,
            1: AccountRole.Maintainer,
            2: AccountRole.Owner
          }
          const createTxes = await client.find<TxCreateDoc<Account>>(DOMAIN_MODEL_TX, {
            _class: core.class.TxCreateDoc,
            'attributes.role': { $in: [0, 1, 2] }
          })
          for (const tx of createTxes) {
            await client.update(
              DOMAIN_MODEL_TX,
              {
                _id: tx._id
              },
              {
                $set: {
                  'attributes.role': (stateMap as any)[tx.attributes.role]
                }
              }
            )
          }
          const updateTxes = await client.find<TxUpdateDoc<Account>>(DOMAIN_MODEL_TX, {
            _class: core.class.TxUpdateDoc,
            'operations.role': { $in: [0, 1, 2] }
          })
          for (const tx of updateTxes) {
            await client.update(
              DOMAIN_MODEL_TX,
              {
                _id: tx._id
              },
              {
                $set: {
                  'operations.role': (stateMap as any)[(tx.operations as any).role]
                }
              }
            )
          }
        }
      },
      {
        state: 'removeDeprecatedSpace',
        func: async (client: MigrationClient) => {
          await migrateSpace(client, 'guest:space:Links' as Ref<Space>, core.space.Workspace, [GUEST_DOMAIN])
        }
      }
    ])
  },
  async upgrade (state: Map<string, Set<string>>, client: () => Promise<MigrationUpgradeClient>): Promise<void> {}
}
