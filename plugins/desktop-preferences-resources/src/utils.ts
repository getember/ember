import { writable } from 'svelte/store'

import { createQuery } from '@digitranslab/presentation'
import desktopPreferences, {
  defaultNotificationPreference,
  type DesktopNotificationPreference,
  type DesktopNotificationPreferenceData
} from '@digitranslab/desktop-preferences'

// /**
//  * @public
//  */
export const activePreferences = writable<DesktopNotificationPreferenceData | DesktopNotificationPreference>(
  defaultNotificationPreference
)

const preferencesQuery = createQuery(true)
preferencesQuery.query(
  desktopPreferences.class.DesktopNotificationPreference,
  {},
  (res: DesktopNotificationPreference[]) => {
    if (res?.length > 0) {
      activePreferences.set(res[0])
    } else {
      activePreferences.set(defaultNotificationPreference)
    }
  }
)
