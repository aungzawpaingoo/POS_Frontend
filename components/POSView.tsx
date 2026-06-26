// "use client"

// import React, { useState, useEffect, useRef } from 'react'
// import {
//   Box,
//   Grid,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
//   ListItemText,
//   Divider,
//   Card,
//   CardContent,
//   CircularProgress,
//   InputAdornment,
//   Chip,
//   Alert
// } from '@mui/material'
// import {
//   Search as SearchIcon,
//   ShoppingCart as ShoppingCartIcon,
//   DeleteOutline as DeleteIcon,
//   Add as AddIcon,
//   Remove as RemoveIcon,
//   TrendingUp as TrendingUpIcon,
//   Warning as WarningIcon,
//   CategoryOutlined as CategoryIcon
// } from '@mui/icons-material'
// import { useAppState, Product } from '@/lib/store'

// interface POSViewProps {
//   onCheckout: (orderId: string, totalAmount: number) => void
// }

// export default function POSView({ onCheckout }: POSViewProps) {
//   const { state, dispatch, fetchInventory, checkoutCart } = useAppState()
//   const { products, cart, metrics, user, isLoading, error } = state

//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState('All')
//   const [processing, setProcessing] = useState(false)
//   const [localError, setLocalError] = useState<string | null>(null)

//   const cartSectionRef = useRef<HTMLDivElement>(null)
//   const userRole = user?.role === 'owner' ? 'owner' : 'employee'

//   useEffect(() => {
//     fetchInventory()
//   }, [])

//   const categories = ["All", ...Array.from(new Set(products.map(p => p.category?.trim() || "Unassigned"))).filter(Boolean)]

//   const handleUpdateQuantity = (product: Product, action: 'increment' | 'decrement') => {
//     // We default to 'main' unit as per the store update
//     const unit_sold = 'main' 
//     const existingCartItem = cart.find(item => item.product.id === product.id && item.unit_sold === unit_sold)
//     const currentQty = existingCartItem ? existingCartItem.quantity : 0

//     if (action === 'increment') {
//       if (product.stock > currentQty) {
//         dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, quantity: 1, unit_sold } })
//       } else {
//         alert('သတိပေးချက်: ရွေးချယ်ထားသောပစ္စည်းမှာ လက်ကျန်မရှိတော့ပါ။')
//       }
//     } else if (action === 'decrement') {
//       if (currentQty > 0) {
//         dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId: product.id, quantity: currentQty - 1, unit_sold } })
//       }
//     }
//   }

//   const handleResetCart = () => {
//     dispatch({ type: 'CLEAR_CART' })
//   }

//   const scrollToCheckoutRegister = () => {
//     if (cartSectionRef.current) {
//       cartSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     }
//   }

//   const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
//   // const totalCartValue = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
//   const totalCartValue = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0)

//  const formatCurrency = (val: number) => 
//   Math.floor(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

//   const handlePaymentSubmit = async () => {
//     if (totalItemsCount === 0) return
//     setProcessing(true)
//     setLocalError(null)

//     try {
//       const response = await checkoutCart()
//       if (response && response.status === 'success') {
//         onCheckout(response.orderId, totalCartValue)
//       }
//     } catch (err: any) {
//       setLocalError(err.message || 'Failed to finish transaction sequence.')
//     } finally {
//       setProcessing(false)
//     }
//   }

//   const filteredProducts = products.filter(p => {
//     const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesCategory = selectedCategory === 'All' || (p.category?.trim() || 'Unassigned') === selectedCategory
//     return matchesSearch && matchesCategory
//   })

//   const getFullImageUrl = (imageUrl: string | null | undefined) => {
//     if (!imageUrl) return null
//     const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://pos.orbitdigitalsolution.com"
//     const cleanBackendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
//     const cleanImagePath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
//     return `${cleanBackendUrl}${cleanImagePath}`
//   }

//   if (isLoading && products.length === 0) {
//     return (
//       <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
//         <CircularProgress size={40} thickness={4} sx={{ color: '#2563EB' }} />
//         <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 600 }}>ဒေတာများ ရယူနေပါသည်...</Typography>
//       </Box>
//     )
//   }

//   return (
//     <Box sx={{ width: '100%', pb: 4 }}>
//       {(error || localError) && (
//         <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', fontWeight: 600 }}>
//           {localError || error}
//         </Alert>
//       )}

//       {/* Top Summary Banner */}
//       <Box sx={{ mb: 3 }}>
//         {userRole === 'employee' ? (
//           <Card 
//             onClick={scrollToCheckoutRegister}
//             sx={{ 
//               bgcolor: '#2D1520', 
//               color: '#ffffff', 
//               borderRadius: '12px', 
//               boxShadow: 'none', 
//               border: '1px solid #F5E1E5',
//               cursor: 'pointer',
//               transition: 'opacity 0.2s ease',
//               '&:active': { opacity: 0.85 }
//             }}
//           >
//             <CardContent sx={{ display: 'block', justifyContent: 'space-between', alignItems: 'center', p: '20px !important' }}>
//               <Box>
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <ShoppingCartIcon sx={{ color: 'white' }} />
//                   <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>လက်ရှိရွေးချယ်ထားသောပစ္စည်း</Typography>
//                 </Box>
//               </Box>

//               <Typography variant="h5" sx={{ fontWeight: 900, color: '#FDF8F9', letterSpacing: '-0.03em', mb: 2 }}>
//                 {/* {totalCartValue.toLocaleString()}.00 MMK */}
//                 {formatCurrency(totalCartValue)} MMK
//               </Typography>

//               <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, display: 'block', mt: 0.5 }}>
//                 {totalItemsCount} ပစ္စည်းစုစုပေါင်း (ကြည့်ရှုရန် နှိပ်ပါ)
//               </Typography>
//             </CardContent>
//           </Card>
//         ) : (
//           <Card sx={{ bgcolor: '#FFFFFF', borderRadius: '12px', boxShadow: 'none', border: '1px solid #F5E1E5' }}>
//             <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '20px !important' }}>
//               <Box>
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <TrendingUpIcon sx={{ color: '#2563EB' }} />
//                   <Typography variant="subtitle1" sx={{ fontWeight: 800 }} color="#2D1520">ယနေ့ဆိုင်တွင်း စုစုပေါင်းအရောင်းရရှိမှု</Typography>
//                 </Box>
//                 <Typography variant="caption" sx={{ color: '#7A6069', fontWeight: 600, display: 'block', mt: 0.5 }}>
//                   {metrics?.transactionsCount || 0} ကြိမ် ရောင်းချပြီး
//                 </Typography>
//               </Box>
//               <Typography variant="h4" sx={{ fontWeight: 900, color: '#2563EB', letterSpacing: '-0.03em' }}>
//                 {formatCurrency(metrics?.dailyRevenue || 0)} MMK
//               </Typography>
//             </CardContent>
//           </Card>
//         )}
//       </Box>

//       {/* Grid Layout Setup */}
//       <Grid container spacing={2.5}>

//         {/* Left Section: Catalog Core Engine */}
//         <Grid item xs={12} md={7} lg={8}>
//           <Box display="flex" alignItems="center" gap={1.5} mb={2}>
//             <TextField
//               fullWidth
//               size="medium"
//               placeholder={userRole === 'employee' ? "...ရှာဖွေရန်" : "ကုန်ပစ္စည်းလက်ကျန် အခြေအနေစစ်ဆေးရန်..."}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ color: '#C4A3AF', fontSize: 20 }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "#ffffff",
//                   borderRadius: "8px",
//                   "& fieldset": { borderColor: "#F5E1E5" },
//                   "&:hover fieldset": { borderColor: "#C4A3AF" },
//                   "&.Mui-focused fieldset": { borderColor: "#2563EB" }
//                 }
//               }}
//             />
//             {userRole === 'employee' && totalItemsCount > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 size="medium"
//                 onClick={handleResetCart}
//                 startIcon={<DeleteIcon />}
//                 sx={{
//                   whiteSpace: 'nowrap',
//                   borderRadius: '8px',
//                   borderColor: '#F5E1E5',
//                   color: '#7A6069',
//                   fontWeight: 700,
//                   textTransform: 'none',
//                   '&:hover': { borderColor: '#2563EB', color: '#2563EB', bgcolor: '#FDF8F9' }
//                 }}
//               >
//                 ပယ်ဖျက်ရန်
//               </Button>
//             )}
//           </Box>

//           {/* Scrolling Categories Strip */}
//           <Box sx={{ display: 'flex', gap: 1, mb: 2.5, overflowX: 'auto', pb: 0.5 }}>
//             {categories.map((category) => (
//               <Chip
//                 key={`filter-chip-${category}`}
//                 label={category}
//                 size="small"
//                 onClick={() => setSelectedCategory(category)}
//                 variant={selectedCategory === category ? "filled" : "outlined"}
//                 sx={{
//                   fontSize: "2 rem",
//                   height: 40,
//                   borderRadius: "6px",
//                   border: "1px solid #F5E1E5",
//                   fontWeight: 700,
//                   cursor: 'pointer',
//                   ...(selectedCategory === category ? {
//                     bgcolor: "#2563EB",
//                     color: "#ffffff",
//                     "&:hover": { bgcolor: "#2563EB" }
//                   } : {
//                     bgcolor: "#ffffff",
//                     color: "#7A6069",
//                     "&:hover": { borderColor: '#C4A3AF' }
//                   })
//                 }}
//               />
//             ))}
//           </Box>

//           {/* Product Cards Grid Layout */}
//           <Grid container spacing={1.5}>
//             {filteredProducts.map((product) => {
//               const existingCartItem = cart.find(item => item.product.id === product.id && item.unit_sold === 'main')
//               const currentCartQty = existingCartItem ? existingCartItem.quantity : 0
//               const imgUrl = getFullImageUrl(product.image_url)
//               const isLowStock = product.stock <= 10

//               return (
//                 <Grid item xs={6} sm={4} key={product.id}>
//                   <Card sx={{ border: '1px solid #F5E1E5', borderRadius: '8px', boxShadow: 'none', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column', height: '100%' }}>

//                     <Box sx={{ position: 'relative', width: '100%', pt: '100%', bgcolor: '#FDF8F9', borderBottom: '1px solid #F5E1E5', overflow: 'hidden' }}>
//                       {imgUrl ? (
//                         <img
//                           src={imgUrl}
//                           alt={product.name}
//                           style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
//                         />
//                       ) : (
//                         <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                           <CategoryIcon sx={{ color: '#C4A3AF', fontSize: 28 }} />
//                         </Box>
//                       )}
//                     </Box>

//                     <CardContent sx={{ p: '12px !important', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                       <Box>
//                         <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, color: '#2D1520', fontSize: '0.85rem' }}>
//                           {product.name}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: '#C4A3AF', display: 'block', fontWeight: 600, mt: 0.25 }}>
//                           SKU: {product.sku}
//                         </Typography>
//                       </Box>

//                       <Box sx={{ mt: 1.5 }}>
//                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
//                           <Typography variant="body2" sx={{ fontWeight: 900, color: '#2563EB', fontSize: '0.8rem' }}>
//                             {formatCurrency(product.price)} MMK
//                           </Typography>
//                           <Typography variant="caption" sx={{ fontWeight: 600, color: isLowStock ? '#2563EB' : '#7A6069', fontSize: '0.72rem', display: 'block' }}>
//                             Avail: {Math.floor(product.stock)}
//                           </Typography>
//                         </Box>

//                         {userRole === 'employee' ? (
//                           currentCartQty > 0 ? (
//                             <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ border: '2px solid #2D1520', borderRadius: '8px', bgcolor: '#ffffff', p: '2px 4px' }}>
//                               <IconButton size="large" onClick={() => handleUpdateQuantity(product, 'decrement')} sx={{ color: '#2D1520', p: 1, '&:hover': { bgcolor: '#FDF8F9' } }}>
//                                 <RemoveIcon sx={{ fontSize: 22, fontWeight: 900 }} />
//                               </IconButton>
//                               <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: '#2D1520', px: 1.5 }}>
//                                 {currentCartQty}
//                               </Typography>
//                               <IconButton size="large" onClick={() => handleUpdateQuantity(product, 'increment')} sx={{ color: '#2D1520', p: 1, '&:hover': { bgcolor: '#FDF8F9' } }}>
//                                 <AddIcon sx={{ fontSize: 22, fontWeight: 900 }} />
//                               </IconButton>
//                             </Box>
//                           ) : (
//                             <Button
//                               fullWidth
//                               variant="contained"
//                               size="large"
//                               disabled={product.stock <= 0}
//                               onClick={() => handleUpdateQuantity(product, 'increment')}
//                               sx={{ bgcolor: '#2D1520', boxShadow: 'none', borderRadius: '8px', fontWeight: 800, textTransform: 'none', fontSize: '0.9rem', py: 1.2, '&:hover': { bgcolor: '#422030' } }}
//                             >
//                               {product.stock <= 0 ? 'Out of Stock' : 'ရွေးချယ်ရန်'}
//                             </Button>
//                           )
//                         ) : (
//                           <Chip 
//                             icon={isLowStock ? <WarningIcon sx={{ fontSize: '12px !important' }} /> : undefined} 
//                             label={isLowStock ? "ပစ္စည်းလိုနေပါသည်" : "အဆင်ပြေပါသည်"} 
//                             size="small"
//                             variant="filled"
//                             color={isLowStock ? "error" : "success"}
//                             sx={{ width: '100%', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
//                           />
//                         )}
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               )
//             })}
//           </Grid>
//         </Grid>

//         {/* Right Section: Interactive Review Register Sidebar Panel */}
//         <Grid item xs={12} md={5} lg={4} ref={cartSectionRef} sx={{ scrollMarginTop: '16px' }}>
//           <Card sx={{ border: '1px solid #F5E1E5', borderRadius: '12px', boxShadow: 'none', bgcolor: '#ffffff', position: { md: 'sticky' }, top: '76px', display: 'flex', flexDirection: 'column', maxHeight: { md: 'calc(100vh - 110px)' } }}>
//             <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5E1E5', bgcolor: '#FDF8F9' }}>
//               <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1520' }}>
//                 ပြန်လည်စစ်ဆေးရန်
//               </Typography>
//               {userRole === 'employee' && totalItemsCount > 0 && (
//                 <IconButton onClick={handleResetCart} color="error" size="small" sx={{ p: 0.5 }}>
//                   <DeleteIcon fontSize="small" />
//                 </IconButton>
//               )}
//             </Box>

//             <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1.5, minHeight: '220px', display: 'flex', flexDirection: 'column', gap: 1 }}>
//               {cart.map((item) => (
//                 <Box key={`sidebar-item-${item.product.id}-${item.unit_sold}`}>
//                   <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ py: 1.5 }}>
//                     <ListItemText 
//                       primary={item.product.name} 
//                       // secondary={`${(item.product.price * item.quantity).toLocaleString()} MMK`}
//                       secondary={`${formatCurrency(item.product.price * item.quantity)} MMK`}
//                       primaryTypographyProps={{ variant: 'body2', fontWeight: 700, color: '#2D1520', noWrap: true, sx: { maxWidth: '140px' } }}
//                       secondaryTypographyProps={{ variant: 'caption', fontWeight: 700, color: '#2563EB', mt: 0.25 }}
//                     />

//                     <Box display="flex" alignItems="center" gap={0.5} sx={{ border: '1.5px solid #2D1520', borderRadius: '6px', bgcolor: '#ffffff', p: '2px 4px' }}>
//                       <IconButton size="small" onClick={() => handleUpdateQuantity(item.product, 'decrement')} sx={{ p: 0.75, color: '#2D1520' }}>
//                         <RemoveIcon sx={{ fontSize: 18, fontWeight: 900 }} />
//                       </IconButton>
//                       <Typography sx={{ fontSize: '1.05rem', fontWeight: 900, color: '#2D1520', minWidth: '24px', textAlign: 'center' }}>
//                         {item.quantity}
//                       </Typography>
//                       <IconButton size="small" onClick={() => handleUpdateQuantity(item.product, 'increment')} sx={{ p: 0.75, color: '#2D1520' }}>
//                         <AddIcon sx={{ fontSize: 18, fontWeight: 900 }} />
//                       </IconButton>
//                     </Box>
//                   </Box>
//                   <Divider sx={{ borderColor: '#F5E1E5', opacity: 0.6 }} />
//                 </Box>
//               ))}
//               {totalItemsCount === 0 && (
//                 <Box sx={{ py: 6, my: 'auto', textAlign: 'center' }}>
//                   <ShoppingCartIcon sx={{ fontSize: 36, color: '#F5E1E5', mb: 1 }} />
//                   <Typography variant="body1" sx={{ color: '#C4A3AF', fontWeight: 600, display: 'block' }}>ခြင်းတောင်းထဲတွင် ပစ္စည်းမရှိပါ။</Typography>
//                 </Box>
//               )}
//             </Box>

//             <Box sx={{ p: 2, bgcolor: '#FDF8F9', borderTop: '1px solid #F5E1E5' }}>
//               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1520' }}>စုစုပေါင်းကျသင့်ငွေ</Typography>
//                 <Typography variant="body1" sx={{ fontWeight: 900, color: '#2563EB' }}>
//                   {/* {totalCartValue.toLocaleString()} MMK */}
//                   {formatCurrency(totalCartValue)} MMK
//                 </Typography>
//               </Box>

//               <Button
//                 fullWidth
//                 variant="contained"
//                 size="large"
//                 disabled={totalItemsCount === 0 || processing || userRole !== 'employee'}
//                 onClick={handlePaymentSubmit}
//                 startIcon={processing ? <CircularProgress size={18} color="inherit" /> : null}
//                 sx={{
//                   bgcolor: '#2563EB',
//                   color: '#ffffff',
//                   boxShadow: 'none',
//                   py: 1.2,
//                   borderRadius: '8px',
//                   fontWeight: 700,
//                   fontSize: '0.9rem',
//                   textTransform: 'none',
//                   '&:hover': { bgcolor: '#2563EB' },
//                   '&.Mui-disabled': { bgcolor: '#F5E1E5', color: '#C4A3AF' }
//                 }}
//               >
//                 {processing ? 'လုပ်ဆောင်နေပါသည်...' : 'ငွေချေရန်'}
//               </Button>
//             </Box>
//           </Card>
//         </Grid>

//       </Grid>
//     </Box>
//   )
// }












"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Chip,
  Alert
} from '@mui/material'
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  DeleteOutline as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CategoryOutlined as CategoryIcon
} from '@mui/icons-material'
import { useAppState, Product } from '@/lib/store'

interface POSViewProps {
  onCheckout: (orderId: string, totalAmount: number) => void
}

interface DiscountInputProps {
  productId: string
  initialValue: number | undefined
  discountType: 'percent' | 'flat'
  onApply: (productId: string, value: number, type: 'percent' | 'flat' | 'clear') => void
}

// Optimized local input component to eliminate keystroke propagation lag
function DiscountInput({ productId, initialValue, discountType, onApply }: DiscountInputProps) {
  const [localVal, setLocalVal] = useState<string>('')

  // Sync state only when initial value changes externally
  useEffect(() => {
    setLocalVal(initialValue !== undefined && initialValue !== 0 ? String(initialValue) : '')
  }, [initialValue])

  const handleCommit = () => {
    const inputVal = localVal === '' ? 0 : Number(localVal)
    if (isNaN(inputVal)) return
    if (inputVal === 0) {
      onApply(productId, 0, 'clear')
    } else {
      onApply(productId, inputVal, discountType)
    }
  }

  return (
    <TextField
      variant="standard"
      type="number"
      size="medium"
      placeholder={discountType === 'percent' ? "လျော့မည့် %" : "လျော့မည့် ကျပ်"}
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={handleCommit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          handleCommit()
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {/* <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#7A6069' }}>
              {discountType === 'percent' ? '%' : 'Ks'}
            </Typography> */}
          </InputAdornment>
        ),
        style: { fontSize: '15px', fontWeight: 700, color: '#2563EB' }
      }}
      sx={{ 
        width: '95px',
        "& .MuiInput-underline:before": { borderBottomColor: '#F5E1E5' },
        "& .MuiInput-underline:after": { borderBottomColor: '#2563EB' }
      }}
    />
  )
}

export default function POSView({ onCheckout }: POSViewProps) {
  //const { state, dispatch, fetchInventory, checkoutCart } = useAppState()
  const { state, dispatch, fetchInventory, checkoutCart, applyDiscountToCartItem } = useAppState()
  const { products, cart, metrics, user, isLoading, error } = state

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [processing, setProcessing] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const [cartMetadata, setCartMetadata] = useState<Record<string, { discountType?: 'percent' | 'flat'; discountValue?: number; customPrice?: number }>>({})

  const cartSectionRef = useRef<HTMLDivElement>(null)
  const userRole = user?.role === 'owner' ? 'owner' : 'employee'

  useEffect(() => {
    fetchInventory()
  }, [])

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map(p => p.category?.trim() || "Unassigned"))).filter(Boolean)]
  }, [products])

  const handleUpdateQuantity = (product: Product, action: 'increment' | 'decrement') => {
    const unit_sold = 'main' 
    const existingCartItem = cart.find(item => item.product.id === product.id && item.unit_sold === unit_sold)
    const currentQty = existingCartItem ? existingCartItem.quantity : 0

    if (action === 'increment') {
      if (product.stock > currentQty) {
        dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, quantity: 1, unit_sold } })
      } else {
        alert('သတိပေးချက်: ရွေးချယ်ထားသောပစ္စည်းမှာ လက်ကျန်မရှိတော့ပါ။')
      }
    } else if (action === 'decrement') {
      if (currentQty > 0) {
        dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId: product.id, quantity: currentQty - 1, unit_sold } })
      }
    }
  }

  const handleApplyDiscount = (productId: string, value: number, type: 'percent' | 'flat' | 'clear') => {
    const targetItem = cart.find(item => item.product.id === productId && item.unit_sold === 'main')
    if (!targetItem) return

    setCartMetadata(prev => {
      const updated = { ...prev }
      
      if (type === 'clear' || value <= 0) {
        delete updated[productId]
      } else {
        const basePrice = Number(targetItem.product.price)
        let finalPrice = basePrice

        if (type === 'percent') {
          finalPrice = basePrice - (basePrice * (value / 100))
        } else if (type === 'flat') {
          finalPrice = basePrice - value
        }

        updated[productId] = {
          discountType: type,
          discountValue: value,
          customPrice: Math.max(0, Math.floor(finalPrice))
        }
      }
      return updated
    })

    applyDiscountToCartItem(productId, value, type)
    
  }

  const handleResetCart = () => {
    setCartMetadata({})
    dispatch({ type: 'CLEAR_CART' })
  }

  const scrollToCheckoutRegister = () => {
    if (cartSectionRef.current) {
      cartSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const totalItemsCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  
  const totalCartValue = useMemo(() => {
    return cart.reduce((sum, item) => {
      const meta = cartMetadata[item.product.id]
      const activePrice = meta?.customPrice !== undefined ? meta.customPrice : Number(item.product.price)
      return sum + (activePrice * item.quantity)
    }, 0)
  }, [cart, cartMetadata])

  const formatCurrency = (val: number) => 
    Math.floor(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const handlePaymentSubmit = async () => {
    if (totalItemsCount === 0) return
    setProcessing(true)
    setLocalError(null)

    try {
      const response = await checkoutCart()
      if (response && response.status === 'success') {
        onCheckout(response.orderId, totalCartValue)
        setCartMetadata({})
      }
    } catch (err: any) {
      setLocalError(err.message || 'Failed to finish transaction sequence.')
    } finally {
      setProcessing(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || (p.category?.trim() || 'Unassigned') === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  const getFullImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return null
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://pos.orbitdigitalsolution.com"
    const cleanBackendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
    const cleanImagePath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
    return `${cleanBackendUrl}${cleanImagePath}`
  }

  if (isLoading && products.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
        <CircularProgress size={40} thickness={4} sx={{ color: '#2563EB' }} />
        <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 600 }}>ဒေတာများ ရယူနေပါသည်...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {(error || localError) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', fontWeight: 600 }}>
          {localError || error}
        </Alert>
      )}

      {/* Top Summary Banner */}
      <Box sx={{ mb: 3 }}>
        {userRole === 'employee' ? (
          <Card 
            onClick={scrollToCheckoutRegister}
            sx={{ 
              bgcolor: '#2D1520', 
              color: '#ffffff', 
              borderRadius: '12px', 
              boxShadow: 'none', 
              border: '1px solid #F5E1E5',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              '&:active': { opacity: 0.85 }
            }}
          >
            <CardContent sx={{ display: 'block', p: '20px !important' }}>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <ShoppingCartIcon sx={{ color: 'white' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>လက်ရှိရွေးချယ်ထားသောပစ္စည်း</Typography>
                </Box>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 900, color: '#FDF8F9', letterSpacing: '-0.03em', mb: 2 }}>
                {formatCurrency(totalCartValue)} MMK
              </Typography>

              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, display: 'block', mt: 0.5 }}>
                {totalItemsCount} ပစ္စည်းစုစုပေါင်း (ကြည့်ရှုရန် နှိပ်ပါ)
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ bgcolor: '#FFFFFF', borderRadius: '12px', boxShadow: 'none', border: '1px solid #F5E1E5' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '20px !important' }}>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUpIcon sx={{ color: '#2563EB' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }} color="#2D1520">ယနေ့ဆိုင်တွင်း စစုပေါင်းအရောင်းရရှိမှု</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#7A6069', fontWeight: 600, display: 'block', mt: 0.5 }}>
                  {metrics?.transactionsCount || 0} ကြိမ် ရောင်းချပြီး
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#2563EB', letterSpacing: '-0.03em' }}>
                {formatCurrency(metrics?.dailyRevenue || 0)} MMK
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Grid Layout Setup */}
      <Grid container spacing={2.5}>
        
        {/* Left Section: Catalog Core Engine */}
        <Grid item xs={12} md={7} lg={8}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <TextField
              fullWidth
              size="medium"
              placeholder={userRole === 'employee' ? "...ရှာဖွေရန်" : "ကုန်ပစ္စည်းလက်ကျန် အခြေအနေစစ်ဆေးရန်..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#C4A3AF', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            {userRole === 'employee' && totalItemsCount > 0 && (
              <Button
                variant="outlined"
                color="error"
                size="medium"
                onClick={handleResetCart}
                startIcon={<DeleteIcon />}
                sx={{
                  whiteSpace: 'nowrap',
                  borderRadius: '8px',
                  borderColor: '#F5E1E5',
                  color: '#7A6069',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { borderColor: '#2563EB', color: '#2563EB', bgcolor: '#FDF8F9' }
                }}
              >
                ပယ်ဖျက်ရန်
              </Button>
            )}
          </Box>

          {/* Scrolling Categories Strip */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5, overflowX: 'auto', pb: 0.5 }}>
            {categories.map((category) => (
              <Chip
                key={`filter-chip-${category}`}
                label={category}
                size="small"
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "filled" : "outlined"}
                sx={{
                  fontSize: "0.85rem",
                  height: 40,
                  borderRadius: "6px",
                  border: "1px solid #F5E1E5",
                  fontWeight: 700,
                  cursor: 'pointer',
                  ...(selectedCategory === category ? {
                    bgcolor: "#2563EB",
                    color: "#ffffff",
                    "&:hover": { bgcolor: "#2563EB" }
                  } : {
                    bgcolor: "#ffffff",
                    color: "#7A6069",
                    "&:hover": { borderColor: '#C4A3AF' }
                  })
                }}
              />
            ))}
          </Box>

          {/* Product Cards Grid Layout */}
          <Grid container spacing={1.5}>
            {filteredProducts.map((product) => {
              const existingCartItem = cart.find(item => item.product.id === product.id && item.unit_sold === 'main')
              const currentCartQty = existingCartItem ? existingCartItem.quantity : 0
              const imgUrl = getFullImageUrl(product.image_url)
              const isLowStock = product.stock <= 10

              return (
                <Grid item xs={6} sm={4} key={product.id}>
                  <Card sx={{ border: '1px solid #F5E1E5', borderRadius: '8px', boxShadow: 'none', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    
                    <Box sx={{ position: 'relative', width: '100%', pt: '100%', bgcolor: '#FDF8F9', borderBottom: '1px solid #F5E1E5', overflow: 'hidden' }}>
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={product.name}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CategoryIcon sx={{ color: '#C4A3AF', fontSize: 28 }} />
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ p: '12px !important', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, color: '#2D1520', fontSize: '0.85rem' }}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#C4A3AF', display: 'block', fontWeight: 600, mt: 0.25 }}>
                          SKU: {product.sku}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 1.5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 900, color: '#2563EB', fontSize: '0.8rem' }}>
                            {formatCurrency(product.price)} MMK
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: isLowStock ? '#2563EB' : '#7A6069', fontSize: '0.72rem', display: 'block' }}>
                            Avail: {Math.floor(product.stock)}
                          </Typography>
                        </Box>

                        {userRole === 'employee' ? (
                          currentCartQty > 0 ? (
                            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ border: '2px solid #2D1520', borderRadius: '8px', bgcolor: '#ffffff', p: '2px 4px' }}>
                              <IconButton size="large" onClick={() => handleUpdateQuantity(product, 'decrement')} sx={{ color: '#2D1520', p: 1, '&:hover': { bgcolor: '#FDF8F9' } }}>
                                <RemoveIcon sx={{ fontSize: 22, fontWeight: 900 }} />
                              </IconButton>
                              <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: '#2D1520', px: 1.5 }}>
                                {currentCartQty}
                              </Typography>
                              <IconButton size="large" onClick={() => handleUpdateQuantity(product, 'increment')} sx={{ color: '#2D1520', p: 1, '&:hover': { bgcolor: '#FDF8F9' } }}>
                                <AddIcon sx={{ fontSize: 22, fontWeight: 900 }} />
                              </IconButton>
                            </Box>
                          ) : (
                            <Button
                              fullWidth
                              variant="contained"
                              size="large"
                              disabled={product.stock <= 0}
                              onClick={() => handleUpdateQuantity(product, 'increment')}
                              sx={{ bgcolor: '#2D1520', boxShadow: 'none', borderRadius: '8px', fontWeight: 800, textTransform: 'none', fontSize: '0.9rem', py: 1.2, '&:hover': { bgcolor: '#422030' } }}
                            >
                              {product.stock <= 0 ? 'Out of Stock' : 'ရွေးချယ်ရန်'}
                            </Button>
                          )
                        ) : (
                          <Chip 
                            icon={isLowStock ? <WarningIcon sx={{ fontSize: '12px !important' }} /> : undefined} 
                            label={isLowStock ? "ပစ္စည်းလိုနေပါသည်" : "အဆင်ပြေပါသည်"} 
                            size="small"
                            variant="filled"
                            color={isLowStock ? "error" : "success"}
                            sx={{ width: '100%', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Grid>

        {/* Right Section: Interactive Review Register Sidebar Panel */}
        <Grid item xs={12} md={5} lg={4} ref={cartSectionRef} sx={{ scrollMarginTop: '16px' }}>
          <Card sx={{ border: '1px solid #F5E1E5', borderRadius: '12px', boxShadow: 'none', bgcolor: '#ffffff', position: { md: 'sticky' }, top: '76px', display: 'flex', flexDirection: 'column', maxHeight: { md: 'calc(100vh - 110px)' } }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5E1E5', bgcolor: '#FDF8F9' }}>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1520' }}>
                ပြန်လည်စစ်ဆေးရန်
              </Typography>
              {userRole === 'employee' && totalItemsCount > 0 && (
                <IconButton onClick={handleResetCart} color="error" size="small" sx={{ p: 0.5 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Main Interactive Cart Row Map Panel Container */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1.5, minHeight: '220px', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {cart.map((item) => {
                const basePrice = Number(item.product.price)
                const meta = cartMetadata[item.product.id] || {}
                const itemActivePrice = meta.customPrice !== undefined ? meta.customPrice : basePrice
                const activeDiscountType = meta.discountType || 'percent'

                return (
                  <Box key={`sidebar-item-${item.product.id}-${item.unit_sold}`}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ py: 1.5 }}>
                      <Box sx={{ flexGrow: 1, mr: 1, maxWidth: '210px' }}>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1520' }}>
                          {item.product.name}
                        </Typography>
                        
                        <Typography variant="caption" sx={{ color: '#7A6069', fontWeight: 900, display: 'block', mt: 0.25, fontSize: '15px' }}>
                          မူရင်းဈေး: {formatCurrency(basePrice)} Ks
                        </Typography>

                        {/* Redesigned Premium Layout Segment for Discounts */}
                        <Box sx={{ mt: 1.5, p: 1, borderRadius: '8px', border: '1px dashed #F5E1E5', bgcolor: '#FAFAFA' }}>
                          <Box display="flex" gap={0.5} sx={{ mb: 1 }}>
                            {[5, 10].map((pct) => (
                              <Box
                                key={`pct-chip-${item.product.id}-${pct}`}
                                onClick={() => handleApplyDiscount(item.product.id, pct, 'percent')}
                                sx={{
                                  fontSize: '14px',
                                  fontWeight: 800,
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  border: '1px solid #F5E1E5',
                                  bgcolor: meta.discountType === 'percent' && meta.discountValue === pct ? '#2563EB' : '#ffffff',
                                  color: meta.discountType === 'percent' && meta.discountValue === pct ? '#ffffff' : '#7A6069',
                                  transition: 'all 0.1s ease',
                                  '&:hover': { borderColor: '#2563EB' }
                                }}
                              >
                                -{pct}%
                              </Box>
                            ))}
                            
                            {meta.customPrice !== undefined && (
                              <Box
                                onClick={() => handleApplyDiscount(item.product.id, 0, 'clear')}
                                sx={{
                                  fontSize: '14px',
                                  fontWeight: 800,
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  border: '1px solid #FFE4E6',
                                  bgcolor: '#FFF1F2',
                                  color: '#E11D48',
                                  marginLeft: 'auto',
                                  '&:hover': { bgcolor: '#FFE4E6' }
                                }}
                              >
                                Reset
                              </Box>
                            )}
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <DiscountInput 
                              productId={item.product.id}
                              initialValue={meta.discountValue}
                              discountType={activeDiscountType}
                              onApply={handleApplyDiscount}
                             
                            />
                            
                            {/* <Button
                              variant="text"
                              size="medium"
                              onClick={() => {
                                const nextType = activeDiscountType === 'percent' ? 'flat' : 'percent'
                                handleApplyDiscount(item.product.id, 0, 'clear') 
                                handleApplyDiscount(item.product.id, 0, nextType)  
                              }}
                              sx={{ minWidth: 'auto', p: 0, fontSize: '10px', fontWeight: 800, color: '#2563EB', textTransform: 'none' }}
                            >
                              {activeDiscountType === 'percent' ? '» ကျပ်ပြောင်း' : '» %ပြောင်း'}
                            </Button> */}
                          </Box>
                        </Box>

                        {/* Calculated Live Outputs */}
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563EB', display: 'block', mt: 1 }}>
                          ယခုရောင်းဈေး: {formatCurrency(itemActivePrice)} MMK
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#7A6069', display: 'block' }}>
                          စုစုပေါင်းကျသင့်ငွေ: {formatCurrency(itemActivePrice * item.quantity)} MMK
                        </Typography>
                      </Box>
                      
                      {/* Quantity Select Counter Controls */}
                      <Box display="flex" alignItems="center" gap={0.5} sx={{ border: '1.5px solid #2D1520', borderRadius: '6px', bgcolor: '#ffffff', p: '2px 4px' }}>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item.product, 'decrement')} sx={{ p: 0.75, color: '#2D1520' }}>
                          <RemoveIcon sx={{ fontSize: 18, fontWeight: 900 }} />
                        </IconButton>
                        <Typography sx={{ fontSize: '1.05rem', fontWeight: 900, color: '#2D1520', minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item.product, 'increment')} sx={{ p: 0.75, color: '#2D1520' }}>
                          <AddIcon sx={{ fontSize: 18, fontWeight: 900 }} />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider sx={{ borderColor: '#F5E1E5', opacity: 0.6 }} />
                  </Box>
                )
              })}
              {totalItemsCount === 0 && (
                <Box sx={{ py: 6, my: 'auto', textAlign: 'center' }}>
                  <ShoppingCartIcon sx={{ fontSize: 36, color: '#F5E1E5', mb: 1 }} />
                  <Typography variant="body1" sx={{ color: '#C4A3AF', fontWeight: 600, display: 'block' }}>ခြင်းတောင်းထဲတွင် ပစ္စည်းမရှိပါ။</Typography>
                </Box>
              )}
            </Box>

            {/* Absolute Grand Summary Panel */}
            <Box sx={{ p: 2, bgcolor: '#FDF8F9', borderTop: '1px solid #F5E1E5' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1520' }}>စုစုပေါင်းကျသင့်ငွေ</Typography>
                <Typography variant="body1" sx={{ fontWeight: 900, color: '#2563EB' }}>
                  {formatCurrency(totalCartValue)} MMK
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={totalItemsCount === 0 || processing || userRole !== 'employee'}
                onClick={handlePaymentSubmit}
                startIcon={processing ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{
                  bgcolor: '#2563EB',
                  color: '#ffffff',
                  boxShadow: 'none',
                  py: 1.2,
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#2563EB' },
                  '&.Mui-disabled': { bgcolor: '#F5E1E5', color: '#C4A3AF' }
                }}
              >
                {processing ? 'လုပ်ဆောင်နေပါသည်...' : 'ငွေချေရန်'}
              </Button>
            </Box>
          </Card>
        </Grid>

      </Grid>
    </Box>
  )
}











