"use client"

import MuiThemeProvider from "@/components/MuiThemeProvider"
import { AppProvider } from "@/lib/store"
import AppShell from "@/components/AppShell"

export default function Home() {
  return (
    <MuiThemeProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </MuiThemeProvider>
  )
}
