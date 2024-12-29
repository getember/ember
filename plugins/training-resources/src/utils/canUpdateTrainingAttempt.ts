//
// Copyright @ 2024 Digitrans Inc.
//

import { type Training, type TrainingAttempt, type TrainingRequest, TrainingState } from '@digitranslab/training'
import { getCurrentEmployeeRef } from './getCurrentEmployeeRef'

export function canUpdateTrainingAttempt (
  attempt: TrainingAttempt,
  request: TrainingRequest,
  training: Training
): boolean {
  const currentEmployeeRef = getCurrentEmployeeRef()
  return (
    attempt.attachedTo === request._id &&
    request.attachedTo === training._id &&
    training.state === TrainingState.Released &&
    request.canceledOn === null &&
    request.trainees.includes(currentEmployeeRef) &&
    attempt.owner === currentEmployeeRef &&
    attempt.submittedOn === null
  )
}
