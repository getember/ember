<script lang="ts">
  import { Ref } from '@digitranslab/core'
  import { Icon, Label } from '@digitranslab/ui'
  import { GithubIntegrationRepository } from '@digitranslab/github'
  import github from '../plugin'
  import { integrationRepositories } from './utils'

  export let repository: Ref<GithubIntegrationRepository> | undefined = undefined

  $: repositoryValue = repository != null ? $integrationRepositories.get(repository) : undefined
</script>

<div class="flex-row-center">
  {#if repositoryValue}
    <Label label={github.string.IssueRepositoryTarget} />
    <div class="ml-2 mr-2">
      <Icon icon={github.icon.Github} size={'small'} />
    </div>
    {repositoryValue.name}
  {/if}
</div>
