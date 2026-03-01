// "use client"

// import { useState } from "react"
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Button,
//   Chip,
//   Badge,
//   Divider,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Slide,
// } from "@mui/material"
// import SearchIcon from "@mui/icons-material/Search"
// import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
// import RemoveIcon from "@mui/icons-material/Remove"
// import AddIcon from "@mui/icons-material/Add"
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
// import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout"
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
// import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart"
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale"
// import { useAppState } from "@/lib/store"

// interface POSViewProps {
//   onCheckout: () => void
// }

// export default function POSView({ onCheckout }: POSViewProps) {
//   const { state, dispatch } = useAppState()
//   const [search, setSearch] = useState("")
//   const [showCart, setShowCart] = useState(false)
//   const [filterCategory, setFilterCategory] = useState<string>("All")
//   const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
//     open: false,
//     message: "",
//     severity: "success",
//   })
//   const [checkoutConfirm, setCheckoutConfirm] = useState(false)

//   const allCategories = ["All", ...Array.from(new Set(state.products.map((p) => p.category)))]

//   const filteredProducts = state.products.filter((p) => {
//     const matchesSearch =
//       p.name.toLowerCase().includes(search.toLowerCase()) ||
//       p.sku.toLowerCase().includes(search.toLowerCase())
//     const matchesCategory = filterCategory === "All" || p.category === filterCategory
//     return matchesSearch && matchesCategory && p.stock > 0
//   })

//   const cartTotal = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
//   const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)

//   function addToCart(productId: string) {
//     const product = state.products.find((p) => p.id === productId)
//     if (!product) return

//     const cartItem = state.cart.find((item) => item.product.id === productId)
//     const currentQty = cartItem ? cartItem.quantity : 0
//     if (currentQty >= product.stock) {
//       setSnackbar({ open: true, message: "Cannot exceed available stock", severity: "error" })
//       return
//     }

//     dispatch({ type: "ADD_TO_CART", payload: { productId, quantity: 1 } })
//     setSnackbar({ open: true, message: `${product.name} added to cart`, severity: "success" })
//   }

//   function handleCheckout() {
//     if (state.cart.length === 0) return
//     dispatch({ type: "COMPLETE_SALE" })
//     setCheckoutConfirm(false)
//     setShowCart(false)
//     setSnackbar({ open: true, message: "Sale completed! Receipt generated.", severity: "success" })
//     onCheckout()
//   }

//   function getCartQty(productId: string): number {
//     const item = state.cart.find((i) => i.product.id === productId)
//     return item ? item.quantity : 0
//   }

//   return (
//     <Box sx={{ pb: 2 }}>
//       {/* Cart Summary Bar */}
//       {state.cart.length > 0 && !showCart && (
//         <Box
//           onClick={() => setShowCart(true)}
//           sx={{
//             bgcolor: "#2563EB",
//             color: "white",
//             borderRadius: 3,
//             p: 2,
//             mb: 2,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             cursor: "pointer",
//             transition: "all 0.2s",
//             "&:active": { transform: "scale(0.98)" },
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//             <Badge badgeContent={cartItemCount} color="error" sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}>
//               <ShoppingCartIcon />
//             </Badge>
//             <Typography variant="body2" fontWeight={600}>
//               {state.cart.length} {state.cart.length === 1 ? "item" : "items"} in cart
//             </Typography>
//           </Box>
//           <Typography variant="subtitle1" fontWeight={800}>
//             ${cartTotal.toFixed(2)}
//           </Typography>
//         </Box>
//       )}

//       {/* Search */}
//       <TextField
//         fullWidth
//         size="small"
//         placeholder="Search beauty products..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         sx={{ mb: 1.5 }}
//         slotProps={{
//           input: {
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ color: "#C4A3AF", fontSize: 20 }} />
//               </InputAdornment>
//             ),
//           },
//         }}
//       />

//       {/* Category filters */}
//       <Box sx={{ display: "flex", gap: 0.75, mb: 2.5, overflowX: "auto", pb: 0.5 }}>
//         {allCategories.map((cat) => (
//           <Chip
//             key={cat}
//             label={cat}
//             size="small"
//             onClick={() => setFilterCategory(cat)}
//             variant={filterCategory === cat ? "filled" : "outlined"}
//             color={filterCategory === cat ? "primary" : "default"}
//             sx={{
//               fontSize: "0.75rem",
//               height: 30,
//               ...(filterCategory !== cat && { borderColor: "#F5E1E5", color: "#7A6069" }),
//             }}
//           />
//         ))}
//       </Box>

//       {/* Product Grid for POS */}
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
//         {filteredProducts.length === 0 ? (
//           <Box sx={{ textAlign: "center", py: 6 }}>
//             <PointOfSaleIcon sx={{ fontSize: 48, color: "#F5E1E5", mb: 1 }} />
//             <Typography color="text.secondary">No products available</Typography>
//           </Box>
//         ) : (
//           filteredProducts.map((product) => {
//             const inCartQty = getCartQty(product.id)
//             const remainingStock = product.stock - inCartQty

//             return (
//               <Card
//                 key={product.id}
//                 sx={{
//                   transition: "all 0.2s",
//                   ...(inCartQty > 0 && {
//                     borderColor: "#B5436E",
//                     borderWidth: 2,
//                     bgcolor: "#FDF2F8",
//                   }),
//                 }}
//               >
//                 <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
//                   <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                     <Box sx={{ flex: 1, minWidth: 0 }}>
//                       <Typography variant="subtitle2" fontWeight={700} noWrap>
//                         {product.name}
//                       </Typography>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
//                         <Typography variant="body1" fontWeight={800} color="primary">
//                           ${product.price.toFixed(2)}
//                         </Typography>
//                         <Chip
//                           label={`${remainingStock} left`}
//                           size="small"
//                           color={remainingStock < 10 ? "warning" : "default"}
//                           sx={{ fontSize: "0.65rem", height: 22, fontWeight: 600 }}
//                         />
//                         {inCartQty > 0 && (
//                           <Chip
//                             label={`${inCartQty} in cart`}
//                             size="small"
//                             color="primary"
//                             sx={{ fontSize: "0.65rem", height: 22, fontWeight: 600 }}
//                           />
//                         )}
//                       </Box>
//                     </Box>

//                     {inCartQty > 0 ? (
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                         <IconButton
//                           size="small"
//                           onClick={() =>
//                             dispatch({
//                               type: "UPDATE_CART_QUANTITY",
//                               payload: { productId: product.id, quantity: inCartQty - 1 },
//                             })
//                           }
//                           sx={{ bgcolor: "#FCE4EC", color: "#C93545", width: 32, height: 32 }}
//                         >
//                           <RemoveIcon sx={{ fontSize: 18 }} />
//                         </IconButton>
//                         <Typography variant="body2" fontWeight={800} sx={{ minWidth: 24, textAlign: "center" }}>
//                           {inCartQty}
//                         </Typography>
//                         <IconButton
//                           size="small"
//                           disabled={remainingStock <= 0}
//                           onClick={() => addToCart(product.id)}
//                           sx={{
//                             bgcolor: "#FADADD",
//                             color: "#B5436E",
//                             width: 32,
//                             height: 32,
//                             "&.Mui-disabled": { bgcolor: "#FDF2F4", color: "#D4A3B5" },
//                           }}
//                         >
//                           <AddIcon sx={{ fontSize: 18 }} />
//                         </IconButton>
//                       </Box>
//                     ) : (
//                       <IconButton
//                         onClick={() => addToCart(product.id)}
//                         sx={{
//                           bgcolor: "#B5436E",
//                           color: "white",
//                           width: 40,
//                           height: 40,
//                           "&:hover": { bgcolor: "#8C2A52" },
//                         }}
//                       >
//                         <AddShoppingCartIcon sx={{ fontSize: 20 }} />
//                       </IconButton>
//                     )}
//                   </Box>
//                 </CardContent>
//               </Card>
//             )
//           })
//         )}
//       </Box>

//       {/* Cart Sheet / Dialog */}
//       <Dialog
//         open={showCart}
//         onClose={() => setShowCart(false)}
//         fullWidth
//         TransitionComponent={Slide}
//         slotProps={{
//           transition: {
//             direction: "up" as const,
//           } as Record<string, unknown>,
//         }}
//         sx={{
//           "& .MuiDialog-paper": {
//             position: "fixed",
//             bottom: 0,
//             m: 0,
//             borderRadius: "16px 16px 0 0",
//             maxHeight: "80vh",
//             width: "100%",
//             maxWidth: "100%",
//           },
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <ShoppingCartIcon sx={{ color: "#B5436E" }} />
//             Cart ({state.cart.length})
//           </Box>
//           {state.cart.length > 0 && (
//             <Button
//               size="small"
//               color="error"
//               startIcon={<RemoveShoppingCartIcon />}
//               onClick={() => {
//                 dispatch({ type: "CLEAR_CART" })
//                 setShowCart(false)
//               }}
//               sx={{ fontSize: "0.75rem" }}
//             >
//               Clear
//             </Button>
//           )}
//         </DialogTitle>
//         <Divider />
//         <DialogContent sx={{ p: 2 }}>
//           {state.cart.length === 0 ? (
//             <Box sx={{ textAlign: "center", py: 4 }}>
//               <RemoveShoppingCartIcon sx={{ fontSize: 48, color: "#F5E1E5", mb: 1 }} />
//               <Typography color="text.secondary">Cart is empty</Typography>
//             </Box>
//           ) : (
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
//               {state.cart.map((item) => (
//                 <Box
//                   key={item.product.id}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     p: 1.5,
//                     bgcolor: "#FDF8F9",
//                     borderRadius: 2,
//                   }}
//                 >
//                   <Box sx={{ flex: 1, minWidth: 0 }}>
//                     <Typography variant="body2" fontWeight={700} noWrap>
//                       {item.product.name}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       ${item.product.price.toFixed(2)} x {item.quantity}
//                     </Typography>
//                   </Box>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <Typography variant="body2" fontWeight={800} sx={{ minWidth: 60, textAlign: "right" }}>
//                       ${(item.product.price * item.quantity).toFixed(2)}
//                     </Typography>
//                     <IconButton
//                       size="small"
//                       onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.product.id })}
//                       sx={{ color: "#C93545" }}
//                     >
//                       <DeleteOutlineIcon sx={{ fontSize: 18 }} />
//                     </IconButton>
//                   </Box>
//                 </Box>
//               ))}

//               <Divider sx={{ my: 1 }} />

//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 0.5 }}>
//                 <Typography variant="body1" fontWeight={600} color="text.secondary">
//                   Subtotal
//                 </Typography>
//                 <Typography variant="body1" fontWeight={600}>
//                   ${cartTotal.toFixed(2)}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 0.5 }}>
//                 <Typography variant="h6" fontWeight={800}>
//                   Total
//                 </Typography>
//                 <Typography variant="h6" fontWeight={800} color="primary">
//                   ${cartTotal.toFixed(2)}
//                 </Typography>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//         {state.cart.length > 0 && (
//           <DialogActions sx={{ px: 2, pb: 3 }}>
//             <Button
//               variant="contained"
//               fullWidth
//               size="large"
//               startIcon={<ShoppingCartCheckoutIcon />}
//               onClick={() => setCheckoutConfirm(true)}
//               sx={{
//                 py: 1.5,
//                 fontWeight: 700,
//                 fontSize: "1rem",
//                 background: "linear-gradient(135deg, #2D8B6F 0%, #1E6B53 100%)",
//                 "&:hover": { background: "linear-gradient(135deg, #1E6B53 0%, #165A44 100%)" },
//               }}
//             >
//               Checkout - ${cartTotal.toFixed(2)}
//             </Button>
//           </DialogActions>
//         )}
//       </Dialog>

//       {/* Checkout Confirmation */}
//       <Dialog open={checkoutConfirm} onClose={() => setCheckoutConfirm(false)}>
//         <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Complete Sale?</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" color="text.secondary">
//             This will finalize the sale for ${cartTotal.toFixed(2)} ({cartItemCount} items) and deduct stock from inventory.
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
//           <Button onClick={() => setCheckoutConfirm(false)} sx={{ color: "#7A6069" }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             color="success"
//             onClick={handleCheckout}
//           >
//             Confirm Sale
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={1500}
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

import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Badge,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  CircularProgress,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import RemoveIcon from "@mui/icons-material/Remove"
import AddIcon from "@mui/icons-material/Add"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart"
import PointOfSaleIcon from "@mui/icons-material/PointOfSale"
import { useAppState } from "@/lib/store"

interface POSViewProps {
  onCheckout: () => void
}

export default function POSView({ onCheckout }: POSViewProps) {
  const { state, dispatch, completeSale } = useAppState()
  const [search, setSearch] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "success",
  })
  const [checkoutConfirm, setCheckoutConfirm] = useState(false)

  const allCategories = ["All", ...Array.from(new Set(state.products.map((p) => p.category)))]

  const filteredProducts = state.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === "All" || p.category === filterCategory
    return matchesSearch && matchesCategory && p.stock > 0
  })

  const cartTotal = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(productId: string) {
    const product = state.products.find((p) => p.id === productId)
    if (!product) return

    const cartItem = state.cart.find((item) => item.product.id === productId)
    const currentQty = cartItem ? cartItem.quantity : 0
    if (currentQty >= product.stock) {
      setSnackbar({ open: true, message: "Cannot exceed available stock", severity: "error" })
      return
    }

    dispatch({ type: "ADD_TO_CART", payload: { productId, quantity: 1 } })
    setSnackbar({ open: true, message: `${product.name} added to cart`, severity: "success" })
  }

  async function handleCheckout() {
    if (state.cart.length === 0) return

    setIsSubmitting(true)
    try {
      const saleData = {
        items: [...state.cart],
        total: cartTotal,
        date: new Date().toISOString(),
      }
      
      await completeSale(saleData)
      setCheckoutConfirm(false)
      setShowCart(false)
      setSnackbar({ open: true, message: "Sale completed! Receipt generated.", severity: "success" })
      onCheckout()
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : "Failed to complete sale", 
        severity: "error" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function getCartQty(productId: string): number {
    const item = state.cart.find((i) => i.product.id === productId)
    return item ? item.quantity : 0
  }

  if (state.isLoading && state.products.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 2 }}>
      {/* Cart Summary Bar */}
      {state.cart.length > 0 && !showCart && (
        <Box
          onClick={() => setShowCart(true)}
          sx={{
            bgcolor: "#2563EB",
            color: "white",
            borderRadius: 3,
            p: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Badge badgeContent={cartItemCount} color="error" sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}>
              <ShoppingCartIcon />
            </Badge>
            <Typography variant="body2" fontWeight={600}>
              {state.cart.length} {state.cart.length === 1 ? "item" : "items"} in cart
            </Typography>
          </Box>
          <Typography variant="subtitle1" fontWeight={800}>
            ${cartTotal.toFixed(2)}
          </Typography>
        </Box>
      )}

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search beauty products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1.5 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#C4A3AF", fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Category filters */}
      <Box sx={{ display: "flex", gap: 0.75, mb: 2.5, overflowX: "auto", pb: 0.5 }}>
        {allCategories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            size="small"
            onClick={() => setFilterCategory(cat)}
            variant={filterCategory === cat ? "filled" : "outlined"}
            color={filterCategory === cat ? "primary" : "default"}
            sx={{
              fontSize: "0.75rem",
              height: 30,
              ...(filterCategory !== cat && { borderColor: "#F5E1E5", color: "#7A6069" }),
            }}
          />
        ))}
      </Box>

      {/* Product Grid for POS */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <PointOfSaleIcon sx={{ fontSize: 48, color: "#F5E1E5", mb: 1 }} />
            <Typography color="text.secondary">No products available</Typography>
          </Box>
        ) : (
          filteredProducts.map((product) => {
            const inCartQty = getCartQty(product.id)
            const remainingStock = product.stock - inCartQty

            return (
              <Card
                key={product.id}
                sx={{
                  transition: "all 0.2s",
                  ...(inCartQty > 0 && {
                    borderColor: "#B5436E",
                    borderWidth: 2,
                    bgcolor: "#FDF2F8",
                  }),
                }}
              >
                <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {product.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Typography variant="body1" fontWeight={800} color="primary">
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Chip
                          label={`${remainingStock} left`}
                          size="small"
                          color={remainingStock < 10 ? "warning" : "default"}
                          sx={{ fontSize: "0.65rem", height: 22, fontWeight: 600 }}
                        />
                        {inCartQty > 0 && (
                          <Chip
                            label={`${inCartQty} in cart`}
                            size="small"
                            color="primary"
                            sx={{ fontSize: "0.65rem", height: 22, fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    </Box>

                    {inCartQty > 0 ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_CART_QUANTITY",
                              payload: { productId: product.id, quantity: inCartQty - 1 },
                            })
                          }
                          sx={{ bgcolor: "#FCE4EC", color: "#C93545", width: 32, height: 32 }}
                        >
                          <RemoveIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <Typography variant="body2" fontWeight={800} sx={{ minWidth: 24, textAlign: "center" }}>
                          {inCartQty}
                        </Typography>
                        <IconButton
                          size="small"
                          disabled={remainingStock <= 0}
                          onClick={() => addToCart(product.id)}
                          sx={{
                            bgcolor: "#FADADD",
                            color: "#B5436E",
                            width: 32,
                            height: 32,
                            "&.Mui-disabled": { bgcolor: "#FDF2F4", color: "#D4A3B5" },
                          }}
                        >
                          <AddIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton
                        onClick={() => addToCart(product.id)}
                        sx={{
                          bgcolor: "#B5436E",
                          color: "white",
                          width: 40,
                          height: 40,
                          "&:hover": { bgcolor: "#8C2A52" },
                        }}
                      >
                        <AddShoppingCartIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            )
          })
        )}
      </Box>

      {/* Cart Sheet / Dialog */}
      <Dialog
        open={showCart}
        onClose={() => !isSubmitting && setShowCart(false)}
        fullWidth
        TransitionComponent={Slide}
        slotProps={{
          transition: {
            direction: "up" as const,
          } as Record<string, unknown>,
        }}
        sx={{
          "& .MuiDialog-paper": {
            position: "fixed",
            bottom: 0,
            m: 0,
            borderRadius: "16px 16px 0 0",
            maxHeight: "80vh",
            width: "100%",
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingCartIcon sx={{ color: "#B5436E" }} />
            Cart ({state.cart.length})
          </Box>
          {state.cart.length > 0 && (
            <Button
              size="small"
              color="error"
              startIcon={<RemoveShoppingCartIcon />}
              onClick={() => {
                dispatch({ type: "CLEAR_CART" })
                setShowCart(false)
              }}
              disabled={isSubmitting}
              sx={{ fontSize: "0.75rem" }}
            >
              Clear
            </Button>
          )}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2 }}>
          {state.cart.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <RemoveShoppingCartIcon sx={{ fontSize: 48, color: "#F5E1E5", mb: 1 }} />
              <Typography color="text.secondary">Cart is empty</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {state.cart.map((item) => (
                <Box
                  key={item.product.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    bgcolor: "#FDF8F9",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {item.product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${item.product.price.toFixed(2)} x {item.quantity}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={800} sx={{ minWidth: 60, textAlign: "right" }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.product.id })}
                      disabled={isSubmitting}
                      sx={{ color: "#C93545" }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 0.5 }}>
                <Typography variant="body1" fontWeight={600} color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  ${cartTotal.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 0.5 }}>
                <Typography variant="h6" fontWeight={800}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={800} color="primary">
                  ${cartTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        {state.cart.length > 0 && (
          <DialogActions sx={{ px: 2, pb: 3 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartCheckoutIcon />}
              onClick={() => setCheckoutConfirm(true)}
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                background: "linear-gradient(135deg, #2D8B6F 0%, #1E6B53 100%)",
                "&:hover": { background: "linear-gradient(135deg, #1E6B53 0%, #165A44 100%)" },
              }}
            >
              {isSubmitting ? "Processing..." : `Checkout - $${cartTotal.toFixed(2)}`}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Checkout Confirmation */}
      <Dialog open={checkoutConfirm} onClose={() => !isSubmitting && setCheckoutConfirm(false)}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Complete Sale?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will finalize the sale for ${cartTotal.toFixed(2)} ({cartItemCount} items) and deduct stock from inventory.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setCheckoutConfirm(false)} disabled={isSubmitting} sx={{ color: "#7A6069" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleCheckout}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Confirm Sale"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
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