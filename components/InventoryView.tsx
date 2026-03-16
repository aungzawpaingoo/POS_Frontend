// "use client"

// import { useState } from "react"
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   IconButton,
//   Chip,
//   TextField,
//   InputAdornment,
//   Fab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   MenuItem,
//   Snackbar,
//   Alert,
//   Divider,
// } from "@mui/material"
// import SearchIcon from "@mui/icons-material/Search"
// import AddIcon from "@mui/icons-material/Add"
// import EditIcon from "@mui/icons-material/Edit"
// import DeleteIcon from "@mui/icons-material/Delete"
// import InventoryIcon from "@mui/icons-material/Inventory2Outlined"
// import CategoryIcon from "@mui/icons-material/CategoryOutlined"
// import { useAppState, type Product } from "@/lib/store"

// const categories = ["Skincare", "Makeup", "Fragrance", "Hair Care", "Body Care", "Tools"]

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
//   category: "Skincare",
//   sku: "",
// }

// export default function InventoryView() {
//   const { state, dispatch } = useAppState()
//   const [search, setSearch] = useState("")
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [editProduct, setEditProduct] = useState<Product | null>(null)
//   const [form, setForm] = useState<ProductFormData>(defaultFormData)
//   const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
//   const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
//     open: false,
//     message: "",
//     severity: "success",
//   })
//   const [filterCategory, setFilterCategory] = useState<string>("All")

//   const filteredProducts = state.products.filter((p) => {
//     const matchesSearch =
//       p.name.toLowerCase().includes(search.toLowerCase()) ||
//       p.sku.toLowerCase().includes(search.toLowerCase())
//     const matchesCategory = filterCategory === "All" || p.category === filterCategory
//     return matchesSearch && matchesCategory
//   })

//   const totalStock = state.products.reduce((sum, p) => sum + p.stock, 0)
//   const totalValue = state.products.reduce((sum, p) => sum + p.price * p.stock, 0)
//   const lowStockCount = state.products.filter((p) => p.stock < 20).length

//   const allCategories = ["All", ...Array.from(new Set(state.products.map((p) => p.category)))]

//   function openAddDialog() {
//     setEditProduct(null)
//     setForm(defaultFormData)
//     setDialogOpen(true)
//   }

//   function openEditDialog(product: Product) {
//     setEditProduct(product)
//     setForm({
//       name: product.name,
//       price: product.price.toString(),
//       stock: product.stock.toString(),
//       category: product.category,
//       sku: product.sku,
//     })
//     setDialogOpen(true)
//   }

//   function handleSave() {
//     if (!form.name.trim() || !form.price || !form.stock) {
//       setSnackbar({ open: true, message: "Please fill all required fields", severity: "error" })
//       return
//     }

//     if (editProduct) {
//       dispatch({
//         type: "UPDATE_PRODUCT",
//         payload: {
//           id: editProduct.id,
//           name: form.name.trim(),
//           price: parseFloat(form.price),
//           stock: parseInt(form.stock, 10),
//           category: form.category,
//           sku: form.sku.trim(),
//         },
//       })
//       setSnackbar({ open: true, message: "Product updated successfully", severity: "success" })
//     } else {
//       dispatch({
//         type: "ADD_PRODUCT",
//         payload: {
//           name: form.name.trim(),
//           price: parseFloat(form.price),
//           stock: parseInt(form.stock, 10),
//           category: form.category,
//           sku: form.sku.trim() || `SKU-${Date.now().toString(36).toUpperCase()}`,
//         },
//       })
//       setSnackbar({ open: true, message: "Product added successfully", severity: "success" })
//     }
//     setDialogOpen(false)
//   }

//   function handleDelete(id: string) {
//     dispatch({ type: "DELETE_PRODUCT", payload: id })
//     setDeleteConfirm(null)
//     setSnackbar({ open: true, message: "Product deleted", severity: "info" })
//   }

//   function getStockColor(stock: number): "success" | "warning" | "error" {
//     if (stock >= 50) return "success"
//     if (stock >= 20) return "warning"
//     return "error"
//   }

//   return (
//     <Box sx={{ pb: 2 }}>
//       {/* Summary Cards */}
//       <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, overflowX: "auto", px: 0.5, pb: 0.5 }}>
//         <Card
//           sx={{
//             minWidth: 130,
//             flex: 1,
//             background: "linear-gradient(135deg, #B5436E 0%, #8C2A52 100%)",
//             color: "white",
//             border: "none",
//           }}
//         >
//           <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
//             <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 500 }}>
//               Total Products
//             </Typography>
//             <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
//               {state.products.length}
//             </Typography>
//           </CardContent>
//         </Card>
//         <Card
//           sx={{
//             minWidth: 130,
//             flex: 1,
//             background: "linear-gradient(135deg, #2D8B6F 0%, #1E6B53 100%)",
//             color: "white",
//             border: "none",
//           }}
//         >
//           <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
//             <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 500 }}>
//               Total Stock
//             </Typography>
//             <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
//               {totalStock.toLocaleString()}
//             </Typography>
//           </CardContent>
//         </Card>
//         <Card
//           sx={{
//             minWidth: 130,
//             flex: 1,
//             background: lowStockCount > 0
//               ? "linear-gradient(135deg, #C93545 0%, #A12636 100%)"
//               : "linear-gradient(135deg, #7A6069 0%, #5D4A52 100%)",
//             color: "white",
//             border: "none",
//           }}
//         >
//           <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
//             <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 500 }}>
//               Low Stock
//             </Typography>
//             <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
//               {lowStockCount}
//             </Typography>
//           </CardContent>
//         </Card>
//       </Box>

//       {/* Stock Value Banner */}
//       <Box
//         sx={{
//           bgcolor: "#F1F5F9",
//           borderRadius: 3,
//           p: 2,
//           mb: 2.5,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//           <InventoryIcon sx={{ color: "#B5436E", fontSize: 22 }} />
//           <Typography variant="body2" color="text.secondary" fontWeight={500}>
//             Inventory Value
//           </Typography>
//         </Box>
//         <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2D1520" }}>
//           ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </Typography>
//       </Box>

//       {/* Search */}
//       <TextField
//         fullWidth
//         size="small"
//         placeholder="Search products or SKU..."
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
//               ...(filterCategory !== cat && {
//                 borderColor: "#F5E1E5",
//                 color: "#7A6069",
//               }),
//             }}
//           />
//         ))}
//       </Box>

//       {/* Product List */}
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
//         {filteredProducts.length === 0 ? (
//           <Box sx={{ textAlign: "center", py: 6 }}>
//             <CategoryIcon sx={{ fontSize: 48, color: "#F5E1E5", mb: 1 }} />
//             <Typography color="text.secondary">No products found</Typography>
//           </Box>
//         ) : (
//           filteredProducts.map((product) => (
//             <Card key={product.id} sx={{ transition: "box-shadow 0.2s", "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" } }}>
//               <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
//                 <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//                   <Box sx={{ flex: 1, minWidth: 0 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
//                       <Typography
//                         variant="subtitle2"
//                         sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
//                       >
//                         {product.name}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
//                       <Typography variant="caption" sx={{ color: "#C4A3AF", fontFamily: "monospace" }}>
//                         {product.sku}
//                       </Typography>
//                       <Chip
//                         label={product.category}
//                         size="small"
//                         sx={{
//                           fontSize: "0.65rem",
//                           height: 22,
//           bgcolor: "#FDF2F4",
//                           color: "#7A6069",                          fontWeight: 500,
//                         }}
//                       />
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                       <Typography variant="body1" sx={{ fontWeight: 700, color: "#2D1520" }}>
//                         ${product.price.toFixed(2)}
//                       </Typography>
//                       <Chip
//                         label={`${product.stock} in stock`}
//                         size="small"
//                         color={getStockColor(product.stock)}
//                         sx={{ fontSize: "0.7rem", height: 24, fontWeight: 600 }}
//                       />
//                     </Box>
//                   </Box>
//                   <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
//                     <IconButton size="small" onClick={() => openEditDialog(product)} sx={{ color: "#B5436E" }}>
//                       <EditIcon fontSize="small" />
//                     </IconButton>
//                     <IconButton size="small" onClick={() => setDeleteConfirm(product.id)} sx={{ color: "#C93545" }}>
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </Box>

//       {/* FAB for adding */}
//       <Fab
//         color="primary"
//         onClick={openAddDialog}
//         sx={{ position: "fixed", bottom: 84, right: 20, zIndex: 1000 }}
//         aria-label="Add product"
//       >
//         <AddIcon />
//       </Fab>

//       {/* Add/Edit Dialog */}
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
//         <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem", pb: 1 }}>
//           {editProduct ? "Edit Product" : "Add New Product"}
//         </DialogTitle>
//         <Divider />
//         <DialogContent sx={{ pt: 2.5 }}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//             <TextField
//               label="Product Name"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               fullWidth
//               required
//               size="small"
//             />
//             <Box sx={{ display: "flex", gap: 1.5 }}>
//               <TextField
//                 label="Price"
//                 type="number"
//                 value={form.price}
//                 onChange={(e) => setForm({ ...form, price: e.target.value })}
//                 fullWidth
//                 required
//                 size="small"
//                 slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
//               />
//               <TextField
//                 label="Stock"
//                 type="number"
//                 value={form.stock}
//                 onChange={(e) => setForm({ ...form, stock: e.target.value })}
//                 fullWidth
//                 required
//                 size="small"
//               />
//             </Box>
//             <TextField
//               select
//               label="Category"
//               value={form.category}
//               onChange={(e) => setForm({ ...form, category: e.target.value })}
//               fullWidth
//               size="small"
//             >
//               {categories.map((c) => (
//                 <MenuItem key={c} value={c}>
//                   {c}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               label="SKU (auto-generated if empty)"
//               value={form.sku}
//               onChange={(e) => setForm({ ...form, sku: e.target.value })}
//               fullWidth
//               size="small"
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
//           <Button onClick={() => setDialogOpen(false)} sx={{ color: "#7A6069" }}>
//             Cancel
//           </Button>
//           <Button variant="contained" onClick={handleSave}>
//             {editProduct ? "Update" : "Add Product"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation */}
//       <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
//         <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Delete Product?</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" color="text.secondary">
//             This will permanently remove this product from your inventory and any active cart.
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
//           <Button onClick={() => setDeleteConfirm(null)} sx={{ color: "#7A6069" }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

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

import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import InventoryIcon from "@mui/icons-material/Inventory2Outlined"
import CategoryIcon from "@mui/icons-material/CategoryOutlined"
import { useAppState, type Product } from "@/lib/store"

const categories = ["Skincare", "Makeup", "Fragrance", "Hair Care", "Body Care", "Tools"]

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
  category: "Skincare",
  sku: "",
}

export default function InventoryView() {
  const { state, dispatch, createProduct, updateProduct, deleteProduct } = useAppState()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductFormData>(defaultFormData)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "success",
  })
  const [filterCategory, setFilterCategory] = useState<string>("All")

  const filteredProducts = state.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === "All" || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalStock = state.products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = state.products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const lowStockCount = state.products.filter((p) => p.stock < 20).length

  const allCategories = ["All", ...Array.from(new Set(state.products.map((p) => p.category)))]

  function openAddDialog() {
    setEditProduct(null)
    setForm(defaultFormData)
    setDialogOpen(true)
  }

  function openEditDialog(product: Product) {
    setEditProduct(product)
    setForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      sku: product.sku,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price || !form.stock) {
      setSnackbar({ open: true, message: "Please fill all required fields", severity: "error" })
      return
    }

    setIsSubmitting(true)
    try {
      if (editProduct) {
        await updateProduct({
          id: editProduct.id,
          name: form.name.trim(),
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
          category: form.category,
          sku: form.sku.trim(),
        })
        setSnackbar({ open: true, message: "Product updated successfully", severity: "success" })
      } else {
        await createProduct({
          name: form.name.trim(),
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
          category: form.category,
          sku: form.sku.trim() || `SKU-${Date.now().toString(36).toUpperCase()}`,
        })
        setSnackbar({ open: true, message: "Product added successfully", severity: "success" })
      }
      setDialogOpen(false)
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : "Operation failed", 
        severity: "error" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setIsSubmitting(true)
    try {
      await deleteProduct(id)
      setDeleteConfirm(null)
      setSnackbar({ open: true, message: "Product deleted", severity: "info" })
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : "Delete failed", 
        severity: "error" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function getStockColor(stock: number): "success" | "warning" | "error" {
    if (stock >= 50) return "success"
    if (stock >= 20) return "warning"
    return "error"
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
      {/* Summary Cards */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, overflowX: "auto", px: 0.5, pb: 0.5 }}>
        <Card
          sx={{
            minWidth: 130,
            flex: 1,
            // background: "linear-gradient(135deg, #B5436E 0%, #8C2A52 100%)",
            background: "linear-gradient(135deg, #B5436E 0%, #8C2A52 100%)",
            borderRadius:0.3,
            color: "white",
            border: "none",
          }}
        >
          <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
            <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 500 }}>
              Total Products
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
              {state.products.length}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 130,
            flex: 1,
            background: "black",
            color: "white",
            borderRadius:0.3,
            border: "none",
          }}
        >
          <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
            <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 500 }}>
              Total Stock
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
              {totalStock.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        {/* <Card
          sx={{
            minWidth: 130,
            flex: 1,
            background: lowStockCount > 0
              ? "linear-gradient(135deg, #C93545 0%, #A12636 100%)"
              : "linear-gradient(135deg, #7A6069 0%, #5D4A52 100%)",
            color: "white",
            borderRadius:0.3,
            border: "none",
          }}
        >
          <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
            <Typography variant="caption" sx={{ opacity: 0.85, fontSize: "0.7rem", fontWeight: 500 }}>
              Low Stock
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}>
              {lowStockCount}
            </Typography>
          </CardContent>
        </Card> */}
      </Box>

      {/* Stock Value Banner */}
      <Box
        sx={{
          bgcolor: "#F1F5F9",
          borderRadius: 3,
          p: 2,
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <InventoryIcon sx={{ color: "#B5436E", fontSize: 22 }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Inventory Value
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2D1520" }}>
          MMK{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search products or SKU..."
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
              ...(filterCategory !== cat && {
                borderColor: "#F5E1E5",
                color: "#7A6069",
              }),
            }}
          />
        ))}
      </Box>

      {/* Product List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <CategoryIcon sx={{ fontSize: 48, color: "#F5E1E5", mb: 1 }} />
            <Typography color="text.secondary">No products found</Typography>
          </Box>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} sx={{ transition: "box-shadow 0.2s", "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" } }}>
              <CardContent sx={{ p: "14px !important", "&:last-child": { pb: "14px !important" } }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      >
                        {product.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Typography variant="caption" sx={{ color: "#C4A3AF", fontFamily: "monospace" }}>
                        {product.sku}
                      </Typography>
                      <Chip
                        label={product.category}
                        size="small"
                        sx={{
                          fontSize: "0.65rem",
                          height: 22,
                          bgcolor: "#FDF2F4",
                          color: "#7A6069",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: "#2D1520" }}>
                        MMK{product.price.toFixed(2)}
                      </Typography>
                      <Chip
                        label={`${product.stock} in stock`}
                        size="small"
                        color={getStockColor(product.stock)}
                        sx={{ fontSize: "0.7rem", height: 24, fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                    <IconButton size="small" onClick={() => openEditDialog(product)} sx={{ color: "#B5436E" }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteConfirm(product.id)} sx={{ color: "#C93545" }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* FAB for adding */}
      <Fab
        color="primary"
        onClick={openAddDialog}
        disabled={isSubmitting}
        sx={{ position: "fixed", bottom: 84, right: 20, zIndex: 1000 }}
        aria-label="Add product"
      >
        <AddIcon />
      </Fab>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => !isSubmitting && setDialogOpen(false)} fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem", pb: 1 }}>
          {editProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
              required
              size="small"
              disabled={isSubmitting}
            />
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                fullWidth
                required
                size="small"
                disabled={isSubmitting}
                slotProps={{ input: { startAdornment: <InputAdornment position="start">MMK</InputAdornment> } }}
              />
              <TextField
                label="Stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                fullWidth
                required
                size="small"
                disabled={isSubmitting}
              />
            </Box>
            <TextField
              select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              fullWidth
              size="small"
              disabled={isSubmitting}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="SKU (auto-generated if empty)"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              fullWidth
              size="small"
              disabled={isSubmitting}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={isSubmitting} sx={{ color: "#7A6069" }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : (editProduct ? "Update" : "Add Product")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onClose={() => !isSubmitting && setDeleteConfirm(null)}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently remove this product from your inventory and any active cart.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setDeleteConfirm(null)} disabled={isSubmitting} sx={{ color: "#7A6069" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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