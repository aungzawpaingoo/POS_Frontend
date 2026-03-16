"use client"

import { useState } from "react"
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Badge,
  AppBar,
  Toolbar,
} from "@mui/material"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import PointOfSaleIcon from "@mui/icons-material/PointOfSale"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import StorefrontIcon from "@mui/icons-material/Storefront"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import { useAppState } from "@/lib/store"
import InventoryView from "./InventoryView"
import POSView from "./POSView"
import ReceiptView from "./ReceiptView"

const tabs = [
  { label: "Inventory", icon: Inventory2OutlinedIcon },
  { label: "POS", icon: PointOfSaleIcon },
  { label: "Receipts", icon: ReceiptLongIcon },
] as const

export default function AppShell() {
  const { state } = useAppState()
  const [activeTab, setActiveTab] = useState(0)

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)

  const tabTitles = ["Inventory", "Point of Sale", "Receipts"]

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#FDF8F9" }}>
      {/* Top App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid #F5E1E5",
        }}
      >
        <Toolbar sx={{ minHeight: "56px !important", px: 2 }}>
  <img src="/Media.jpg" alt="Media Capabilities" width={40 } height={40} />
  <Typography variant="body2" sx={{ fontWeight: 800, color: "#2D1520", fontSize: "1rem", letterSpacing: "-0.025em" }}>
    Blush & Glow
  </Typography>
  <Box sx={{ flex: 1 }} />
  <Typography variant="caption" sx={{ color: "#C4A3AF", fontWeight: 500 }}>
    {tabTitles[activeTab]}
  </Typography>
</Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: "auto",
          px: 2,
          pt: 2,
          pb: "80px",
        }}
      >
        <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
          <InventoryView />
        </Box>
        <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
          <POSView onCheckout={() => setActiveTab(2)} />
        </Box>
        <Box sx={{ display: activeTab === 2 ? "block" : "none" }}>
          <ReceiptView />
        </Box>
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          bgcolor: "#FFFFFF",
          "& .MuiBottomNavigationAction-root": {
            py: 1,
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem",
            fontWeight: 600,
            "&.Mui-selected": {
              fontSize: "0.65rem",
              fontWeight: 700,
            },
          },
        }}
      >
        {tabs.map((tab, idx) => {
          const Icon = tab.icon
          const showBadge = idx === 1 && cartItemCount > 0

          return (
            <BottomNavigationAction
              key={tab.label}
              label={tab.label}
              icon={
                showBadge ? (
                  <Badge
                    badgeContent={cartItemCount}
                    color="error"
                    sx={{ "& .MuiBadge-badge": { fontSize: "0.6rem", minWidth: 16, height: 16, fontWeight: 700 } }}
                  >
                    <Icon />
                  </Badge>
                ) : (
                  <Icon />
                )
              }
            />
          )
        })}
      </BottomNavigation>
    </Box>
  )
}
