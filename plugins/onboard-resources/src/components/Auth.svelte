<script lang="ts">
  import login, { LoginInfo, WorkspaceLoginInfo } from '@digitranslab/login'
  import { getLoginInfoFromQuery, navigateToWorkspace } from '@digitranslab/login-resources'
  import { setMetadata } from '@digitranslab/platform'
  import presentation from '@digitranslab/presentation'
  import { Loading, setMetadataLocalStorage } from '@digitranslab/ui'
  import { onMount } from 'svelte'
  import { afterConfirm, goToLogin } from '../utils'

  onMount(async () => {
    const result = await getLoginInfoFromQuery()
    if (result !== undefined) {
      if (isWorkspaceLoginInfo(result)) {
        navigateToWorkspace(result.workspace, result, undefined, true)
        return
      }
      setMetadata(presentation.metadata.Token, result.token)
      setMetadataLocalStorage(login.metadata.LastToken, result.token)
      setMetadataLocalStorage(login.metadata.LoginEndpoint, result.endpoint)
      setMetadataLocalStorage(login.metadata.LoginEmail, result.email)
      await afterConfirm(true)
    } else {
      goToLogin('login', true)
    }
  })

  function isWorkspaceLoginInfo (info: WorkspaceLoginInfo | LoginInfo): info is WorkspaceLoginInfo {
    return (info as WorkspaceLoginInfo).workspace !== undefined
  }
</script>

<Loading />
