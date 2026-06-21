// "use client"

// import MuiThemeProvider from "@/components/MuiThemeProvider"
// import { AppProvider } from "@/lib/store"
// import AppShell from "@/components/AppShell"

// export default function Home() {
//   return (
//     <MuiThemeProvider>
//       <AppProvider>
//         <AppShell />
//       </AppProvider>
//     </MuiThemeProvider>
//   )
// }


"use client"

import React, { useEffect, useState } from "react"
import MuiThemeProvider from "@/components/MuiThemeProvider"
import { AppProvider, useAppState } from "@/lib/store"
import AppShell from "@/components/AppShell"
import LoginView from "@/components/Login"
import { CircularProgress } from "@mui/material"

function MainLayoutContent() {
  const { state } = useAppState()
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  if (!hasHydrated) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDF8F9",
        }}
      >
        <CircularProgress sx={{ color: "#2563EB" }} />
      </div>
    )
  }

  return state.isAuthenticated ? <AppShell /> : <LoginView />
}

export default function Home() {
  return (
    <MuiThemeProvider>
      <AppProvider>
        <MainLayoutContent />
      </AppProvider>
    </MuiThemeProvider>
  )
}