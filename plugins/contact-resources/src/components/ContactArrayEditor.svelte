<script lang="ts">
  import { Contact } from '@digitranslab/contact'
  import { ArrOf, Doc, Ref, RefTo } from '@digitranslab/core'
  import { IntlString } from '@digitranslab/platform'
  import ContactList from './ContactList.svelte'

  export let label: IntlString
  export let value: Ref<Contact>[]
  export let type: ArrOf<RefTo<Doc>> | undefined
  export let onChange: (refs: Ref<Contact>[]) => void
  export let readonly = false
  $: _clazz = (type?.of as RefTo<Doc>)?.to
  let timer: any

  function onUpdate (evt: CustomEvent<Ref<Contact>[]>): void {
    clearTimeout(timer)
    timer = setTimeout(() => {
      onChange(evt.detail)
    }, 500)
  }
</script>

<ContactList
  items={value}
  {label}
  _class={_clazz}
  on:update={onUpdate}
  kind={'link'}
  size={'medium'}
  justify={'left'}
  width={'100%'}
  {readonly}
/>
