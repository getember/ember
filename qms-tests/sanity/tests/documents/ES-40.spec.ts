import { test } from '@playwright/test'
import { attachScreenshot, HomepageURI, PlatformSettingSecond, PlatformURI, waitForNetworIdle } from '../utils'
import { allure } from 'allure-playwright'
import { DocumentContentPage } from '../model/documents/document-content-page'
import { faker } from '@faker-js/faker'

test.use({
  storageState: PlatformSettingSecond
})

test.describe('ISO 13485, 4.2.4 Control of documents ensure that documents of external origin are identified and their distribution controlled', () => {
  test.beforeEach(async ({ page }) => {
    await (await page.goto(`${PlatformURI}/${HomepageURI}`))?.finished()
  })

  test('TESTS-391. As a non space member, I cannot see nor edit any doc from that space', async ({ page }) => {
    await allure.description(
      'Requirement\nUser is not a part of space members and cannot see or edit any document from that space'
    )
    await allure.tms('TESTS-391', 'https://tracex.digitrans.lab/workbench/platform/tracker/TESTS-391')
    await test.step('2. check if non member can see space', async () => {
      const folderName = faker.word.words(1)
      const documentContentPage = new DocumentContentPage(page)
      await documentContentPage.clickAddFolderButton()
      await documentContentPage.fillDocumentSpaceFormManager(folderName)
      await documentContentPage.changeDocumentSpaceMembers(folderName)
      await documentContentPage.checkIfTheSpaceIsVisible(folderName, false)
      await documentContentPage.clickDocumentsSpace()
      await waitForNetworIdle(page)
      await documentContentPage.clickOnTeamspaceOrArrow()
      await documentContentPage.fillTeamspaceFormManager(folderName)
      await documentContentPage.changeTeamspaceMembers(folderName)
      await documentContentPage.checkIfTheSpaceIsVisible(folderName, false)
      await attachScreenshot('TESTS-391_space_not_existing.png', page)
    })
  })

  test('TESTS-388. As a workspace owner, I can remove a user from workspace', async ({ page }) => {
    await allure.description(
      'Requirement\nUser is not a part of space members and cannot see or edit any document from that space'
    )
    await allure.tms('TESTS-388', 'https://tracex.digitrans.lab/workbench/platform/tracker/TESTS-388')
    await test.step('2. check if owner can kick user from workspace', async () => {
      const documentContentPage = new DocumentContentPage(page)
      await documentContentPage.clickContacts()
      await documentContentPage.clickEmployee()
      await documentContentPage.selectEmployee('KA Karmin Armin')
      await documentContentPage.clickEmployeeDropdown()
      await documentContentPage.clickKickEmployee()
      await documentContentPage.clickConfirmKickEmployee()
      await documentContentPage.checkIfEmployeeIsKicked('Karmin Armin')
    })
  })
})
