import type { Answer, Percentage, Question } from '@digitranslab/questions'
import type { Attachment } from '@digitranslab/attachment'
import type { Employee } from '@digitranslab/contact'
import {
  type AttachedDoc,
  type Class,
  type CollectionSize,
  type Doc,
  type Markup,
  type Ref,
  type Timestamp,
  type TypedSpace
} from '@digitranslab/core'

export const trainingPrefix = 'TR'

export enum TrainingSpecialIds {
  AllTrainings = 'all-trainings',
  IncomingRequests = 'my-requests',
  MyResults = 'my-results',
  MyTrainings = 'my-trainings',
  SentRequests = 'trainees-requests',
  TraineesResults = 'trainees-results'
}

/** @public */
export enum TrainingState {
  Draft = 'draft',
  Released = 'released',
  Archived = 'archived',
  Deleted = 'deleted'
}

/** @public */
export const trainingStateOrder: TrainingState[] = [
  TrainingState.Draft,
  TrainingState.Released,
  TrainingState.Archived,
  TrainingState.Deleted
]

/** @public */
export interface Training extends Doc<TypedSpace> {
  title: string
  code: string
  revision: number
  author: Ref<Employee>
  owner: Ref<Employee>
  state: TrainingState

  description: Markup
  attachments: CollectionSize<Attachment>
  passingScore: Percentage
  releasedOn: Timestamp | null
  releasedBy: Ref<Employee> | null

  questions: CollectionSize<Question<unknown>>
  requests: CollectionSize<TrainingRequest>
}

/** @public */
export interface TrainingRequest extends AttachedDoc<Training, 'requests', TypedSpace> {
  owner: Ref<Employee>
  trainees: Array<Ref<Employee>>
  // TODO: collaborators: Ref<Employee>[]
  dueDate: Timestamp | null
  maxAttempts: number | null
  attempts: CollectionSize<TrainingAttempt>
  canceledOn: Timestamp | null
  canceledBy: Ref<Employee> | null
}

/** @public */
export enum TrainingAttemptState {
  Draft = 'draft',
  Failed = 'failed',
  Passed = 'passed'
}

/** @public */
export const trainingAttemptStateOrder: TrainingAttemptState[] = [
  TrainingAttemptState.Draft,
  TrainingAttemptState.Failed,
  TrainingAttemptState.Passed
]

/** @public */
export interface TrainingAttempt extends AttachedDoc<TrainingRequest, 'attempts', TypedSpace> {
  owner: Ref<Employee>
  seqNumber: number
  answers: CollectionSize<Answer<Question<unknown>, unknown>>
  state: TrainingAttemptState
  submittedOn: Timestamp | null
  submittedBy: Ref<Employee> | null
  /**
   * Resulting score, filled on submission
   */
  score: Percentage | null
  /**
   * Number of assessment questions in related training, filled on submission, used to display results
   */
  assessmentsTotal: number | null
  /**
   * Number of passed assessment questions in related training, filled on submission, used to display results
   */
  assessmentsPassed: number | null
}

/**
 * @public
 *
 * Generic sequence attached to a class for cases when a single increment goes through all instances of the class.
 */
export interface Sequence extends Doc {
  attachedTo: Ref<Class<Doc>>
  sequence: number
}
