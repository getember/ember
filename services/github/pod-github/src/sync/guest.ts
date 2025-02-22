//
// Copyright © 2023 Digitrans Inc.
//

import { Branding, TxOperations, WorkspaceIdWithUrl } from '@digitranslab/core'
import { MarkupMarkType, MarkupNode, MarkupNodeType, traverseMarkupNode } from '@digitranslab/text'
import { getPublicLink } from '@digitranslab/server-guest-resources'
import { Task } from '@digitranslab/task'

const githubLinkText = process.env.LINK_TEXT ?? 'Ember&reg;:'

const githubLinkTextOld = 'View in Ember'

export function hasEmberLinkText (text: string): boolean {
  return text.includes(githubLinkText) || text.includes(githubLinkTextOld)
}

export function hasEmberLink (href: string, guestLink: string): boolean {
  return href.includes(guestLink)
}

export async function stripGuestLink (markdown: MarkupNode): Promise<void> {
  const toRemove: MarkupNode[] = []

  traverseMarkupNode(markdown, (node) => {
    if (node.content === undefined) {
      return
    }
    const oldLength = node.content.length
    node.content = node.content.filter((it) => it.type !== MarkupNodeType.subLink)

    // sub is an inline node hence tiptap wraps it with a paragraph
    // so we need to remove the parent paragraph node if it is empty
    if (node.content.length !== oldLength && node.type === MarkupNodeType.paragraph) {
      toRemove.push(node)
    }
  })

  // traverse nodes once again and remove empty parent node
  traverseMarkupNode(markdown, (node) => {
    if (node.content === undefined) {
      return
    }
    node.content = node.content.filter((it) => !toRemove.includes(it))
  })
}
export async function appendGuestLink (
  client: TxOperations,
  doc: Task,
  markdown: MarkupNode,
  workspace: WorkspaceIdWithUrl,
  branding: Branding | null
): Promise<void> {
  const publicLink = await getPublicLink(doc, client, workspace, false, branding)
  await stripGuestLink(markdown)
  appendGuestLinkToModel(markdown, publicLink, doc.identifier)
}

export function appendGuestLinkToModel (markdown: MarkupNode, publicLink: string, identifier: string): void {
  markdown.content = [
    ...(markdown.content ?? []),
    {
      type: MarkupNodeType.paragraph,
      content: [
        {
          type: MarkupNodeType.subLink,
          content: [
            {
              type: MarkupNodeType.text,
              text: githubLinkText.trim() + ' <b>' + identifier + '</b>',
              marks: [{ type: MarkupMarkType.link, attrs: { href: publicLink, _target: '_blank' } }]
            }
          ]
        }
      ]
    }
  ]
}
