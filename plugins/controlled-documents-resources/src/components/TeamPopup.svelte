<!--
//
// Copyright © 2023 Digitrans Inc.
//
-->
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { RequestStatus } from '@digitranslab/request'
  import { Label, ModernDialog } from '@digitranslab/ui'
  import { getClient } from '@digitranslab/presentation'
  import contact, { Employee, PersonAccount } from '@digitranslab/contact'
  import { Class, Ref } from '@digitranslab/core'
  import { UserBoxItems } from '@digitranslab/contact-resources'
  import { permissionsStore } from '@digitranslab/view-resources'
  import documents, {
    ControlledDocument,
    ControlledDocumentState,
    DocumentRequest
  } from '@digitranslab/controlled-documents'

  import documentsRes from '../plugin'
  import { sendApprovalRequest, sendReviewRequest } from '../utils'

  export let controlledDoc: ControlledDocument
  export let requestClass: Ref<Class<DocumentRequest>>
  export let readonly: boolean = false

  const client = getClient()
  const hierarchy = client.getHierarchy()
  const dispatch = createEventDispatcher()

  const isReviewRequest = hierarchy.isDerived(requestClass, documentsRes.class.DocumentReviewRequest)

  const docField: keyof ControlledDocument = isReviewRequest ? 'reviewers' : 'approvers'
  const label = isReviewRequest ? documentsRes.string.SelectReviewers : documentsRes.string.SelectApprovers
  const sendRequestFunc = isReviewRequest ? sendReviewRequest : sendApprovalRequest
  const permissionId = isReviewRequest ? documents.permission.ReviewDocument : documents.permission.ApproveDocument
  $: permissionsSpace =
    controlledDoc.space === documents.space.UnsortedTemplates ? documents.space.QualityDocuments : controlledDoc.space
  $: permittedAccounts = $permissionsStore.ap[permissionsSpace]?.[permissionId] ?? new Set()
  let permittedPeople: Array<Ref<Employee>> = []

  $: if (permittedAccounts.size > 0) {
    void client
      .findAll(contact.class.PersonAccount, {
        _id: { $in: Array.from(permittedAccounts) as Array<Ref<PersonAccount>> }
      })
      .then((res) => {
        permittedPeople = res.map((pa) => pa.person) as Array<Ref<Employee>>
      })
  } else {
    permittedPeople = []
  }

  let docRequest: DocumentRequest | undefined
  let loading = true
  void client
    .findOne(requestClass, {
      attachedTo: controlledDoc._id,
      status: RequestStatus.Active
    })
    .then((res) => {
      loading = false
      docRequest = res
    })

  let users: Ref<Employee>[] = controlledDoc[docField] ?? []

  async function submit (): Promise<void> {
    loading = true

    await sendRequestFunc?.(client, controlledDoc, users)

    loading = false

    dispatch('close')
  }

  $: canSubmit = docRequest === undefined && users.length > 0
</script>

<ModernDialog {loading} {label} {canSubmit} on:submit={submit} on:close>
  <div class="flex-col pt-2">
    <div class="flex">
      <div class="flex labelContainer">
        <div class="label mr-1">
          <Label label={isReviewRequest ? documentsRes.string.Reviewers : documentsRes.string.Approvers} />
        </div>
        {users?.length}
      </div>
      <div class="flex-col">
        <UserBoxItems
          items={users}
          label={isReviewRequest ? documentsRes.string.Reviewers : documentsRes.string.Approvers}
          readonly={controlledDoc.controlledState === ControlledDocumentState.InReview ||
            controlledDoc.controlledState === ControlledDocumentState.InApproval ||
            readonly}
          docQuery={{
            active: true,
            _id: { $in: permittedPeople }
          }}
          on:update={({ detail }) => (users = detail)}
        />
      </div>
    </div>
  </div>
</ModernDialog>

<style lang="scss">
  .labelContainer {
    min-width: 11rem;
  }

  .label {
    color: var(--theme-qms-form-row-label-color);
    font-weight: 500;
  }
</style>
