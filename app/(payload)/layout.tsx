import '@payloadcms/next/css'
import { RootLayout } from '@payloadcms/next/layouts'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClientArgs } from 'payload'
import config from '@payload-config'
import React from 'react'
import { importMap } from './admin/importMap.js'

const serverFunction = async (args: ServerFunctionClientArgs) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
