//
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
//

import { calendarId, type Event, type ReccuringEvent } from '@digitranslab/calendar'
import { type Ref, type Space } from '@digitranslab/core'
import {
  createDefaultSpace,
  tryMigrate,
  tryUpgrade,
  type MigrateOperation,
  type MigrationClient,
  type MigrationUpgradeClient
} from '@digitranslab/model'
import { DOMAIN_SPACE } from '@digitranslab/model-core'
import { DOMAIN_CALENDAR, DOMAIN_EVENT } from '.'
import calendar from './plugin'

async function migrateCalendars (client: MigrationClient): Promise<void> {
  await client.move(
    DOMAIN_SPACE,
    { _class: { $in: [calendar.class.Calendar, calendar.class.ExternalCalendar] } },
    DOMAIN_CALENDAR
  )
  await client.update(
    DOMAIN_CALENDAR,
    { _class: { $in: [calendar.class.Calendar, calendar.class.ExternalCalendar] } },
    { space: calendar.space.Calendar }
  )
  await client.update(
    DOMAIN_CALENDAR,
    { _class: { $in: [calendar.class.Calendar, calendar.class.ExternalCalendar] }, archived: true },
    { hidden: true }
  )
  await client.update(
    DOMAIN_CALENDAR,
    { _class: { $in: [calendar.class.Calendar, calendar.class.ExternalCalendar] }, archived: false },
    { hidden: false }
  )
  await client.update(
    DOMAIN_CALENDAR,
    { _class: { $in: [calendar.class.Calendar, calendar.class.ExternalCalendar] } },
    { $unset: { type: true, private: true, members: true, archived: true } }
  )

  const events = await client.find<Event>(DOMAIN_CALENDAR, {
    space: { $ne: calendar.space.Calendar }
  })
  const eventByCalendar = new Map<Ref<Space>, Ref<Event>[]>()
  for (const event of events) {
    const events = eventByCalendar.get(event.space) ?? []
    events.push(event._id)
    eventByCalendar.set(event.space, events)
  }
  for (const [_calendar, ids] of eventByCalendar) {
    await client.update(DOMAIN_CALENDAR, { _id: { $in: ids } }, { space: calendar.space.Calendar, calendar: _calendar })
  }
}

async function fixEventDueDate (client: MigrationClient): Promise<void> {
  const events = await client.find<Event>(DOMAIN_CALENDAR, {
    _class: calendar.class.Event,
    dueDate: { $exists: false }
  })
  for (const event of events) {
    await client.update(DOMAIN_CALENDAR, { _id: event._id }, { dueDate: event.date })
  }
}

async function migrateReminders (client: MigrationClient): Promise<void> {
  const events = await client.find(DOMAIN_CALENDAR, { 'calendar:mixin:Reminder': { $exists: true } })
  for (const event of events) {
    const shift = (event as any)['calendar:mixin:Reminder'].shift
    await client.update(DOMAIN_CALENDAR, { _id: event._id }, { reminders: [shift] })
    await client.update(DOMAIN_CALENDAR, { _id: event._id }, { $unset: { 'calendar:mixin:Reminder': true } })
  }
}

async function fillOriginalStartTime (client: MigrationClient): Promise<void> {
  const events = await client.find<ReccuringEvent>(DOMAIN_CALENDAR, {
    _class: calendar.class.ReccuringEvent,
    originalStartTime: { $exists: false }
  })
  for (const event of events) {
    await client.update(DOMAIN_CALENDAR, { _id: event._id }, { originalStartTime: event.date })
  }
}

async function migrateSync (client: MigrationClient): Promise<void> {
  await client.update(DOMAIN_SPACE, { _class: calendar.class.Calendar, sync: false }, { archived: true })
  await client.update(
    DOMAIN_SPACE,
    { _class: calendar.class.Calendar, sync: { $exists: true } },
    { $unset: { sync: true } }
  )
}

async function migrateTimezone (client: MigrationClient): Promise<void> {
  await client.update(
    DOMAIN_CALENDAR,
    {
      _class: { $in: [calendar.class.ReccuringEvent, calendar.class.ReccuringInstance] },
      timeZone: { $exists: false }
    },
    { timeZone: 'Etc/GMT' }
  )
}

export const calendarOperation: MigrateOperation = {
  async migrate (client: MigrationClient): Promise<void> {
    await tryMigrate(client, calendarId, [
      {
        state: 'calendar001',
        func: async (client) => {
          await fixEventDueDate(client)
          await migrateReminders(client)
          await fillOriginalStartTime(client)
          await migrateSync(client)
        }
      },
      {
        state: 'timezone',
        func: migrateTimezone
      },
      {
        state: 'migrate_calendars',
        func: migrateCalendars
      },
      {
        state: 'move-events',
        func: async (client) => {
          await client.move(
            DOMAIN_CALENDAR,
            { _class: { $in: client.hierarchy.getDescendants(calendar.class.Event) } },
            DOMAIN_EVENT
          )
        }
      }
    ])
  },
  async upgrade (state: Map<string, Set<string>>, client: () => Promise<MigrationUpgradeClient>): Promise<void> {
    await tryUpgrade(state, client, calendarId, [
      {
        state: 'default-space',
        func: (client) =>
          createDefaultSpace(client, calendar.space.Calendar, { name: 'Space for all events and calendars' })
      }
    ])
  }
}
