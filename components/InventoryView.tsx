
// "use client"

// import { useState, useEffect, useRef, ChangeEvent } from "react"
// import { useAppState, Product } from "../lib/store"
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Chip,
//   TextField,
//   InputAdornment,
//   Fab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Snackbar,
//   Alert,
//   Divider,
//   CircularProgress,
//   Avatar,
//   Grid
// } from "@mui/material"
// import SearchIcon from "@mui/icons-material/Search"
// import AddIcon from "@mui/icons-material/Add"
// import EditIcon from "@mui/icons-material/Edit"
// import DeleteIcon from "@mui/icons-material/Delete"
// import InventoryIcon from "@mui/icons-material/Inventory2Outlined"
// import CategoryIcon from "@mui/icons-material/CategoryOutlined"
// import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined"

// interface ProductFormData {
//   name: string
//   price: string
//   stock: string
//   category: string
//   sku: string
// }

// const defaultFormData: ProductFormData = {
//   name: "",
//   price: "",
//   stock: "",
//   category: "",
//   sku: "",
// }

// export default function InventoryView() {
//   const { state, fetchInventory, createProduct, updateProduct, deleteProduct } = useAppState()
//   const { products, metrics, isLoading } = state

//   const [localSearch, setLocalSearch] = useState("")
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [editItem, setEditItem] = useState<Product | null>(null)
//   const [detailItem, setDetailItem] = useState<Product | null>(null)
//   const [form, setForm] = useState<ProductFormData>(defaultFormData)
//   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const [touchStart, setTouchStart] = useState(0);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [imagePreview, setImagePreview] = useState<string | null>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
//     open: false,
//     message: "",
//     severity: "success",
//   })
//   const [filterCategory, setFilterCategory] = useState<string>("All")

//   const getFullImageUrl = (imageUrl: string | null | undefined) => {
//     if (!imageUrl) return null
//     const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.72:5000"
//     const cleanBackendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
//     const cleanImagePath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
//     return `${cleanBackendUrl}${cleanImagePath}`
//   }

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchInventory(localSearch)
//     }, 400)

//     return () => clearTimeout(delayDebounceFn)
//   }, [localSearch])

//   const allCategories = [
//     "All",
//     ...Array.from(new Set(products.map((p) => p.category?.trim() || "General"))).filter(Boolean)
//   ]

//   const filteredProducts = products.filter((p) => {
//     const itemCategory = p.category?.trim() || "General"
//     return filterCategory === "All" || itemCategory === filterCategory
//   })

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       setSelectedFile(file)
//       setImagePreview(URL.createObjectURL(file))
//     }
//   }

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await fetchInventory(localSearch);
//     setIsRefreshing(false);
//   };

//   function openAddDialog() {
//     setEditItem(null)
//     setForm(defaultFormData)
//     setSelectedFile(null)
//     setImagePreview(null)
//     setDialogOpen(true)
//   }

//   function openEditDialog(product: Product, e?: React.MouseEvent) {
//     if (e) e.stopPropagation()
//     setEditItem(product)
//     setForm({
//       name: product.name,
//       price: product.price.toString(),
//       stock: product.stock.toString(),
//       category: product.category || "",
//       sku: product.sku || "",
//     })
//     setSelectedFile(null)
//     setImagePreview(getFullImageUrl(product.image_url))
//     setDialogOpen(true)
//   }

//   function openDeleteDialog(id: string, e: React.MouseEvent) {
//     e.stopPropagation()
//     setDeleteConfirmId(id)
//   }

//   async function handleSave() {
//     if (!form.name.trim() || !form.price || !form.stock) {
//       setSnackbar({ open: true, message: "အချက်အလက်များကို ပြည့်စုံစွာဖြည့်စွက်ပါ", severity: "error" })
//       return
//     }

//     setIsSubmitting(true)

//     const formData = new FormData()
//     formData.append("name", form.name.trim())
//     formData.append("price", form.price)
//     formData.append("stock", form.stock)
//     formData.append("category", form.category.trim() || "General")

//     if (form.sku.trim()) {
//       formData.append("sku", form.sku.trim())
//     }

//     if (selectedFile) {
//       formData.append("image", selectedFile)
//     }

//     try {
//       const targetId = editItem ? (editItem._id || editItem.id) : null

//       if (targetId) {
//         await updateProduct(targetId, formData)
//         setSnackbar({ open: true, message: "ပြင်ဆင်မှု အောင်မြင်ပါသည်။", severity: "success" })
//       } else {
//         await createProduct(formData)
//         setSnackbar({ open: true, message: "အသစ်ထည့်သွင်းခြင်း အောင်မြင်ပါသည်။", severity: "success" })
//       }

//       setDialogOpen(false)
//       setDetailItem(null)
//       fetchInventory(localSearch)
//     } catch (error) {
//       setSnackbar({ open: true, message: "လုပ်ဆောင်ချက် မအောင်မြင်ပါ။", severity: "error" })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   async function handleDelete(id: string) {
//     setIsSubmitting(true)
//     try {
//       await deleteProduct(id)
//       setDeleteConfirmId(null)
//       setDetailItem(null)
//       setSnackbar({ open: true, message: "ပစ္စည်းပယ်ဖျက်ပြီးပါပြီ", severity: "info" })
//       fetchInventory(localSearch)
//     } catch (error) {
//       setSnackbar({ open: true, message: "ပယ်ဖျက်ရန် ပျက်ကွက်ခဲ့သည်။", severity: "error" })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Box sx={{ width: { xs: "100%", md: "95%" }, mx: "auto", height: "calc(100vh - 32px)", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
//       <Box sx={{ flexShrink: 0, pt: 1 }}>
//         <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, overflowX: "auto", px: 0.5, pb: 0.5 }}>
//           <Card sx={{ minWidth: 130, flex: 1, bgcolor: "#2563EB", borderRadius: "8px", color: "white", boxShadow: "none", border: "1px solid #F5E1E5" }}>
//             <CardContent sx={{ p: "14px !important" }}>
//               <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 700 }}>
//                 ပစ္စည်းအမျိုးအစား
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
//                 {metrics?.totalProducts || 0}
//               </Typography>
//             </CardContent>
//           </Card>

//           <Card sx={{ minWidth: 130, flex: 1, bgcolor: "#2D1520", borderRadius: "8px", color: "white", boxShadow: "none" }}>
//             <CardContent sx={{ p: "14px !important" }}>
//               <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 700 }}>
//                 ပစ္စည်းအရေအတွက်
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
//                 {(metrics?.totalStock || 0).toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Box>

//         <Box sx={{ bgcolor: "#FDF8F9", borderRadius: "8px", border: "1px solid #F5E1E5", p: 2, mb: 2.5 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//             <InventoryIcon sx={{ color: "#2563EB", fontSize: 22 }} />
//             <Typography variant="body2" sx={{ color: "#7A6069", fontWeight: 700 }}>
//               စုစုပေါင်း ပစ္စည်းတန်ဖိုး
//             </Typography>
//           </Box>
//           <Typography variant="h6" sx={{ fontWeight: 800, color: "#2D1520", mt: 1 }}>
//             {(metrics?.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MMK
//           </Typography>
//         </Box>

//         <TextField
//           fullWidth
//           size="small"
//           placeholder="ရှာဖွေရန်..."
//           value={localSearch}
//           onChange={(e) => setLocalSearch(e.target.value)}
//           sx={{
//             mb: 1.5,
//             "& .MuiOutlinedInput-root": {
//               backgroundColor: "#ffffff",
//               borderRadius: "8px",
//               "& fieldset": { borderColor: "#F5E1E5" },
//               "&:hover fieldset": { borderColor: "#C4A3AF" },
//               "&.Mui-focused fieldset": { borderColor: "#2563EB" }
//             }
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ color: "#C4A3AF", fontSize: 20 }} />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {/* <Box sx={{ display: "flex", gap: 0.75, mb: 1, overflowX: "auto", pb: 0.5 }}> */}

//         <Box
//           sx={{
//             display: "flex",
//             gap: 0.75,
//             mb: 1,
//             overflowX: "auto",
//             pb: 1, // Slight padding adjustment prevents clipping active states
//             WebkitOverflowScrolling: "touch",
//             "&::-webkit-scrollbar": { display: "none" }, // Clean look: removes visual horizontal bar clump
//             msOverflowStyle: "none",
//             scrollbarWidth: "none"
//           }}
//         >

//           {allCategories.map((cat, idx) => (
//             <Chip
//               key={`filter-cat-${cat}-${idx}`}
//               label={cat}
//               size="small"
//               onClick={() => setFilterCategory(cat)}
//               variant={filterCategory === cat ? "filled" : "outlined"}
//               sx={{
//                 fontSize: "0.75rem",
//                 height: 30,
//                 borderRadius: "6px",
//                 boxShadow: "none",
//                 border: "1px solid #F5E1E5",
//                 fontWeight: 700,
//                 ...(filterCategory === cat ? {
//                   bgcolor: "#2563EB",
//                   color: "#ffffff",
//                   "&:hover": { bgcolor: "#1D4ED8" }
//                 } : {
//                   bgcolor: "#ffffff",
//                   color: "#7A6069",
//                 })
//               }}
//             />
//           ))}
//         </Box>
//       </Box>

//       {/* <Box sx={{ flexGrow: 1, overflowY: "auto", px: 0.5, pt: 2, pb: 12, position: "relative" }}> */}
//       {/* CHANGE THIS LINE */}
//       {/* <Box sx={{ flexGrow: 1, overflowY: "auto", px: { xs: 0, sm: 0.5 }, pt: 2, pb: 12, position: "relative" }}> */}

//       <Box
//         ref={scrollContainerRef}
//         onTouchStart={(e) => setTouchStart(e.touches[0].clientY)}
//         onTouchEnd={(e) => {
//           const touchEnd = e.changedTouches[0].clientY;
//           const container = scrollContainerRef.current;

//           // Check if at top and swiped down by at least 80px
//           if (container?.scrollTop === 0 && (touchEnd - touchStart) > 80) {
//             handleRefresh();
//           }
//         }}
//         sx={{
//           flexGrow: 1,
//           overflowY: "auto",
//           px: { xs: 0.5, sm: 1 }, // Prevents cards from hitting screen edge borders during momentum scroll
//           pt: 2,
//           pb: 14,
//           position: "relative",
//           WebkitOverflowScrolling: "touch", // Smooth physics native momentum engine 
//           willChange: "transform",          // Hints GPU to accelerate card rendering
//           "&::-webkit-scrollbar": {
//             width: "6px"
//           },
//           "&::-webkit-scrollbar-track": {
//             backgroundColor: "transparent"
//           },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: "#E5D1D5",     // Subtle, elegant scroll track color
//             borderRadius: "10px"
//           }
//         }}
//       >

//         {/* Refresh Indicator */}
//         {isRefreshing && (
//           <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
//             <CircularProgress size={24} sx={{ color: "#2563EB" }} />
//           </Box>
//         )}

//         {isLoading && !isRefreshing && (
//           <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//             <CircularProgress size={28} sx={{ color: "#2563EB" }} />
//           </Box>
//         )}

//         {!isLoading && filteredProducts.length === 0 && (
//           <Box sx={{ textAlign: "center", py: 6, bgcolor: '#ffffff', borderRadius: '8px', border: '1px dashed #F5E1E5' }}>
//             <CategoryIcon sx={{ fontSize: 48, color: "#C4A3AF", mb: 1 }} />
//             <Typography sx={{ color: "#C4A3AF", fontWeight: 600 }}>ပစ္စည်းများ ရှာမတွေ့ပါ။</Typography>
//           </Box>
//         )}

//         {!isLoading && filteredProducts.length > 0 && (
//           <Grid container spacing={1} alignItems="stretch">
//             {filteredProducts.map((product, pIdx) => {
//               const uniqueId = product._id || product.id || `gallery-fallback-${pIdx}`
//               const productImgSrc = getFullImageUrl(product.image_url)
//               const isLowStock = product.stock < 5

//               return (
//                 <Grid item xs={6} sm={4} md={3} key={uniqueId} sx={{ display: "flex", bgcolor: '' }}>
//                   <Card
//                     onClick={() => setDetailItem(product)}
//                     sx={{
//                       cursor: 'pointer',
//                       boxShadow: 'none',
//                       border: '1px solid #F5E1E5',
//                       borderRadius: '12px',
//                       bgcolor: '#ffffff',
//                       overflow: 'hidden',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       width: '100%',
//                       transition: 'all 0.2s ease-in-out',
//                       '&:hover': { transform: 'translateY(-4px)', borderColor: '' }
//                     }}
//                   >
//                     <Box sx={{ position: 'relative', width: '100%', pt: '100%', bgcolor: '#FDF8F9', overflow: 'hidden', flexShrink: 0 }}>
//                       {productImgSrc ? (
//                         <Box
//                           component="img"
//                           src={productImgSrc}
//                           alt={product.name}
//                           sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
//                         />
//                       ) : (
//                         <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                           <CategoryIcon sx={{ fontSize: 36, color: '#C4A3AF' }} />
//                         </Box>
//                       )}

//                       {isLowStock && (
//                         <Chip
//                           label="Low Stock"
//                           size="medium"
//                           sx={{ position: 'absolute', width: '100%', top: 0, left: 0, bgcolor: '#2563EB', color: '#ffffff', fontWeight: 800, fontSize: '1 rem', height: 25, borderRadius: '0px' }}
//                         />
//                       )}
//                     </Box>

//                     <CardContent sx={{ p: '14px !important', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
//                       {/* Enforces a single-line restriction with ellipsis truncation to ensure uniform card alignment */}
//                       <Typography
//                         variant="body1"
//                         sx={{
//                           fontWeight: 800,
//                           color: '#2D1520',
//                           mb: 0.5,
//                           lineHeight: 1.4,
//                           whiteSpace: 'nowrap',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis'
//                         }}
//                       >
//                         {product.name}
//                       </Typography>

//                       <Box sx={{ mt: 'auto', pt: 1 }}>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2563EB', mb: 0.5, fontSize: '0.95rem' }}>
//                           {Number(product.price || 0).toLocaleString()} MMK
//                         </Typography>

//                         <Typography variant="caption" sx={{ color: '#7A6069', fontWeight: 700, fontSize: '0.78rem', display: 'block' }}>
//                           Stock: {product.stock} Units
//                         </Typography>




//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               )
//             })}
//           </Grid>
//         )}
//       </Box>

//       <Dialog
//         open={!!detailItem}
//         onClose={() => setDetailItem(null)}
//         fullWidth
//         PaperProps={{ sx: { boxShadow: "none", border: "1px solid #F5E1E5", borderRadius: "16px", maxWidth: '440px', overflow: 'hidden' } }}
//       >
//         <DialogTitle sx={{ fontWeight: 900, color: "#2D1520", fontSize: "1.15rem", p: 2.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           ပစ္စည်းအသေးစိတ် အချက်အလက်
//           <Chip label={detailItem?.category || "General"} size="small" sx={{ bgcolor: '#2D1520', color: '#ffffff', fontWeight: 700, borderRadius: '6px' }} />
//         </DialogTitle>
//         <Divider sx={{ borderColor: '#F5E1E5' }} />

//         <DialogContent sx={{ p: 2.5, pt: 2 }}>
//           {detailItem && (
//             <Box display="flex" flexDirection="column" gap={2.5}>
//               <Box
//                 component="img"
//                 src={getFullImageUrl(detailItem.image_url) || "/placeholder.png"}
//                 alt={detailItem.name}
//                 sx={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: '10px', border: '1px solid #F5E1E5', bgcolor: '#FDF8F9' }}
//                 onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
//               />

//               <Box>
//                 {/* Full name remains visible in details view to allow easy reading */}
//                 <Typography sx={{ fontWeight: 900, fontSize: 18, color: '#2D1520', mb: 2, lineHeight: 1.3, wordBreak: "break-word" }}>
//                   {detailItem.name}
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: '#C4A3AF', fontFamily: 'monospace', fontWeight: 700, display: 'block', mb: 2 }}>
//                   SKU CODE: {detailItem.sku || "N/A"}
//                 </Typography>

//                 <Box display="flex" flexDirection="column" gap={1.5} sx={{ bgcolor: '#FDF8F9', p: 2, borderRadius: '10px', border: '1px solid #F5E1E5' }}>
//                   <Box display="flex" justifyContent="space-between">
//                     <Typography variant="subtitle2" sx={{ color: '#7A6069', fontWeight: 600 }}>သတ်မှတ်စျေးနှုန်း</Typography>
//                     <Typography variant="subtitle1" sx={{ color: '#2D1520', fontWeight: 800 }}>{Number(detailItem.price).toLocaleString()} MMK</Typography>
//                   </Box>
//                   <Divider sx={{ borderColor: '#F5E1E5' }} />
//                   <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Typography variant="subtitle2" sx={{ color: '#7A6069', fontWeight: 600 }}>လက်ကျန်အရေအတွက်</Typography>
//                     <Typography variant="body2" sx={{ color: detailItem.stock < 5 ? '#2563EB' : '#2D1520', fontWeight: 800 }}>
//                       {detailItem.stock} Units
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>

//               <Box display="flex" gap={1.5} mt={1}>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   size="large"
//                   startIcon={<EditIcon />}
//                   onClick={() => openEditDialog(detailItem)}
//                   sx={{
//                     height: 44,
//                     fontSize: 13,
//                     borderRadius: "8px",
//                     color: "#2563EB",
//                     borderColor: "#F5E1E5",
//                     fontWeight: 700,
//                     textTransform: "none",
//                     backgroundColor: "#ffffff",
//                     "&:hover": { borderColor: "#2563EB", backgroundColor: "#EBF2FF" }
//                   }}
//                 >
//                   ပြင်ဆင်ရန်
//                 </Button>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   size="large"
//                   startIcon={<DeleteIcon />}
//                   onClick={(e) => openDeleteDialog(detailItem._id || detailItem.id, e)}
//                   sx={{
//                     height: 44,
//                     fontSize: 13,
//                     borderRadius: "8px",
//                     color: "#D32F2F",
//                     borderColor: "#F5E1E5",
//                     fontWeight: 700,
//                     textTransform: "none",
//                     backgroundColor: "#ffffff",
//                     "&:hover": { borderColor: "#D32F2F", backgroundColor: "#FFEBEE" }
//                   }}
//                 >
//                   ပယ်ဖျက်ရန်
//                 </Button>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//         <Divider sx={{ borderColor: '#F5E1E5' }} />
//         <DialogActions sx={{ p: 2, px: 2.5 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             onClick={() => setDetailItem(null)}
//             sx={{ height: 40, borderRadius: '8px', bgcolor: '#2D1520', color: '#ffffff', fontWeight: 700, boxShadow: "none", '&:hover': { bgcolor: '#1A0B13', boxShadow: "none" } }}
//           >
//             ပိတ်မည်
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Fab
//         onClick={openAddDialog}
//         disabled={isSubmitting}
//         sx={{
//           position: "fixed",
//           bottom: 80,
//           right: 20,
//           zIndex: 1100,
//           bgcolor: "#2D1520",
//           color: "#ffffff",
//           boxShadow: "none",
//           "&:hover": { bgcolor: "#1A0B13" },
//           "&.Mui-disabled": { bgcolor: "#C4A3AF", color: "#ffffff" }
//         }}
//       >
//         <AddIcon />
//       </Fab>



//       <Dialog open={dialogOpen} onClose={() => !isSubmitting && setDialogOpen(false)} fullWidth PaperProps={{ sx: { boxShadow: "none", border: "1px solid #F5E1E5", borderRadius: "12px" } }}>
//         <DialogTitle sx={{ fontWeight: 800, color: "#2D1520", fontSize: "1.1rem", pb: 1 }}>
//           {editItem ? "အချက်အလက်ပြင်ဆင်ရန်" : "ပစ္စည်းအသစ်ထည့်ရန်"}
//         </DialogTitle>
//         <Divider />
//         <DialogContent sx={{ pt: 2.5 }}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, mb: 1 }}>
//               <Avatar
//                 src={imagePreview || undefined}
//                 variant="square"
//                 sx={{ width: '100%', height: 200, borderRadius: "8px", bgcolor: "#FDF8F9", border: "1px solid #F5E1E5", color: "#C4A3AF" }}
//               >
//                 {!imagePreview && <CloudUploadIcon sx={{ fontSize: 40 }} />}
//               </Avatar>
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 style={{ display: "none" }}
//                 onChange={handleFileChange}
//                 disabled={isSubmitting}
//               />
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={isSubmitting}
//                 sx={{ color: "#2563EB", borderColor: "#F5E1E5", textTransform: "none", fontWeight: 700, "&:hover": { borderColor: "#C4A3AF", bgcolor: "#FDF8F9" } }}
//               >
//                 ပုံတင်ရန် ရွေးချယ်ပါ
//               </Button>
//             </Box>

//             <TextField label="ပစ္စည်းအမည်" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required size="medium" disabled={isSubmitting} />
//             <Box sx={{ display: "flex", gap: 1.5 }}>
//               <TextField label="တန်ဖိုး (MMK)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth required size="medium" disabled={isSubmitting} />
//               <TextField label="အရေအတွက်" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} fullWidth required size="medium" disabled={isSubmitting} />
//             </Box>
//             <TextField label="အုပ်စု အမျိုးအစား (Category)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth size="medium" disabled={isSubmitting} />
//             <TextField label="SKU ကုဒ်နံပါတ်" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} fullWidth size="medium" disabled={isSubmitting} placeholder="ချန်လှပ်ထားပါက စနစ်မှ အလိုအလျောက်ထုတ်ပေးပါမည်" />
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
//           <Button onClick={() => setDialogOpen(false)} disabled={isSubmitting} sx={{ color: "#7A6069", fontWeight: 700 }}>
//             ပယ်ဖျက်ရန်
//           </Button>
//           <Button variant="contained" onClick={handleSave} disabled={isSubmitting} sx={{ bgcolor: "#2563EB", color: "#ffffff", boxShadow: "none", fontWeight: 700, "&:hover": { bgcolor: "#1D4ED8" } }}>
//             {isSubmitting ? <CircularProgress size={24} sx={{ color: "white" }} /> : (editItem ? "ပြင်ဆင်မည်" : "ထည့်ရန်")}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={!!deleteConfirmId} onClose={() => !isSubmitting && setDeleteConfirmId(null)}>
//         <DialogTitle sx={{ fontWeight: 800, color: "#2D1520" }}>ပစ္စည်းပယ်ဖျက်ရန်</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ color: "#7A6069", fontWeight: 600 }}>
//             ဤပစ္စည်းကို စနစ်အတွင်းမှ အပြီးတိုင် ပယ်ဖျက်လိုပါသလား။
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
//           <Button onClick={() => setDeleteConfirmId(null)} disabled={isSubmitting} sx={{ color: "#7A6069", fontWeight: 700 }}>
//             မလုပ်တော့ပါ
//           </Button>
//           <Button variant="contained" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} disabled={isSubmitting} sx={{ bgcolor: "#2563EB", color: "#ffffff", boxShadow: "none", fontWeight: 700, "&:hover": { bgcolor: "#1D4ED8" } }}>
//             {isSubmitting ? <CircularProgress size={24} sx={{ color: "white" }} /> : "ပယ်ဖျက်မည်"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
//         <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ width: "100%", fontWeight: 700, borderRadius: "8px", boxShadow: "none" }} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }






















"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import { useAppState, Product } from "../lib/store"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
  Avatar,
  Grid
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import InventoryIcon from "@mui/icons-material/Inventory2Outlined"
import CategoryIcon from "@mui/icons-material/CategoryOutlined"
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined"

interface ProductFormData {
  name: string
  price: string
  stock: string
  category: string
  sku: string
}


const defaultFormData: ProductFormData = {
  name: "",
  price: "",
  stock: "",
  category: "",
  sku: "",
}

export default function InventoryView() {
  const { state, fetchInventory, createProduct, updateProduct, deleteProduct } = useAppState()
  const { products, metrics, isLoading } = state

  const [localSearch, setLocalSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Product | null>(null)
  const [detailItem, setDetailItem] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductFormData>(defaultFormData)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [touchStart, setTouchStart] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "success",
  })
  const [filterCategory, setFilterCategory] = useState<string>("All")

  const getFullImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return null
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://pos.orbitdigitalsolution.com"
    const cleanBackendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
    const cleanImagePath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
    return `${cleanBackendUrl}${cleanImagePath}`
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInventory(localSearch)
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [localSearch])

  const allCategories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category?.trim()))).filter(Boolean)
  ]

  const filteredProducts = products.filter((p) => {
    const itemCategory = p.category?.trim()
    return filterCategory === "All" || itemCategory === filterCategory
  })

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchInventory(localSearch);
    setIsRefreshing(false);
  };

  function openAddDialog() {
    setEditItem(null)
    setForm(defaultFormData)
    setSelectedFile(null)
    setImagePreview(null)
    setDialogOpen(true)
  }

  function openEditDialog(product: Product, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    setEditItem(product)
    setForm({
      name: product.name,
      price: Math.floor(product.price).toString(), // Ensure integer
      stock: Math.floor(product.stock).toString(), // Ensure integer
      category: product.category || "",
      sku: product.sku || "",
    })
    setSelectedFile(null)
    setImagePreview(getFullImageUrl(product.image_url))
    setDialogOpen(true)
  }

  function openDeleteDialog(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setDeleteConfirmId(id)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price || !form.stock) {
      setSnackbar({ open: true, message: "အချက်အလက်များကို ပြည့်စုံစွာဖြည့်စွက်ပါ", severity: "error" })
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", form.name.trim())
    formData.append("price", form.price)
    formData.append("stock", form.stock)
    formData.append("category", form.category.trim())

    if (form.sku.trim()) {
      formData.append("sku", form.sku.trim())
    }

    if (selectedFile) {
      formData.append("image", selectedFile)
    }

    try {
      const targetId = editItem ? (editItem._id || editItem.id) : null

      if (targetId) {
        await updateProduct(targetId, formData)
        setSnackbar({ open: true, message: "ပြင်ဆင်မှု အောင်မြင်ပါသည်။", severity: "success" })
      } else {
        await createProduct(formData)
        setSnackbar({ open: true, message: "အသစ်ထည့်သွင်းခြင်း အောင်မြင်ပါသည်။", severity: "success" })
      }

      setDialogOpen(false)
      setDetailItem(null)
      fetchInventory(localSearch)
    } catch (error) {
      setSnackbar({ open: true, message: "လုပ်ဆောင်ချက် မအောင်မြင်ပါ။", severity: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setIsSubmitting(true)
    try {
      await deleteProduct(id)
      setDeleteConfirmId(null)
      setDetailItem(null)
      setSnackbar({ open: true, message: "ပစ္စည်းပယ်ဖျက်ပြီးပါပြီ", severity: "info" })
      fetchInventory(localSearch)
    } catch (error) {
      setSnackbar({ open: true, message: "ပယ်ဖျက်ရန် ပျက်ကွက်ခဲ့သည်။", severity: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ width: { xs: "100%", md: "95%" }, mx: "auto", height: "calc(100vh - 32px)", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <Box sx={{ flexShrink: 0, pt: 1 }}>
        <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, overflowX: "auto", px: 0.5, pb: 0.5 }}>
          <Card sx={{ minWidth: 130, flex: 1, bgcolor: "#2563EB", borderRadius: "8px", color: "white", boxShadow: "none", border: "1px solid #F5E1E5" }}>
            <CardContent sx={{ p: "14px !important" }}>
              <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 700 }}>
                ပစ္စည်းအမျိုးအစား
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
                {metrics?.totalProducts || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 130, flex: 1, bgcolor: "#2D1520", borderRadius: "8px", color: "white", boxShadow: "none" }}>
            <CardContent sx={{ p: "14px !important" }}>
              <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 700 }}>
                ပစ္စည်းအရေအတွက်
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
                {(metrics?.totalStock || 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ bgcolor: "#FDF8F9", borderRadius: "8px", border: "1px solid #F5E1E5", p: 2, mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <InventoryIcon sx={{ color: "#2563EB", fontSize: 22 }} />
            <Typography variant="body2" sx={{ color: "#7A6069", fontWeight: 700 }}>
              စုစုပေါင်း ပစ္စည်းတန်ဖိုး
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#2D1520", mt: 1 }}>
            {(metrics?.totalValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} MMK
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="medium"
          placeholder="ရှာဖွေရန်..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              "& fieldset": { borderColor: "#F5E1E5" },
              "&:hover fieldset": { borderColor: "#C4A3AF" },
              "&.Mui-focused fieldset": { borderColor: "#2563EB" }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#C4A3AF", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* <Box sx={{ display: "flex", gap: 0.75, mb: 1, overflowX: "auto", pb: 0.5 }}> */}

        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            mb: 1,
            overflowX: "auto",
            pb: 1, // Slight padding adjustment prevents clipping active states
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { display: "none" }, // Clean look: removes visual horizontal bar clump
            msOverflowStyle: "none",
            scrollbarWidth: "none"
          }}
        >

          {allCategories.map((cat, idx) => (
            <Chip
              key={`filter-cat-${cat}-${idx}`}
              label={cat}
              size="small"
              onClick={() => setFilterCategory(cat)}
              variant={filterCategory === cat ? "filled" : "outlined"}
              sx={{
                fontSize: "2 rem",
                height: 40,
                borderRadius: "6px",
                boxShadow: "none",
                border: "1px solid #F5E1E5",
                fontWeight: 700,
                ...(filterCategory === cat ? {
                  bgcolor: "#2563EB",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#1D4ED8" }
                } : {
                  bgcolor: "#ffffff",
                  color: "#7A6069",
                })
              }}
            />
          ))}
        </Box>
      </Box>

      {/* <Box sx={{ flexGrow: 1, overflowY: "auto", px: 0.5, pt: 2, pb: 12, position: "relative" }}> */}
      {/* CHANGE THIS LINE */}
      {/* <Box sx={{ flexGrow: 1, overflowY: "auto", px: { xs: 0, sm: 0.5 }, pt: 2, pb: 12, position: "relative" }}> */}

      <Box
        ref={scrollContainerRef}
        onTouchStart={(e) => setTouchStart(e.touches[0].clientY)}
        onTouchEnd={(e) => {
          const touchEnd = e.changedTouches[0].clientY;
          const container = scrollContainerRef.current;

          // Check if at top and swiped down by at least 80px
          if (container?.scrollTop === 0 && (touchEnd - touchStart) > 80) {
            handleRefresh();
          }
        }}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: { xs: 0.5, sm: 1 }, // Prevents cards from hitting screen edge borders during momentum scroll
          pt: 2,
          pb: 14,
          position: "relative",
          WebkitOverflowScrolling: "touch", // Smooth physics native momentum engine 
          willChange: "transform",          // Hints GPU to accelerate card rendering
          "&::-webkit-scrollbar": {
            width: "6px"
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#E5D1D5",     // Subtle, elegant scroll track color
            borderRadius: "10px"
          }
        }}
      >

        {/* Refresh Indicator */}
        {isRefreshing && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} sx={{ color: "#2563EB" }} />
          </Box>
        )}

        {isLoading && !isRefreshing && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} sx={{ color: "#2563EB" }} />
          </Box>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <Box sx={{ textAlign: "center", py: 6, bgcolor: '#ffffff', borderRadius: '8px', border: '1px dashed #F5E1E5' }}>
            <CategoryIcon sx={{ fontSize: 48, color: "#C4A3AF", mb: 1 }} />
            <Typography sx={{ color: "#C4A3AF", fontWeight: 600 }}>ပစ္စည်းများ ရှာမတွေ့ပါ။</Typography>
          </Box>
        )}

        {!isLoading && filteredProducts.length > 0 && (
          <Grid container spacing={1} alignItems="stretch">
            {filteredProducts.map((product, pIdx) => {
              const uniqueId = product._id || product.id || `gallery-fallback-${pIdx}`
              const productImgSrc = getFullImageUrl(product.image_url)
              const isLowStock = product.stock < 5

              return (
                <Grid item xs={6} sm={4} md={3} key={uniqueId} sx={{ display: "flex", bgcolor: '' }}>
                  <Card
                    onClick={() => setDetailItem(product)}
                    sx={{
                      cursor: 'pointer',
                      boxShadow: 'none',
                      border: '1px solid #F5E1E5',
                      borderRadius: '12px',
                      bgcolor: '#ffffff',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { transform: 'translateY(-4px)', borderColor: '' }
                    }}
                  >
                    <Box sx={{ position: 'relative', width: '100%', pt: '100%', bgcolor: '#FDF8F9', overflow: 'hidden', flexShrink: 0 }}>
                      {productImgSrc ? (
                        <Box
                          component="img"
                          src={productImgSrc}
                          alt={product.name}
                          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CategoryIcon sx={{ fontSize: 36, color: '#C4A3AF' }} />
                        </Box>
                      )}

                      {isLowStock && (
                        <Chip
                          label="Low Stock"
                          size="medium"
                          sx={{ position: 'absolute', width: '100%', top: 0, left: 0, bgcolor: 'black', color: '#ffffff', fontWeight: 800, fontSize: '1 rem', height: 30, borderRadius: '0px' }}
                        />
                      )}
                    </Box>

                    <CardContent sx={{ p: '14px !important', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      {/* Enforces a single-line restriction with ellipsis truncation to ensure uniform card alignment */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 800,
                          color: '#2D1520',
                          mb: 0.5,
                          fontSize: '0.85rem',
                          lineHeight: 1.4,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Box sx={{ mt: 'auto', pt: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2563EB', mb: 0.5, fontSize: '0.95rem' }}>
                          {Number(product.price || 0).toLocaleString()} MMK
                        </Typography>

                        {/* <Typography variant="caption" sx={{ color: '#7A6069', fontWeight: 700, fontSize: '0.78rem', display: 'block' }}>
                          Stock: {product.stock} Units
                        </Typography> */}


                        {/* <Typography variant="caption" sx={{ color: '#7A6069', fontWeight: 700, fontSize: '0.78rem', display: 'block' }}>
                          Stock: {product.stock} {product.unit_main}
                          {product.conversion_factor > 1 && ` (${product.stock * product.conversion_factor} ${product.unit_sub})`}
                        </Typography> */}

                        {/* Replace the old Typography stock block with this */}
                        <Typography variant="caption" sx={{ color: '#7A6069', fontWeight: 700, fontSize: '0.78rem', display: 'block' }}>
                          Stock: {Math.floor(product.stock)}
                        </Typography>

                         <Typography variant="caption" sx={{ color: '#7A6069', fontWeight: 700, fontSize: '0.78rem', display: 'block' }}>
                          SKU: {product.sku}
                        </Typography>




                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Box>

      <Dialog
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        fullWidth
        PaperProps={{ sx: { boxShadow: "none", border: "1px solid #F5E1E5", borderRadius: "16px", maxWidth: '440px', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#2D1520", fontSize: "1.15rem", p: 2.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          ပစ္စည်းအသေးစိတ် အချက်အလက်
          <Chip label={detailItem?.category} size="small" sx={{ bgcolor: '#2D1520', color: '#ffffff', fontWeight: 700, borderRadius: '6px' }} />
        </DialogTitle>
        <Divider sx={{ borderColor: '#F5E1E5' }} />

        <DialogContent sx={{ p: 2.5, pt: 2 }}>
          {detailItem && (
            <Box display="flex" flexDirection="column" gap={2.5}>
              <Box
                component="img"
                src={getFullImageUrl(detailItem.image_url) || "/placeholder.png"}
                alt={detailItem.name}
                sx={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: '10px', border: '1px solid #F5E1E5', bgcolor: '#FDF8F9' }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
              />

              <Box>
                {/* Full name remains visible in details view to allow easy reading */}
                <Typography sx={{ fontWeight: 900, fontSize: 18, color: '#2D1520', mb: 2, lineHeight: 1.3, wordBreak: "break-word" }}>
                  {detailItem.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#C4A3AF', fontFamily: 'monospace', fontWeight: 700, display: 'block', mb: 2 }}>
                  SKU CODE: {detailItem.sku || "N/A"}
                </Typography>

                <Box display="flex" flexDirection="column" gap={1.5} sx={{ bgcolor: '#FDF8F9', p: 2, borderRadius: '10px', border: '1px solid #F5E1E5' }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle2" sx={{ color: '#7A6069', fontWeight: 600 }}>သတ်မှတ်စျေးနှုန်း</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#2D1520', fontWeight: 800 }}>{Number(detailItem.price).toLocaleString()} MMK</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5E1E5' }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ color: '#7A6069', fontWeight: 600 }}>လက်ကျန်အရေအတွက်</Typography>
                    <Typography variant="body2" sx={{ color: detailItem.stock < 5 ? '#2563EB' : '#2D1520', fontWeight: 800 }}>
                      {Math.floor(detailItem.stock)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" gap={1.5} mt={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<EditIcon />}
                  onClick={() => openEditDialog(detailItem)}
                  sx={{
                    height: 44,
                    fontSize: 13,
                    borderRadius: "8px",
                    color: "#2563EB",
                    borderColor: "#F5E1E5",
                    fontWeight: 700,
                    textTransform: "none",
                    backgroundColor: "#ffffff",
                    "&:hover": { borderColor: "#2563EB", backgroundColor: "#EBF2FF" }
                  }}
                >
                  ပြင်ဆင်ရန်
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<DeleteIcon />}
                  onClick={(e) => openDeleteDialog(detailItem._id || detailItem.id, e)}
                  sx={{
                    height: 44,
                    fontSize: 13,
                    borderRadius: "8px",
                    color: "#D32F2F",
                    borderColor: "#F5E1E5",
                    fontWeight: 700,
                    textTransform: "none",
                    backgroundColor: "#ffffff",
                    "&:hover": { borderColor: "#D32F2F", backgroundColor: "#FFEBEE" }
                  }}
                >
                  ပယ်ဖျက်ရန်
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: '#F5E1E5' }} />
        <DialogActions sx={{ p: 2, px: 2.5 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setDetailItem(null)}
            sx={{ height: 40, borderRadius: '8px', bgcolor: '#2D1520', color: '#ffffff', fontWeight: 700, boxShadow: "none", '&:hover': { bgcolor: '#1A0B13', boxShadow: "none" } }}
          >
            ပိတ်မည်
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        onClick={openAddDialog}
        disabled={isSubmitting}
        sx={{
          position: "fixed",
          bottom: 80,
          right: 20,
          zIndex: 1100,
          bgcolor: "#2D1520",
          color: "#ffffff",
          boxShadow: "none",
          "&:hover": { bgcolor: "#1A0B13" },
          "&.Mui-disabled": { bgcolor: "#C4A3AF", color: "#ffffff" }
        }}
      >
        <AddIcon />
      </Fab>



      <Dialog open={dialogOpen} onClose={() => !isSubmitting && setDialogOpen(false)} fullWidth PaperProps={{ sx: { boxShadow: "none", border: "1px solid #F5E1E5", borderRadius: "12px" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#2D1520", fontSize: "1.1rem", pb: 1 }}>
          {editItem ? "အချက်အလက်ပြင်ဆင်ရန်" : "ပစ္စည်းအသစ်ထည့်ရန်"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Avatar
                src={imagePreview || undefined}
                variant="square"
                sx={{ width: '100%', height: 200, borderRadius: "8px", bgcolor: "#FDF8F9", border: "1px solid #F5E1E5", color: "#C4A3AF" }}
              >
                {!imagePreview && <CloudUploadIcon sx={{ fontSize: 40 }} />}
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                sx={{ color: "#2563EB", borderColor: "#F5E1E5", textTransform: "none", fontWeight: 700, "&:hover": { borderColor: "#C4A3AF", bgcolor: "#FDF8F9" } }}
              >
                ပုံတင်ရန် ရွေးချယ်ပါ
              </Button>
            </Box>

            <TextField label="ပစ္စည်းအမည်" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required size="medium" disabled={isSubmitting} />
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField label="တန်ဖိုး (MMK)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth required size="medium" disabled={isSubmitting} />
              <TextField label="အရေအတွက်" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} fullWidth required size="medium" disabled={isSubmitting} />
            </Box>
            <TextField label="အုပ်စု အမျိုးအစား (Category)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth size="medium" disabled={isSubmitting} />

           

            <TextField label="SKU ကုဒ်နံပါတ်" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} fullWidth size="medium" disabled={isSubmitting} placeholder="ချန်လှပ်ထားပါက စနစ်မှ အလိုအလျောက်ထုတ်ပေးပါမည်" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={isSubmitting} sx={{ color: "#7A6069", fontWeight: 700 }}>
            ပယ်ဖျက်ရန်
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={isSubmitting} sx={{ bgcolor: "#2563EB", color: "#ffffff", boxShadow: "none", fontWeight: 700, "&:hover": { bgcolor: "#1D4ED8" } }}>
            {isSubmitting ? <CircularProgress size={24} sx={{ color: "white" }} /> : (editItem ? "ပြင်ဆင်မည်" : "ထည့်ရန်")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onClose={() => !isSubmitting && setDeleteConfirmId(null)}>
        <DialogTitle sx={{ fontWeight: 800, color: "#2D1520" }}>ပစ္စည်းပယ်ဖျက်ရန်</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#7A6069", fontWeight: 600 }}>
            ဤပစ္စည်းကို စနစ်အတွင်းမှ အပြီးတိုင် ပယ်ဖျက်လိုပါသလား။
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setDeleteConfirmId(null)} disabled={isSubmitting} sx={{ color: "#7A6069", fontWeight: 700 }}>
            မလုပ်တော့ပါ
          </Button>
          <Button variant="contained" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} disabled={isSubmitting} sx={{ bgcolor: "#2563EB", color: "#ffffff", boxShadow: "none", fontWeight: 700, "&:hover": { bgcolor: "#1D4ED8" } }}>
            {isSubmitting ? <CircularProgress size={24} sx={{ color: "white" }} /> : "ပယ်ဖျက်မည်"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ width: "100%", fontWeight: 700, borderRadius: "8px", boxShadow: "none" }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}




















