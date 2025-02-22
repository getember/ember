import client from '@digitranslab/client'
import { type Doc } from '@digitranslab/core'
import login from '@digitranslab/login'
import { getMetadata, getResource, setMetadata } from '@digitranslab/platform'
import presentation from '@digitranslab/presentation'
import { fetchMetadataLocalStorage, getCurrentLocation, navigate } from '@digitranslab/ui'
import view from '@digitranslab/view'
import { getObjectLinkFragment } from '@digitranslab/view-resources'
import { workbenchId } from '@digitranslab/workbench'

export async function checkAccess (doc: Doc): Promise<void> {
  const loc = getCurrentLocation()
  const ws = loc.path[1]
  const tokens: Record<string, string> = fetchMetadataLocalStorage(login.metadata.LoginTokens) ?? {}
  const token = tokens[ws]
  const endpoint = getMetadata(presentation.metadata.Endpoint)
  if (token === undefined || endpoint === undefined) return
  const clientFactory = await getResource(client.function.GetClient)
  const _client = await clientFactory(token, endpoint)

  const res = await _client.findOne(doc._class, { _id: doc._id })
  const hierarchy = _client.getHierarchy()
  await _client.close()
  if (res !== undefined) {
    const panelComponent = hierarchy.classHierarchyMixin(doc._class, view.mixin.ObjectPanel)
    const comp = panelComponent?.component ?? view.component.EditDoc
    const loc = await getObjectLinkFragment(hierarchy, doc, {}, comp)
    loc.path[0] = workbenchId
    loc.path[1] = ws
    // We have access, let's set correct tokens and redirect)
    setMetadata(presentation.metadata.Token, token)
    navigate(loc)
  }
}
