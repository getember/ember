//
// Copyright © 2020 Digitrans Inc.
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

import { type DocUpdateMessageViewlet } from '@digitranslab/activity'
import { calendarId } from '@digitranslab/calendar'
import calendar from '@digitranslab/calendar-resources/src/plugin'
import { type Ref } from '@digitranslab/core'
import { type NotificationGroup } from '@digitranslab/notification'
import type { IntlString } from '@digitranslab/platform'
import { mergeIds } from '@digitranslab/platform'
import { type AnyComponent } from '@digitranslab/ui/src/types'
import {
  type Action,
  type ActionCategory,
  type ViewAction,
  type Viewlet,
  type ViewletDescriptor
} from '@digitranslab/view'
import { type Widget } from '@digitranslab/workbench'

export default mergeIds(calendarId, calendar, {
  component: {
    IntegrationConnect: '' as AnyComponent,
    CreateCalendar: '' as AnyComponent,
    EventPresenter: '' as AnyComponent,
    CalendarIntegrationIcon: '' as AnyComponent,
    CalendarEventPresenter: '' as AnyComponent,
    IntegrationConfigure: '' as AnyComponent,
    CalendarWidget: '' as AnyComponent
  },
  action: {
    SaveEventReminder: '' as Ref<Action>,
    DeleteRecEvent: '' as Ref<Action>
  },
  category: {
    Calendar: '' as Ref<ActionCategory>
  },
  actionImpl: {
    SaveEventReminder: '' as ViewAction,
    DeleteRecEvent: '' as ViewAction
  },
  string: {
    ApplicationLabelCalendar: '' as IntlString,
    Event: '' as IntlString,
    Reminder: '' as IntlString,
    Shift: '' as IntlString,
    State: '' as IntlString,
    CreatedReminder: '' as IntlString,
    ConfigLabel: '' as IntlString,
    ConfigDescription: '' as IntlString,
    IntegrationDescr: '' as IntlString
  },
  viewlet: {
    Calendar: '' as Ref<ViewletDescriptor>,
    CalendarEvent: '' as Ref<Viewlet>
  },
  ids: {
    UpdateRemainderActivityViewlet: '' as Ref<DocUpdateMessageViewlet>,
    CalendarNotificationGroup: '' as Ref<NotificationGroup>,
    CalendarWidget: '' as Ref<Widget>
  }
})
