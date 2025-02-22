import { getWorkspaceId, WorkspaceId } from '@digitranslab/core'
import { getMetadata } from '@digitranslab/platform'
import { decode, encode } from 'jwt-simple'
import serverPlugin from './plugin'

/**
 * @public
 */
export interface Token {
  email: string
  workspace: WorkspaceId
  extra?: Record<string, any>
}

const getSecret = (): string => {
  return getMetadata(serverPlugin.metadata.Secret) ?? 'secret'
}

/**
 * @public
 */
export function generateToken (email: string, workspace: WorkspaceId, extra?: Record<string, string>): string {
  return encode({ ...(extra ?? {}), email, workspace: workspace.name }, getSecret())
}

/**
 * @public
 */
export function decodeToken (token: string, verify: boolean = true, secret?: string): Token {
  const value = decode(token, secret ?? getSecret(), !verify)
  const { email, workspace, ...extra } = value
  return { email, workspace: getWorkspaceId(workspace), extra }
}
