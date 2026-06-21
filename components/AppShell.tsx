// "use client"

// import { useState } from "react"
// import {
//   Box,
//   BottomNavigation,
//   BottomNavigationAction,
//   Typography,
//   Badge,
//   AppBar,
//   Toolbar,
// } from "@mui/material"
// import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale"
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
// import StorefrontIcon from "@mui/icons-material/Storefront"
// import PublicIcon from "@mui/icons-material/AutoAwesome"
// import { useAppState } from "@/lib/store"
// import InventoryView from "./InventoryView"
// import POSView from "./POSView"
// import ReceiptView from "./ReceiptView"

// const tabs = [
//   { label: "Inventory", icon: Inventory2OutlinedIcon },
//   { label: "POS", icon: PointOfSaleIcon },
//   { label: "Receipts", icon: ReceiptLongIcon },
// ] as const

// export default function AppShell() {
//   const { state } = useAppState()
//   const [activeTab, setActiveTab] = useState(0)

//   const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)

//   const tabTitles = ["Inventory", "Point of Sale", "Receipts"]

//   return (
//     <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#FDF8F9" }}>
//       {/* Top App Bar */}
//       <AppBar
//         position="sticky"
//         elevation={0}
//         sx={{
//           bgcolor: "#FFFFFF",
//           borderBottom: "1px solid #F5E1E5",
//         }}
//       >
//         <Toolbar sx={{ minHeight: "56px !important", px: 2 }}>
//           <PublicIcon sx={{ color: "#2563EB", mr: 1, fontSize: 26 }} />
//           <Typography variant="h6" sx={{ fontWeight: 800, color: "#2D1520", fontSize: "1.1rem", letterSpacing: "-0.025em" }}>
//             Glow B
//           </Typography>
//           <Box sx={{ flex: 1 }} />
//           <Typography variant="caption" sx={{ color: "#C4A3AF", fontWeight: 500 }}>
//             {tabTitles[activeTab]}
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flex: 1,
//           overflow: "auto",
//           px: 2,
//           pt: 2,
//           pb: "80px",
//         }}
//       >
//         <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
//           <InventoryView />
//         </Box>
//         <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
//           <POSView onCheckout={() => setActiveTab(2)} />
//         </Box>
//         <Box sx={{ display: activeTab === 2 ? "block" : "none" }}>
//           <ReceiptView />
//         </Box>
//       </Box>

//       {/* Bottom Navigation */}
//       <BottomNavigation
//         value={activeTab}
//         onChange={(_, newValue) => setActiveTab(newValue)}
//         showLabels
//         sx={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1200,
//           bgcolor: "#FFFFFF",
//           "& .MuiBottomNavigationAction-root": {
//             py: 1,
//           },
//           "& .MuiBottomNavigationAction-label": {
//             fontSize: "0.65rem",
//             fontWeight: 600,
//             "&.Mui-selected": {
//               fontSize: "0.65rem",
//               fontWeight: 700,
//             },
//           },
//         }}
//       >
//         {tabs.map((tab, idx) => {
//           const Icon = tab.icon
//           const showBadge = idx === 1 && cartItemCount > 0

//           return (
//             <BottomNavigationAction
//               key={tab.label}
//               label={tab.label}
//               icon={
//                 showBadge ? (
//                   <Badge
//                     badgeContent={cartItemCount}
//                     color="error"
//                     sx={{ "& .MuiBadge-badge": { fontSize: "0.6rem", minWidth: 16, height: 16, fontWeight: 700 } }}
//                   >
//                     <Icon />
//                   </Badge>
//                 ) : (
//                   <Icon />
//                 )
//               }
//             />
//           )
//         })}
//       </BottomNavigation>
//     </Box>
//   )
// }





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
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import PublicIcon from '@mui/icons-material/Public';
import { useAppState } from "@/lib/store"
import InventoryView from "./InventoryView"
import POSView from "./POSView"
import PaymentView from "./PaymentView"
import ReceiptView from "./ReceiptView"

// Added Payment to the tab array definition matrix
const tabs = [
  { label: "ပစ္စည်းစာရင်း", icon: Inventory2OutlinedIcon },
  { label: "ရောင်းချမှု", icon: PointOfSaleIcon },
  { label: "‌ငွေပေးချေမှု", icon: PaymentOutlinedIcon },
  { label: "ဘောက်ချာ", icon: ReceiptLongIcon },
] as const

export default function AppShell() {
  const { state } = useAppState()

 // console.log("Current State:", state);


  const [activeTab, setActiveTab] = useState(0)

  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)
  const [pendingTotal, setPendingTotal] = useState<number>(0)

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)

  // Map header titles explicitly based on array indices
  const tabTitles = ["Inventory", "Point of Sale", "Payment Processing", "Receipt History"]

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#FDF8F9" }}>
      {/* Top App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #F5E1E5",
        }}
      >
        <Toolbar sx={{ minHeight: "56px !important", px: 2 }}>
          <PublicIcon sx={{ color: "#2563EB", mr: 1, fontSize: 26 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#2563EB", fontSize: "1.1rem", letterSpacing: "-0.025em" }}>
            Orbit POS
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography variant="caption" sx={{ color: "black", fontWeight: 500, textAlign: 'right' }}>
            {tabTitles[activeTab]}
            {state.user && (
              <Box component="span" sx={{ display: 'block', fontSize: '1.1 rem', opacity: 1 }}>
                {state.user.name}
              </Box>
            )}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content Viewport Switcher */}
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
          {/* Directs user smoothly to payment step upon checkout trigger */}
          {/* <POSView onCheckout={() => setActiveTab(2)} /> */}
          <POSView
            onCheckout={(orderId, total) => {
              setPendingOrderId(orderId)
              setPendingTotal(total)
              setActiveTab(2) // Move to Payment tab
            }}
          />
        </Box>

        <Box sx={{ display: activeTab === 2 ? "block" : "none" }}>
          {/* Directs user to receipt log view upon completing final payments */}
          {/* <PaymentView onPaymentComplete={() => setActiveTab(3)} /> */}
          <PaymentView
            orderId={pendingOrderId || undefined}
            totalAmount={pendingTotal}
            onPaymentComplete={() => {
              setPendingOrderId(null) // Reset after payment
              setPendingTotal(0)
              setActiveTab(3) // Move to Receipts tab
            }}
          />
        </Box>

        <Box sx={{ display: activeTab === 3 ? "block" : "none" }}>
          {/* <ReceiptView /> */}
          <ReceiptView
            onCollectBalance={(orderId, balance) => {
              setPendingOrderId(orderId);
              setPendingTotal(balance);
              setActiveTab(2);
            }}
          />
        </Box>
      </Box>

      {/* Bottom Navigation Panel Matrix */}
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
          borderTop: "1px solid #F5E1E5",
          "& .MuiBottomNavigationAction-root": {
            py: 1,
            color: "#C4A3AF",
            "&.Mui-selected": {
              color: "#2563EB",
            }
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
                    sx={{ "& .MuiBadge-badge": { bgcolor: "#2563EB", fontSize: "0.6rem", minWidth: 16, height: 16, fontWeight: 700 } }}
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