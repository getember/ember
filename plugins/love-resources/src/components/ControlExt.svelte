<!--
// Copyright © 2024 Digitrans Inc.
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
  import { formatName } from '@digitranslab/contact'
  import { Avatar, personByIdStore } from '@digitranslab/contact-resources'
  import { IdMap, Ref, toIdMap } from '@digitranslab/core'
  import {
    Invite,
    isOffice,
    JoinRequest,
    Office,
    ParticipantInfo,
    RequestStatus,
    Room,
    RoomType
  } from '@digitranslab/love'
  import { getEmbeddedLabel } from '@digitranslab/platform'
  import { createQuery, getClient } from '@digitranslab/presentation'
  import {
    closePopup,
    eventToHTMLElement,
    Location,
    location,
    PopupResult,
    showPopup,
    tooltip
  } from '@digitranslab/ui'
  import { onDestroy } from 'svelte'
  import workbench from '@digitranslab/workbench'
  import { closeWidget, closeWidgetTab, sidebarStore } from '@digitranslab/workbench-resources'

  import love from '../plugin'
  import { activeInvites, currentRoom, infos, myInfo, myInvites, myOffice, myRequests, rooms } from '../stores'
  import {
    createMeetingVideoWidgetTab,
    createMeetingWidget,
    disconnect,
    getRoomName,
    isCurrentInstanceConnected,
    leaveRoom,
    screenSharing
  } from '../utils'
  import ActiveInvitesPopup from './ActiveInvitesPopup.svelte'
  import InvitePopup from './InvitePopup.svelte'
  import PersonActionPopup from './PersonActionPopup.svelte'
  import RequestPopup from './RequestPopup.svelte'
  import RequestingPopup from './RequestingPopup.svelte'
  import RoomPopup from './RoomPopup.svelte'

  const client = getClient()

  interface ActiveRoom extends Room {
    participants: ParticipantInfo[]
  }

  function getActiveRooms (rooms: Room[], infos: ParticipantInfo[]): ActiveRoom[] {
    const roomMap = toIdMap(rooms)
    const map: IdMap<ActiveRoom> = new Map()
    for (const info of infos) {
      if (info.room === love.ids.Reception) continue
      const room = roomMap.get(info.room)
      if (room === undefined) continue
      // temprory disabled check for floor
      // if (room.floor !== selectedFloor?._id) continue
      const _id = room._id as Ref<ActiveRoom>
      const active = map.get(_id) ?? { ...room, _id, participants: [] }
      active.participants.push(info)
      map.set(_id, active)
    }
    const arr = Array.from(map.values()).filter(
      (r) => !isOffice(r) || r.participants.length > 1 || r.person !== r.participants[0]?.person
    )
    return arr
  }

  $: activeRooms = getActiveRooms($rooms, $infos)

  const query = createQuery()
  let requests: JoinRequest[] = []
  query.query(love.class.JoinRequest, { status: RequestStatus.Pending }, (res) => {
    requests = res
  })

  let activeRequest: JoinRequest | undefined = undefined
  const joinRequestCategory = 'joinRequest'
  function checkRequests (requests: JoinRequest[], $myInfo: ParticipantInfo | undefined): void {
    if (activeRequest !== undefined) {
      // try to find active request, if it not exists close popup
      if (requests.find((r) => r._id === activeRequest?._id && r.room === $myInfo?.room) === undefined) {
        closePopup(joinRequestCategory)
        activeRequest = undefined
      }
    }
    if (activeRequest === undefined) {
      activeRequest = requests.find((r) => r.room === $myInfo?.room)
      if (activeRequest !== undefined) {
        showPopup(RequestPopup, { request: activeRequest }, myOfficeElement, undefined, undefined, {
          category: joinRequestCategory,
          overlay: false,
          fixed: true
        })
      }
    }
  }

  const myJoinRequestCategory = 'MyJoinRequest'
  let myRequestsPopup: PopupResult | undefined = undefined

  function checkMyRequests (requests: JoinRequest[]): void {
    if (requests.length > 0) {
      if (myRequestsPopup === undefined) {
        myRequestsPopup = showPopup(RequestingPopup, { request: requests[0] }, myOfficeElement, undefined, undefined, {
          category: myJoinRequestCategory,
          overlay: false,
          fixed: true
        })
      }
    } else if (myRequestsPopup !== undefined) {
      myRequestsPopup.close()
      myRequestsPopup = undefined
    }
  }

  $: checkMyRequests($myRequests)

  let myOfficeElement: HTMLDivElement

  $: checkRequests(requests, $myInfo)

  function openRoom (ev: MouseEvent, room: Room): void {
    showPopup(RoomPopup, { room }, ev.currentTarget as HTMLElement)
  }

  let activeInvite: Invite | undefined = undefined
  const inviteCategory = 'inviteReq'
  function checkInvites (invites: Invite[]): void {
    if (activeInvite !== undefined) {
      // try to find active request, if it not exists close popup
      if (invites.find((r) => r._id === activeInvite?._id) === undefined) {
        closePopup(inviteCategory)
        activeInvite = undefined
      }
    }
    if (activeInvite === undefined) {
      activeInvite = invites[0]
      if (activeInvite !== undefined) {
        showPopup(InvitePopup, { invite: activeInvite }, myOfficeElement, undefined, undefined, {
          category: inviteCategory,
          overlay: false,
          fixed: true
        })
      }
    }
  }

  $: checkInvites($myInvites)

  async function checkOwnRoomConnection (
    infos: ParticipantInfo[],
    myInfo: ParticipantInfo | undefined,
    myOffice: Office | undefined,
    isConnected: boolean
  ): Promise<void> {
    if (myOffice !== undefined) {
      if (myInfo !== undefined && myInfo.room === myOffice._id) {
        const filtered = infos.filter((p) => p.room === myOffice._id && p.person !== myInfo.person)
        if (filtered.length === 0) {
          if (isConnected) {
            await disconnect()
          }
        }
      }
    }
  }

  $: checkOwnRoomConnection($infos, $myInfo, $myOffice, $isCurrentInstanceConnected)

  const myInvitesCategory = 'myInvites'

  let myInvitesPopup: PopupResult | undefined = undefined

  function checkActiveInvites (invites: Invite[]): void {
    if (invites.length > 0) {
      if (myInvitesPopup === undefined) {
        myInvitesPopup = showPopup(ActiveInvitesPopup, { invites }, myOfficeElement, undefined, undefined, {
          category: myInvitesCategory,
          overlay: false,
          fixed: true
        })
      }
    } else if (myInvitesPopup !== undefined) {
      myInvitesPopup.close()
      myInvitesPopup = undefined
    }
  }

  $: reception = $rooms.find((f) => f._id === love.ids.Reception)

  $: receptionParticipants = $infos.filter((p) => p.room === love.ids.Reception)

  $: checkActiveInvites($activeInvites)

  function checkActiveVideo (loc: Location, video: boolean, room: Ref<Room> | undefined): void {
    const meetingWidgetState = $sidebarStore.widgetsState.get(love.ids.MeetingWidget)
    const isMeetingWidgetCreated = meetingWidgetState !== undefined

    if (room === undefined) {
      if (isMeetingWidgetCreated) {
        closeWidget(love.ids.MeetingWidget)
      }
      return
    }

    if ($isCurrentInstanceConnected) {
      const widget = client.getModel().findAllSync(workbench.class.Widget, { _id: love.ids.MeetingWidget })[0]
      if (widget === undefined) return

      if (!isMeetingWidgetCreated) {
        createMeetingWidget(widget, room, video)
      } else if (video && !meetingWidgetState.tabs.some(({ id }) => id === 'video')) {
        createMeetingVideoWidgetTab(widget)
      } else if (!video && meetingWidgetState.tabs.some(({ id }) => id === 'video')) {
        void closeWidgetTab(widget, 'video')
      }
    } else {
      if (isMeetingWidgetCreated) {
        closeWidget(love.ids.MeetingWidget)
      }
    }
  }

  $: checkActiveVideo(
    $location,
    $isCurrentInstanceConnected && ($currentRoom?.type === RoomType.Video || $screenSharing),
    $currentRoom?._id
  )

  $: joined = activeRooms.filter((r) => $myInfo?.room === r._id)

  onDestroy(() => {
    closePopup(myInvitesCategory)
    closePopup(inviteCategory)
    closePopup(joinRequestCategory)
    closePopup(myJoinRequestCategory)
    closeWidget(love.ids.MeetingWidget)
  })

  function participantClickHandler (e: MouseEvent, participant: ParticipantInfo): void {
    if ($myInfo !== undefined) {
      showPopup(PersonActionPopup, { room: reception, person: participant.person }, eventToHTMLElement(e))
    }
  }

  function getParticipantClickHandler (participant: ParticipantInfo): (e: MouseEvent) => void {
    return (e: MouseEvent) => {
      participantClickHandler(e, participant)
    }
  }

  onDestroy(() => {
    removeEventListener('beforeunload', beforeUnloadListener)
  })

  const beforeUnloadListener = () => {
    if ($myInfo !== undefined && $isCurrentInstanceConnected) {
      leaveRoom($myInfo, $myOffice)
    }
  }

  window.addEventListener('beforeunload', beforeUnloadListener)
</script>

<div class="flex-row-center flex-gap-2">
  {#if activeRooms.length > 0}
    <!--    <div class="divider" />-->
    {#each activeRooms as active}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="container flex-row-center"
        class:active={joined.find((r) => r._id === active._id)}
        on:click={(ev) => {
          openRoom(ev, active)
        }}
      >
        <div class="mr-2 overflow-label">{getRoomName(active, $personByIdStore)}</div>
        <div class="flex-row-center avatars">
          {#each active.participants as participant}
            <div use:tooltip={{ label: getEmbeddedLabel(formatName(participant.name)) }}>
              <Avatar name={participant.name} size={'card'} person={$personByIdStore.get(participant.person)} />
            </div>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
  {#if reception && receptionParticipants.length > 0}
    {#if activeRooms.length > 0}
      <div class="divider" />
    {/if}
    <div class="container flex-row-center flex-gap-2">
      <div>{getRoomName(reception, $personByIdStore)}</div>
      <div class="flex-row-center avatars">
        {#each receptionParticipants as participant (participant._id)}
          <div
            use:tooltip={{ label: getEmbeddedLabel(formatName(participant.name)) }}
            on:click={getParticipantClickHandler(participant)}
          >
            <Avatar name={participant.name} size={'card'} person={$personByIdStore.get(participant.person)} />
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .container {
    padding: 0.125rem 0.125rem 0.125rem 0.5rem;
    height: 1.625rem;
    font-weight: 500;
    background-color: var(--theme-button-pressed);
    border: 1px solid transparent;
    border-radius: 0.25rem;
    cursor: pointer;

    .label {
      font-weight: 700;
      color: var(--theme-caption-color);
    }
    &.main {
      order: -3;
      padding-right: 0.25rem;

      & + .divider {
        order: -2;
      }
    }
    &:hover {
      background-color: var(--theme-button-hovered);
      border-color: var(--theme-navpanel-divider);
    }
    &.active {
      order: -1;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0.125rem 0.125rem 0.125rem 0.5rem;
      background-color: var(--highlight-select);
      border-color: var(--highlight-select-border);

      &:hover {
        background-color: var(--highlight-select-hover);
      }
    }
  }

  .avatars {
    gap: 0.125rem;
  }

  .divider {
    height: 1.5rem;
    border: 1px solid var(--theme-divider-color);
  }
</style>
