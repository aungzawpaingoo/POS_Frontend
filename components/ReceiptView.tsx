// "use client"

// import { useRef, useState } from "react"
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   Chip,
//   Divider,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material"
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
// import DownloadIcon from "@mui/icons-material/Download"
// import ShareIcon from "@mui/icons-material/Share"
// import StorefrontIcon from "@mui/icons-material/Storefront"
// import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
// import HistoryIcon from "@mui/icons-material/History"
// import { toPng } from "html-to-image"
// import { useAppState, type SaleRecord } from "@/lib/store"

// export default function ReceiptView() {
//   const { state } = useAppState()
//   const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(
//     state.sales.length > 0 ? state.sales[0] : null
//   )
//   const receiptRef = useRef<HTMLDivElement>(null)
//   const [generating, setGenerating] = useState(false)
//   const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
//     open: false,
//     message: "",
//     severity: "success",
//   })

//   async function generateReceiptImage(): Promise<string | null> {
//     if (!receiptRef.current) return null
//     setGenerating(true)
//     try {
//       const dataUrl = await toPng(receiptRef.current, {
//         backgroundColor: "#FFFFFF",
//         pixelRatio: 3,
//         quality: 1,
//         cacheBust: true,
//       })
//       return dataUrl
//     } catch {
//       setSnackbar({ open: true, message: "Failed to generate receipt image", severity: "error" })
//       return null
//     } finally {
//       setGenerating(false)
//     }
//   }

//   async function handleDownload() {
//     const dataUrl = await generateReceiptImage()
//     if (!dataUrl) return

//     const link = document.createElement("a")
//     link.download = `receipt-${selectedSale?.id || "unknown"}.png`
//     link.href = dataUrl
//     link.click()
//     setSnackbar({ open: true, message: "Receipt downloaded as image", severity: "success" })
//   }

//   async function handleShare() {
//     const dataUrl = await generateReceiptImage()
//     if (!dataUrl) return

//     try {
//       const response = await fetch(dataUrl)
//       const blob = await response.blob()
//       const file = new File([blob], `receipt-${selectedSale?.id || "unknown"}.png`, { type: "image/png" })

//       if (navigator.share && navigator.canShare({ files: [file] })) {
//         await navigator.share({
//               title: "Beauty Store Receipt",
//               text: `Receipt for $${selectedSale?.total.toFixed(2)}`,
//           files: [file],
//         })
//         setSnackbar({ open: true, message: "Receipt shared successfully", severity: "success" })
//       } else {
//         handleDownload()
//       }
//     } catch {
//       setSnackbar({ open: true, message: "Sharing cancelled or not supported. Image downloaded instead.", severity: "error" })
//       handleDownload()
//     }
//   }

//   function formatDate(dateStr: string) {
//     const d = new Date(dateStr)
//     return d.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   if (state.sales.length === 0) {
//     return (
//       <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
//         <ReceiptLongIcon sx={{ fontSize: 64, color: "#F5E1E5", mb: 2 }} />
//         <Typography variant="h6" color="text.secondary" fontWeight={700} gutterBottom>
//           No Sales Yet
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Complete a sale from the POS tab to generate receipts here.
//         </Typography>
//       </Box>
//     )
//   }

//   return (
//     <Box sx={{ pb: 2 }}>
//       {/* Sales History Horizontal Scroll */}
//       <Box sx={{ mb: 2.5 }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
//           <HistoryIcon sx={{ color: "#7A6069", fontSize: 20 }} />
//           <Typography variant="body2" fontWeight={600} color="text.secondary">
//             Recent Sales
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 0.5 }}>
//           {state.sales.map((sale) => (
//             <Card
//               key={sale.id}
//               onClick={() => setSelectedSale(sale)}
//               sx={{
//                 minWidth: 140,
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//                 "&:active": { transform: "scale(0.97)" },
//                 ...(selectedSale?.id === sale.id && {
//                   borderColor: "#B5436E",
//                   borderWidth: 2,
//                   bgcolor: "#FDF2F8",
//                 }),
//               }}
//             >
//               <CardContent sx={{ p: "12px !important", "&:last-child": { pb: "12px !important" } }}>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
//                   {formatDate(sale.date)}
//                 </Typography>
//                 <Typography variant="subtitle2" fontWeight={800} sx={{ mt: 0.5 }}>
//                   ${sale.total.toFixed(2)}
//                 </Typography>
//                 <Chip
//                   label={`${sale.items.length} items`}
//                   size="small"
//                   sx={{ fontSize: "0.6rem", height: 20, mt: 0.5, bgcolor: "#FDF2F4", color: "#7A6069", fontWeight: 600 }}
//                 />
//               </CardContent>
//             </Card>
//           ))}
//         </Box>
//       </Box>

//       {selectedSale && (
//         <>
//           {/* Action Buttons */}
//           <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
//             <Button
//               variant="contained"
//               fullWidth
//               startIcon={generating ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
//               disabled={generating}
//               onClick={handleDownload}
//               sx={{ py: 1.2, fontWeight: 700 }}
//             >
//               {generating ? "Generating..." : "Download"}
//             </Button>
//             <Button
//               variant="outlined"
//               fullWidth
//               startIcon={<ShareIcon />}
//               onClick={handleShare}
//               disabled={generating}
//               sx={{ py: 1.2, fontWeight: 700, borderColor: "#B5436E", color: "#B5436E" }}
//             >
//               Share
//             </Button>
//           </Box>

//           {/* Receipt Preview */}
//           <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
//             Receipt Preview
//           </Typography>
//           <Box
//             sx={{
//               borderRadius: 3,
//               overflow: "hidden",
//               boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//               border: "1px solid #F5E1E5",
//             }}
//           >
//             <Box
//               ref={receiptRef}
//               sx={{
//                 bgcolor: "#FFFFFF",
//                 p: 3,
//                 minWidth: 320,
//               }}
//             >
//               {/* Receipt Header */}
//               <Box sx={{ textAlign: "center", mb: 2.5 }}>
//                 <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
//                   <AutoAwesomeIcon sx={{ fontSize: 32, color: "#B5436E" }} />
//                 </Box>
//                 <Typography variant="h6" fontWeight={800} sx={{ color: "#2D1520", letterSpacing: "-0.025em" }}>
//                   Glow Beauty
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: "#C4A3AF", display: "block", mt: 0.25, fontSize: "0.65rem" }}>
//                   Skincare & Cosmetics
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: "#C4A3AF", display: "block", mt: 0.5 }}>
//                   Thank you for your purchase
//                 </Typography>
//               </Box>

//               {/* Dashed divider */}
//               <Box
//                 sx={{
//                   borderBottom: "2px dashed #F5E1E5",
//                   mb: 2,
//                 }}
//               />

//               {/* Receipt Info */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
//                 <Typography variant="caption" sx={{ color: "#C4A3AF" }}>
//                   Receipt #
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: "#7A6069", fontFamily: "monospace", fontWeight: 600 }}>
//                   {selectedSale.id.toUpperCase()}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//                 <Typography variant="caption" sx={{ color: "#C4A3AF" }}>
//                   Date
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: "#7A6069", fontWeight: 600 }}>
//                   {formatDate(selectedSale.date)}
//                 </Typography>
//               </Box>

//               {/* Dashed divider */}
//               <Box sx={{ borderBottom: "2px dashed #F5E1E5", mb: 2 }} />

//               {/* Column Headers */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//                 <Typography variant="caption" sx={{ color: "#C4A3AF", fontWeight: 600, flex: 1 }}>
//                   Item
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: "#C4A3AF", fontWeight: 600, width: 40, textAlign: "center" }}>
//                   Qty
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: "#C4A3AF", fontWeight: 600, width: 70, textAlign: "right" }}>
//                   Amount
//                 </Typography>
//               </Box>

//               {/* Items */}
//               {selectedSale.items.map((item, idx) => (
//                 <Box key={idx}>
//                   <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", py: 0.75 }}>
//                     <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
//                       <Typography variant="body2" fontWeight={600} sx={{ color: "#2D1520", fontSize: "0.85rem" }}>
//                         {item.product.name}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: "#C4A3AF" }}>
//                         @ ${item.product.price.toFixed(2)}
//                       </Typography>
//                     </Box>
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "#7A6069", width: 40, textAlign: "center", fontWeight: 600 }}
//                     >
//                       {item.quantity}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       fontWeight={700}
//                       sx={{ color: "#2D1520", width: 70, textAlign: "right" }}
//                     >
//                       ${(item.product.price * item.quantity).toFixed(2)}
//                     </Typography>
//                   </Box>
//                   {idx < selectedSale.items.length - 1 && (
//                     <Divider sx={{ borderStyle: "dotted", borderColor: "#FDF2F4" }} />
//                   )}
//                 </Box>
//               ))}

//               {/* Dashed divider */}
//               <Box sx={{ borderBottom: "2px dashed #F5E1E5", my: 2 }} />

//               {/* Totals */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
//                 <Typography variant="body2" sx={{ color: "#7A6069" }}>
//                   Subtotal
//                 </Typography>
//                 <Typography variant="body2" fontWeight={600} sx={{ color: "#2D1520" }}>
//                   ${selectedSale.total.toFixed(2)}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
//                 <Typography variant="body2" sx={{ color: "#7A6069" }}>
//                   Tax
//                 </Typography>
//                 <Typography variant="body2" fontWeight={600} sx={{ color: "#2D1520" }}>
//                   $0.00
//                 </Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   mt: 1.5,
//                   p: 1.5,
//                   bgcolor: "#FDF2F8",
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#2D1520" }}>
//                   Total
//                 </Typography>
//                 <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#B5436E" }}>
//                   ${selectedSale.total.toFixed(2)}
//                 </Typography>
//               </Box>

//               {/* Footer */}
//               <Box sx={{ textAlign: "center", mt: 3 }}>
//                 <Box sx={{ borderBottom: "2px dashed #F5E1E5", mb: 2 }} />
//                 <Typography variant="caption" sx={{ color: "#C4A3AF", display: "block" }}>
//                   Items sold: {selectedSale.items.reduce((s, i) => s + i.quantity, 0)}
//                 </Typography>
//                 <Typography
//                   variant="caption"
//                   sx={{ color: "#C4A3AF", display: "block", mt: 1, fontWeight: 500 }}
//                 >
//                   Powered by Glow Beauty
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </>
//       )}

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={2500}
//         onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           severity={snackbar.severity}
//           onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
//           sx={{ width: "100%", fontWeight: 600 }}
//           variant="filled"
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }





"use client"

import { useRef, useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import DownloadIcon from "@mui/icons-material/Download"
import ShareIcon from "@mui/icons-material/Share"
import StorefrontIcon from "@mui/icons-material/Storefront"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import HistoryIcon from "@mui/icons-material/History"
import { toPng } from "html-to-image"
import { useAppState, type SaleRecord } from "@/lib/store"

export default function ReceiptView() {
  const { state } = useAppState()
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(
    state.sales.length > 0 ? state.sales[0] : null
  )
  const receiptRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })

  async function generateReceiptImage(): Promise<string | null> {
    if (!receiptRef.current) return null
    setGenerating(true)
    try {
      const dataUrl = await toPng(receiptRef.current, {
        backgroundColor: "#FFFFFF",
        pixelRatio: 3,
        quality: 1,
        cacheBust: true,
      })
      return dataUrl
    } catch {
      setSnackbar({ open: true, message: "Failed to generate receipt image", severity: "error" })
      return null
    } finally {
      setGenerating(false)
    }
  }

  async function handleDownload() {
    const dataUrl = await generateReceiptImage()
    if (!dataUrl) return

    const link = document.createElement("a")
    link.download = `receipt-${selectedSale?.id || "unknown"}.png`
    link.href = dataUrl
    link.click()
    setSnackbar({ open: true, message: "Receipt downloaded as image", severity: "success" })
  }

  async function handleShare() {
    const dataUrl = await generateReceiptImage()
    if (!dataUrl) return

    try {
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], `receipt-${selectedSale?.id || "unknown"}.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Beauty Store Receipt",
          text: `Receipt for $${selectedSale?.total.toFixed(2)}`,
          files: [file],
        })
        setSnackbar({ open: true, message: "Receipt shared successfully", severity: "success" })
      } else {
        handleDownload()
      }
    } catch {
      setSnackbar({ open: true, message: "Sharing cancelled or not supported. Image downloaded instead.", severity: "error" })
      handleDownload()
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (state.isLoading && state.sales.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (state.sales.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
        <ReceiptLongIcon sx={{ fontSize: 64, color: "#F5E1E5", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" fontWeight={700} gutterBottom>
          No Sales Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete a sale from the POS tab to generate receipts here.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 2 }}>
      {/* Sales History Horizontal Scroll */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <HistoryIcon sx={{ color: "#7A6069", fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Recent Sales
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 0.5 }}>
          {state.sales.map((sale) => (
            <Card
              key={sale.id}
              onClick={() => setSelectedSale(sale)}
              sx={{
                minWidth: 140,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:active": { transform: "scale(0.97)" },
                ...(selectedSale?.id === sale.id && {
                  borderColor: "#B5436E",
                  borderWidth: 2,
                  bgcolor: "#FDF2F8",
                }),
              }}
            >
              <CardContent sx={{ p: "12px !important", "&:last-child": { pb: "12px !important" } }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                  {formatDate(sale.date)}
                </Typography>
                <Typography variant="subtitle2" fontWeight={800} sx={{ mt: 0.5 }}>
                  ${sale.total.toFixed(2)}
                </Typography>
                <Chip
                  label={`${sale.items.length} items`}
                  size="small"
                  sx={{ fontSize: "0.6rem", height: 20, mt: 0.5, bgcolor: "#FDF2F4", color: "#7A6069", fontWeight: 600 }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {selectedSale && (
        <>
          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={generating ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
              disabled={generating}
              onClick={handleDownload}
              sx={{ py: 1.2, fontWeight: 700 }}
            >
              {generating ? "Generating..." : "Download"}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ShareIcon />}
              onClick={handleShare}
              disabled={generating}
              sx={{ py: 1.2, fontWeight: 700, borderColor: "#B5436E", color: "#B5436E" }}
            >
              Share
            </Button>
          </Box>

          {/* Receipt Preview */}
          <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
            Receipt Preview
          </Typography>
          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #F5E1E5",
            }}
          >
            <Box
              ref={receiptRef}
              sx={{
                bgcolor: "#FFFFFF",
                p: 3,
                minWidth: 320,
              }}
            >
              {/* Receipt Header */}
              <Box sx={{ textAlign: "center", mb: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 32, color: "#B5436E" }} />
                </Box>
                <Typography variant="h6" fontWeight={800} sx={{ color: "#2D1520", letterSpacing: "-0.025em" }}>
                  Glow Beauty
                </Typography>
                <Typography variant="caption" sx={{ color: "#C4A3AF", display: "block", mt: 0.25, fontSize: "0.65rem" }}>
                  Skincare & Cosmetics
                </Typography>
                <Typography variant="caption" sx={{ color: "#C4A3AF", display: "block", mt: 0.5 }}>
                  Thank you for your purchase
                </Typography>
              </Box>

              {/* Dashed divider */}
              <Box
                sx={{
                  borderBottom: "2px dashed #F5E1E5",
                  mb: 2,
                }}
              />

              {/* Receipt Info */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: "#C4A3AF" }}>
                  Receipt #
                </Typography>
                <Typography variant="caption" sx={{ color: "#7A6069", fontFamily: "monospace", fontWeight: 600 }}>
                  {selectedSale.id.toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="caption" sx={{ color: "#C4A3AF" }}>
                  Date
                </Typography>
                <Typography variant="caption" sx={{ color: "#7A6069", fontWeight: 600 }}>
                  {formatDate(selectedSale.date)}
                </Typography>
              </Box>

              {/* Dashed divider */}
              <Box sx={{ borderBottom: "2px dashed #F5E1E5", mb: 2 }} />

              {/* Column Headers */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "#C4A3AF", fontWeight: 600, flex: 1 }}>
                  Item
                </Typography>
                <Typography variant="caption" sx={{ color: "#C4A3AF", fontWeight: 600, width: 40, textAlign: "center" }}>
                  Qty
                </Typography>
                <Typography variant="caption" sx={{ color: "#C4A3AF", fontWeight: 600, width: 70, textAlign: "right" }}>
                  Amount
                </Typography>
              </Box>

              {/* Items */}
              {selectedSale.items.map((item, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", py: 0.75 }}>
                    <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: "#2D1520", fontSize: "0.85rem" }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#C4A3AF" }}>
                        @ ${item.product.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#7A6069", width: 40, textAlign: "center", fontWeight: 600 }}
                    >
                      {item.quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{ color: "#2D1520", width: 70, textAlign: "right" }}
                    >
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  {idx < selectedSale.items.length - 1 && (
                    <Divider sx={{ borderStyle: "dotted", borderColor: "#FDF2F4" }} />
                  )}
                </Box>
              ))}

              {/* Dashed divider */}
              <Box sx={{ borderBottom: "2px dashed #F5E1E5", my: 2 }} />

              {/* Totals */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#7A6069" }}>
                  Subtotal
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: "#2D1520" }}>
                  ${selectedSale.total.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#7A6069" }}>
                  Tax
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: "#2D1520" }}>
                  $0.00
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1.5,
                  p: 1.5,
                  bgcolor: "#FDF2F8",
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#2D1520" }}>
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#B5436E" }}>
                  ${selectedSale.total.toFixed(2)}
                </Typography>
              </Box>

              {/* Footer */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Box sx={{ borderBottom: "2px dashed #F5E1E5", mb: 2 }} />
                <Typography variant="caption" sx={{ color: "#C4A3AF", display: "block" }}>
                  Items sold: {selectedSale.items.reduce((s, i) => s + i.quantity, 0)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#C4A3AF", display: "block", mt: 1, fontWeight: 500 }}
                >
                  Powered by Glow Beauty
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%", fontWeight: 600 }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}