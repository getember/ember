<!--
// Copyright © 2023 Digitrans Inc.
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
  import { Attachment } from '@digitranslab/attachment'
  import { Doc, Ref } from '@digitranslab/core'
  import { Loading, updatePopup, Scroller } from '@digitranslab/ui'
  import { ListSelectionProvider } from '@digitranslab/view-resources'
  import AttachmentPresenter from './AttachmentPresenter.svelte'
  import AttachmentPreview from './AttachmentPreview.svelte'

  export let attachments: Attachment[] = []
  export let useAttachmentPreview = false
  export let progress = false
  export let progressItems: Ref<Doc>[] = []
  export let readonly: boolean = false

  let element: HTMLElement
  let attachmentPopupId: string = ''

  const listProvider = new ListSelectionProvider((offset: 1 | -1 | 0) => {
    const currentAttachmentIndex = listProvider.current()
    if (currentAttachmentIndex === undefined) return
    const selected = currentAttachmentIndex + offset
    const sel = listProvider.docs()[selected] as Attachment
    if (sel !== undefined && attachmentPopupId !== '') {
      listProvider.updateFocus(sel)
      updatePopup(attachmentPopupId, { props: { file: sel.file, name: sel.name, contentType: sel.type } })
    }
  })
  $: listProvider.update(attachments.filter((p) => p.type.startsWith('image/')))
</script>

<div class="attachment-grid-container">
  <Scroller noStretch shrink>
    <div class="attachment-grid">
      {#each attachments as attachment (attachment._id)}
        {#if useAttachmentPreview}
          <AttachmentPreview
            value={attachment}
            removable={!readonly}
            {listProvider}
            on:open={(res) => (attachmentPopupId = res.detail)}
          />
        {:else}
          <AttachmentPresenter
            value={attachment}
            removable={!readonly}
            showPreview
            progress={progressItems.includes(attachment._id)}
            on:remove
          />
        {/if}
      {/each}
      {#if progress}
        <div class="flex p-3" bind:this={element}>
          <Loading
            on:progress={() => {
              element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
            }}
          />
        </div>
      {/if}
    </div>
  </Scroller>
</div>

<style lang="scss">
  .attachment-grid-container {
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
    padding: 0.5rem;
    min-width: 0;
    max-height: 21.625rem;
    color: var(--theme-caption-color);
    background-color: var(--theme-button-default);
    border: 1px solid var(--theme-button-border);
    border-radius: 0.25rem;

    .attachment-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, 17.25rem);
      grid-auto-rows: minmax(3rem, auto);
      gap: 0.5rem;
    }
  }
</style>
