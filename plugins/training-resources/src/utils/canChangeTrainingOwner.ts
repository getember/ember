//
// Copyright @ 2024 Digitrans Inc.
//

import { checkMyPermission, permissionsStore } from '@digitranslab/view-resources'
import type { Training } from '@digitranslab/training'
import { get } from 'svelte/store'
import { getCurrentEmployeeRef } from './getCurrentEmployeeRef'
import training from '../plugin'

export function canChangeTrainingOwner (trainingObject: Training): boolean {
  return (
    trainingObject.owner === getCurrentEmployeeRef() &&
    checkMyPermission(training.permission.ChangeSomeoneElsesTrainingOwner, trainingObject.space, get(permissionsStore))
  )
}
