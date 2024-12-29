//
// Copyright @ 2024 Digitrans Inc.
//

import type {
  AnswerDataAssessFunction,
  MultipleChoiceAssessment,
  MultipleChoiceAssessmentAnswer
} from '@digitranslab/questions'

/** @public */
export const MultipleChoiceAssessmentAssess: AnswerDataAssessFunction<
MultipleChoiceAssessment,
MultipleChoiceAssessmentAnswer
> = async (answerData, assessmentData) => {
  return {
    score:
      // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
      answerData.selectedIndices.slice().sort().join('~') === assessmentData.correctIndices.slice().sort().join('~')
        ? 100
        : 0
  }
}
