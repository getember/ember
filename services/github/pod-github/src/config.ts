//
// Copyright © 2023 Digitrans Inc.
//

import { systemAccountEmail } from '@digitranslab/core'

interface Config {
  AccountsURL: string
  ServiceID: string
  ServerSecret: string
  SystemEmail: string
  FrontURL: string

  // '*' means all workspaces
  AllowedWorkspaces: string[]
  AppID: string
  ClientID: string
  ClientSecret: string
  PrivateKey: string
  WebhookSecret: string
  EnterpriseHostname: string
  Port: number

  MongoURL: string
  ConfigurationDB: string

  CollaboratorURL: string

  BotName: string

  SentryDSN: string
  BrandingPath: string
}

const envMap: { [key in keyof Config]: string } = {
  AccountsURL: 'ACCOUNTS_URL',
  ServiceID: 'SERVICE_ID',
  ServerSecret: 'SERVER_SECRET',
  SystemEmail: 'SYSTEM_EMAIL',
  FrontURL: 'FRONT_URL',

  AppID: 'APP_ID',
  ClientID: 'CLIENT_ID',
  ClientSecret: 'CLIENT_SECRET',
  PrivateKey: 'PRIVATE_KEY',
  WebhookSecret: 'WEBHOOK_SECRET',
  EnterpriseHostname: 'ENTERPRISE_HOSTNAME',
  Port: 'PORT',
  AllowedWorkspaces: 'ALLOWED_WORKSPACES',
  BotName: 'BOT_NAME',

  MongoURL: 'MONGO_URL',
  ConfigurationDB: 'MONGO_DB',

  CollaboratorURL: 'COLLABORATOR_URL',

  SentryDSN: 'SENTRY_DSN',
  BrandingPath: 'BRANDING_PATH'
}

const required: Array<keyof Config> = [
  'AccountsURL',
  'ServerSecret',
  'ServiceID',
  'SystemEmail',
  'FrontURL',
  'AppID',
  'ClientID',
  'ClientSecret',
  'PrivateKey',

  'MongoURL',
  'ConfigurationDB',

  'CollaboratorURL',

  'BotName'
]

const config: Config = (() => {
  const params: Partial<Config> = {
    AccountsURL: process.env[envMap.AccountsURL],
    ServerSecret: process.env[envMap.ServerSecret],
    ServiceID: process.env[envMap.ServiceID] ?? 'github-service',
    SystemEmail: process.env[envMap.SystemEmail] ?? systemAccountEmail,
    AllowedWorkspaces: process.env[envMap.AllowedWorkspaces]?.split(',') ?? ['*'],
    FrontURL: process.env[envMap.FrontURL] ?? '',

    AppID: process.env[envMap.AppID],
    ClientID: process.env[envMap.ClientID],
    ClientSecret: process.env[envMap.ClientSecret],
    // https://github.com/octokit/auth-app.js/issues/465
    PrivateKey: process.env[envMap.PrivateKey]?.replace(/\\n/g, '\n'),
    WebhookSecret: process.env[envMap.WebhookSecret] ?? 'secret',
    EnterpriseHostname: process.env[envMap.EnterpriseHostname],
    Port: parseInt(process.env[envMap.Port] ?? '3500'),
    BotName: process.env[envMap.BotName] ?? 'dev[bot]',

    MongoURL: process.env[envMap.MongoURL],
    ConfigurationDB: process.env[envMap.ConfigurationDB] ?? '%github',

    CollaboratorURL: process.env[envMap.CollaboratorURL],

    SentryDSN: process.env[envMap.SentryDSN],
    BrandingPath: process.env[envMap.BrandingPath] ?? ''
  }

  const missingEnv = required.filter((key) => params[key] === undefined).map((key) => envMap[key])

  if (missingEnv.length > 0) {
    throw Error(`Missing env variables: ${missingEnv.join(', ')}`)
  }

  return params as Config
})()

export default config
