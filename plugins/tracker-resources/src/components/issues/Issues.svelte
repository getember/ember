<!--
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
-->
<script lang="ts">
  import { DocumentQuery, Ref } from '@digitranslab/core'
  import type { Asset, IntlString } from '@digitranslab/platform'
  import { createQuery } from '@digitranslab/presentation'
  import { Issue, IssueStatus, Project } from '@digitranslab/tracker'
  import { IModeSelector, resolvedLocationStore } from '@digitranslab/ui'
  import view, { Viewlet } from '@digitranslab/view'
  import { createEventDispatcher } from 'svelte'

  import { TypeSelector, selectedTaskTypeStore, selectedTypeStore, taskTypeStore } from '@digitranslab/task-resources'
  import tracker from '../../plugin'
  import IssuesView from './IssuesView.svelte'

  import task from '@digitranslab/task'

  export let currentSpace: Ref<Project> | undefined = undefined
  export let baseQuery: DocumentQuery<Issue> = {}
  export let title: IntlString
  export let icon: Asset | undefined = undefined
  export let config: [string, IntlString, object][]
  export let allProjectsTypes: boolean = false

  export let baseClass = tracker.class.Issue

  const dispatch = createEventDispatcher()

  let query: DocumentQuery<Issue> | undefined = undefined
  let modeSelectorProps: IModeSelector | undefined = undefined

  const allProjectQuery = createQuery()
  let allProjects: Pick<Project, '_id' | '_class' | 'archived'>[] = []

  allProjectQuery.query(
    tracker.class.Project,
    {},
    (res) => {
      allProjects = res
    },
    { projection: { _id: 1, archived: 1 } }
  )
  $: spaceQuery = currentSpace
    ? { space: currentSpace }
    : { space: { $in: allProjects.filter((it) => !it.archived).map((it) => it._id) } }

  $: all = { ...baseQuery, ...spaceQuery }

  const activeStatusQuery = createQuery()

  let activeStatuses: Ref<IssueStatus>[] = []

  $: activeStatusQuery.query(
    tracker.class.IssueStatus,
    { category: { $in: [task.statusCategory.Active, task.statusCategory.ToDo] } },
    (result) => {
      activeStatuses = result.map(({ _id }) => _id)
    }
  )

  let active: DocumentQuery<Issue>
  $: active = { status: { $in: activeStatuses }, ...spaceQuery }

  const backlogStatusQuery = createQuery()

  let backlogStatuses: Ref<IssueStatus>[] = []
  let backlog: DocumentQuery<Issue> = {}
  $: backlogStatusQuery.query(tracker.class.IssueStatus, { category: task.statusCategory.UnStarted }, (result) => {
    backlogStatuses = result.map(({ _id }) => _id)
  })
  $: backlog = { status: { $in: backlogStatuses }, ...spaceQuery }

  $: queries = { all, active, backlog }
  $: mode = $resolvedLocationStore.query?.mode ?? undefined
  $: if (mode === undefined || (queries as any)[mode] === undefined) {
    ;[[mode]] = config
  }
  $: if (mode !== undefined) {
    query = { ...(queries as any)[mode] }
    modeSelectorProps = {
      config,
      mode,
      onChange: (newMode: string) => dispatch('action', { mode: newMode })
    }
  }

  $: allTypes = Array.from($taskTypeStore.values())
    .filter((it) => it.parent === $selectedTypeStore)
    .map((it) => it._id)

  $: finalQuery = {
    ...query,
    ...(allProjectsTypes
      ? {}
      : $selectedTaskTypeStore !== undefined
        ? { kind: $selectedTaskTypeStore }
        : { kind: { $in: allTypes } })
  }

  const toVL = (data: any): Viewlet | undefined => data as Viewlet
</script>

{#if query !== undefined && modeSelectorProps !== undefined}
  <IssuesView query={finalQuery} space={currentSpace} {icon} {title} {modeSelectorProps}>
    <svelte:fragment slot="type_selector" let:viewlet>
      {#if !allProjectsTypes}
        <TypeSelector {baseClass} project={currentSpace} allTypes={toVL(viewlet)?.descriptor === view.viewlet.List} />
      {/if}
    </svelte:fragment>
  </IssuesView>
{/if}
