<!--
//
// Copyright © 2023 Digitrans Inc.
//
-->
<script lang="ts">
  import { Icon } from '@digitranslab/ui'
  import { GithubIntegrationRepository } from '@digitranslab/github'
  import github from '../../plugin'

  export let value: GithubIntegrationRepository
</script>

<div class="flex-row-center">
  <Icon icon={github.icon.GithubRepository} size={'small'} />
  <span class="ml-1">{value.name}</span>
</div>
