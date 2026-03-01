// "use client"

// import {
//   createContext,
//   useContext,
//   useReducer,
//   type ReactNode,
//   type Dispatch,
// } from "react"

// // --- Types ---
// export interface Product {
//   id: string
//   name: string
//   price: number
//   stock: number
//   category: string
//   sku: string
// }

// export interface CartItem {
//   product: Product
//   quantity: number
// }

// export interface SaleRecord {
//   id: string
//   items: CartItem[]
//   total: number
//   date: string
// }

// interface AppState {
//   products: Product[]
//   cart: CartItem[]
//   sales: SaleRecord[]
// }

// // --- Actions ---
// type Action =
//   | { type: "ADD_PRODUCT"; payload: Omit<Product, "id"> }
//   | { type: "UPDATE_PRODUCT"; payload: Product }
//   | { type: "DELETE_PRODUCT"; payload: string }
//   | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
//   | { type: "REMOVE_FROM_CART"; payload: string }
//   | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
//   | { type: "CLEAR_CART" }
//   | { type: "COMPLETE_SALE" }

// // --- Helpers ---
// function generateId(): string {
//   return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
// }

// // --- Initial State with sample data ---
// const initialState: AppState = {
//   products: [
//     { id: "p1", name: "Hydrating Face Serum", price: 34.99, stock: 40, category: "Skincare", sku: "SK-001" },
//     { id: "p2", name: "Vitamin C Moisturizer", price: 28.50, stock: 55, category: "Skincare", sku: "SK-002" },
//     { id: "p3", name: "Retinol Night Cream", price: 42.00, stock: 30, category: "Skincare", sku: "SK-003" },
//     { id: "p4", name: "SPF 50 Sunscreen", price: 18.99, stock: 90, category: "Skincare", sku: "SK-004" },
//     { id: "p5", name: "Matte Lipstick - Rose", price: 16.50, stock: 70, category: "Makeup", sku: "MK-001" },
//     { id: "p6", name: "Liquid Foundation", price: 32.00, stock: 50, category: "Makeup", sku: "MK-002" },
//     { id: "p7", name: "Mascara - Volumizing", price: 14.99, stock: 85, category: "Makeup", sku: "MK-003" },
//     { id: "p8", name: "Eyeshadow Palette", price: 38.00, stock: 25, category: "Makeup", sku: "MK-004" },
//     { id: "p9", name: "Setting Spray", price: 19.99, stock: 60, category: "Makeup", sku: "MK-005" },
//     { id: "p10", name: "Floral Eau de Parfum", price: 58.00, stock: 20, category: "Fragrance", sku: "FR-001" },
//     { id: "p11", name: "Body Mist - Vanilla", price: 22.50, stock: 45, category: "Fragrance", sku: "FR-002" },
//     { id: "p12", name: "Argan Hair Oil", price: 24.99, stock: 35, category: "Hair Care", sku: "HC-001" },
//     { id: "p13", name: "Keratin Shampoo", price: 15.99, stock: 65, category: "Hair Care", sku: "HC-002" },
//     { id: "p14", name: "Shea Body Butter", price: 20.00, stock: 50, category: "Body Care", sku: "BC-001" },
//     { id: "p15", name: "Exfoliating Body Scrub", price: 18.50, stock: 40, category: "Body Care", sku: "BC-002" },
//     { id: "p16", name: "Makeup Brush Set (12pc)", price: 29.99, stock: 15, category: "Tools", sku: "TL-001" },
//     { id: "p17", name: "Beauty Blender Sponge", price: 8.99, stock: 100, category: "Tools", sku: "TL-002" },
//     { id: "p18", name: "Micellar Cleansing Water", price: 12.99, stock: 75, category: "Skincare", sku: "SK-005" },
//   ],
//   cart: [],
//   sales: [],
// }

// // --- Reducer ---
// function appReducer(state: AppState, action: Action): AppState {
//   switch (action.type) {
//     case "ADD_PRODUCT":
//       return {
//         ...state,
//         products: [
//           ...state.products,
//           { ...action.payload, id: generateId() },
//         ],
//       }

//     case "UPDATE_PRODUCT":
//       return {
//         ...state,
//         products: state.products.map((p) =>
//           p.id === action.payload.id ? action.payload : p
//         ),
//       }

//     case "DELETE_PRODUCT":
//       return {
//         ...state,
//         products: state.products.filter((p) => p.id !== action.payload),
//         cart: state.cart.filter((item) => item.product.id !== action.payload),
//       }

//     case "ADD_TO_CART": {
//       const product = state.products.find(
//         (p) => p.id === action.payload.productId
//       )
//       if (!product) return state

//       const existingItem = state.cart.find(
//         (item) => item.product.id === action.payload.productId
//       )
//       const currentQty = existingItem ? existingItem.quantity : 0
//       const newQty = currentQty + action.payload.quantity

//       if (newQty > product.stock) return state

//       if (existingItem) {
//         return {
//           ...state,
//           cart: state.cart.map((item) =>
//             item.product.id === action.payload.productId
//               ? { ...item, quantity: newQty }
//               : item
//           ),
//         }
//       }

//       return {
//         ...state,
//         cart: [...state.cart, { product, quantity: action.payload.quantity }],
//       }
//     }

//     case "REMOVE_FROM_CART":
//       return {
//         ...state,
//         cart: state.cart.filter(
//           (item) => item.product.id !== action.payload
//         ),
//       }

//     case "UPDATE_CART_QUANTITY": {
//       const product = state.products.find(
//         (p) => p.id === action.payload.productId
//       )
//       if (!product) return state
//       if (action.payload.quantity > product.stock) return state
//       if (action.payload.quantity <= 0) {
//         return {
//           ...state,
//           cart: state.cart.filter(
//             (item) => item.product.id !== action.payload.productId
//           ),
//         }
//       }
//       return {
//         ...state,
//         cart: state.cart.map((item) =>
//           item.product.id === action.payload.productId
//             ? { ...item, quantity: action.payload.quantity }
//             : item
//         ),
//       }
//     }

//     case "CLEAR_CART":
//       return { ...state, cart: [] }

//     case "COMPLETE_SALE": {
//       if (state.cart.length === 0) return state

//       const saleTotal = state.cart.reduce(
//         (sum, item) => sum + item.product.price * item.quantity,
//         0
//       )

//       const sale: SaleRecord = {
//         id: generateId(),
//         items: [...state.cart],
//         total: saleTotal,
//         date: new Date().toISOString(),
//       }

//       const updatedProducts = state.products.map((product) => {
//         const cartItem = state.cart.find(
//           (item) => item.product.id === product.id
//         )
//         if (cartItem) {
//           return { ...product, stock: product.stock - cartItem.quantity }
//         }
//         return product
//       })

//       return {
//         ...state,
//         products: updatedProducts,
//         cart: [],
//         sales: [sale, ...state.sales],
//       }
//     }

//     default:
//       return state
//   }
// }

// // --- Context ---
// const AppContext = createContext<{
//   state: AppState
//   dispatch: Dispatch<Action>
// } | null>(null)

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(appReducer, initialState)

//   return (
//     <AppContext.Provider value={{ state, dispatch }}>
//       {children}
//     </AppContext.Provider>
//   )
// }

// export function useAppState() {
//   const ctx = useContext(AppContext)
//   if (!ctx) throw new Error("useAppState must be used within AppProvider")
//   return ctx
// }








// "use client"

// import {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   type ReactNode,
//   type Dispatch,
// } from "react"

// // --- Types ---
// export interface Product {
//   id: string
//   name: string
//   price: number
//   stock: number
//   category: string
//   sku: string
// }

// export interface CartItem {
//   product: Product
//   quantity: number
// }

// export interface SaleRecord {
//   id: string
//   items: CartItem[]
//   total: number
//   date: string
// }

// interface AppState {
//   products: Product[]
//   cart: CartItem[]
//   sales: SaleRecord[]
//   isLoading: boolean
//   error: string | null
// }

// // --- Actions ---
// type Action =
//   | { type: "SET_LOADING"; payload: boolean }
//   | { type: "SET_ERROR"; payload: string | null }
//   | { type: "SET_PRODUCTS"; payload: Product[] }
//   | { type: "ADD_PRODUCT"; payload: Product }
//   | { type: "UPDATE_PRODUCT"; payload: Product }
//   | { type: "DELETE_PRODUCT"; payload: string }
//   | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
//   | { type: "REMOVE_FROM_CART"; payload: string }
//   | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
//   | { type: "CLEAR_CART" }
//   | { type: "COMPLETE_SALE"; payload: SaleRecord }
//   | { type: "SET_SALES"; payload: SaleRecord[] }

// // --- Helpers ---
// function generateId(): string {
//   return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
// }

// // --- Initial State (empty) ---
// const initialState: AppState = {
//   products: [],
//   cart: [],
//   sales: [],
//   isLoading: false,
//   error: null,
// }

// // --- Reducer ---
// function appReducer(state: AppState, action: Action): AppState {
//   switch (action.type) {
//     case "SET_LOADING":
//       return { ...state, isLoading: action.payload }
    
//     case "SET_ERROR":
//       return { ...state, error: action.payload }
    
//     case "SET_PRODUCTS":
//       return { ...state, products: action.payload }
    
//     case "ADD_PRODUCT":
//       return {
//         ...state,
//         products: [...state.products, action.payload],
//       }

//     case "UPDATE_PRODUCT":
//       return {
//         ...state,
//         products: state.products.map((p) =>
//           p.id === action.payload.id ? action.payload : p
//         ),
//       }

//     case "DELETE_PRODUCT":
//       return {
//         ...state,
//         products: state.products.filter((p) => p.id !== action.payload),
//         cart: state.cart.filter((item) => item.product.id !== action.payload),
//       }

//     case "ADD_TO_CART": {
//       const product = state.products.find(
//         (p) => p.id === action.payload.productId
//       )
//       if (!product) return state

//       const existingItem = state.cart.find(
//         (item) => item.product.id === action.payload.productId
//       )
//       const currentQty = existingItem ? existingItem.quantity : 0
//       const newQty = currentQty + action.payload.quantity

//       if (newQty > product.stock) return state

//       if (existingItem) {
//         return {
//           ...state,
//           cart: state.cart.map((item) =>
//             item.product.id === action.payload.productId
//               ? { ...item, quantity: newQty }
//               : item
//           ),
//         }
//       }

//       return {
//         ...state,
//         cart: [...state.cart, { product, quantity: action.payload.quantity }],
//       }
//     }

//     case "REMOVE_FROM_CART":
//       return {
//         ...state,
//         cart: state.cart.filter(
//           (item) => item.product.id !== action.payload
//         ),
//       }

//     case "UPDATE_CART_QUANTITY": {
//       const product = state.products.find(
//         (p) => p.id === action.payload.productId
//       )
//       if (!product) return state
//       if (action.payload.quantity > product.stock) return state
//       if (action.payload.quantity <= 0) {
//         return {
//           ...state,
//           cart: state.cart.filter(
//             (item) => item.product.id !== action.payload.productId
//           ),
//         }
//       }
//       return {
//         ...state,
//         cart: state.cart.map((item) =>
//           item.product.id === action.payload.productId
//             ? { ...item, quantity: action.payload.quantity }
//             : item
//         ),
//       }
//     }

//     case "CLEAR_CART":
//       return { ...state, cart: [] }

//     case "COMPLETE_SALE": {
//       // Update product stock
//       const updatedProducts = state.products.map((product) => {
//         const cartItem = state.cart.find(
//           (item) => item.product.id === product.id
//         )
//         if (cartItem) {
//           return { ...product, stock: product.stock - cartItem.quantity }
//         }
//         return product
//       })

//       return {
//         ...state,
//         products: updatedProducts,
//         cart: [],
//         sales: [action.payload, ...state.sales],
//       }
//     }

//     case "SET_SALES":
//       return { ...state, sales: action.payload }

//     default:
//       return state
//   }
// }

// // --- Context ---
// const AppContext = createContext<{
//   state: AppState
//   dispatch: Dispatch<Action>
//   fetchProducts: () => Promise<void>
//   fetchSales: () => Promise<void>
//   createProduct: (product: Omit<Product, "id">) => Promise<void>
//   updateProduct: (product: Product) => Promise<void>
//   deleteProduct: (id: string) => Promise<void>
//   completeSale: (saleData: Omit<SaleRecord, "id">) => Promise<void>
// } | null>(null)

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(appReducer, initialState)

//   // API Base URL - change this to your backend URL
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

//   // Fetch products from backend
//   const fetchProducts = async () => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const response = await fetch(`${API_BASE_URL}/products`)
//       if (!response.ok) throw new Error("Failed to fetch products")
//       const data = await response.json()
//       dispatch({ type: "SET_PRODUCTS", payload: data })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to fetch products" })
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Fetch sales from backend
//   const fetchSales = async () => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const response = await fetch(`${API_BASE_URL}/sales`)
//       if (!response.ok) throw new Error("Failed to fetch sales")
//       const data = await response.json()
//       dispatch({ type: "SET_SALES", payload: data })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to fetch sales" })
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Create product
//   const createProduct = async (product: Omit<Product, "id">) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const response = await fetch(`${API_BASE_URL}/products`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(product),
//       })
//       if (!response.ok) throw new Error("Failed to create product")
//       const newProduct = await response.json()
//       dispatch({ type: "ADD_PRODUCT", payload: newProduct })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to create product" })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Update product
//   const updateProduct = async (product: Product) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(product),
//       })
//       if (!response.ok) throw new Error("Failed to update product")
//       const updatedProduct = await response.json()
//       dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to update product" })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Delete product
//   const deleteProduct = async (id: string) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${id}`, {
//         method: "DELETE",
//       })
//       if (!response.ok) throw new Error("Failed to delete product")
//       dispatch({ type: "DELETE_PRODUCT", payload: id })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to delete product" })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Complete sale
//   const completeSale = async (saleData: Omit<SaleRecord, "id">) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const saleWithId = {
//         ...saleData,
//         id: generateId(),
//       }
      
//       const response = await fetch(`${API_BASE_URL}/sales`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(saleWithId),
//       })
      
//       if (!response.ok) throw new Error("Failed to create sale")
      
//       // Update product stock in backend
//       for (const item of saleData.items) {
//         await fetch(`${API_BASE_URL}/products/${item.product.id}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             stock: item.product.stock - item.quantity
//           }),
//         })
//       }
      
//       dispatch({ type: "COMPLETE_SALE", payload: saleWithId })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to complete sale" })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Load initial data
//   useEffect(() => {
//     fetchProducts()
//     fetchSales()
//   }, [])

//   return (
//     <AppContext.Provider value={{
//       state,
//       dispatch,
//       fetchProducts,
//       fetchSales,
//       createProduct,
//       updateProduct,
//       deleteProduct,
//       completeSale,
//     }}>
//       {children}
//     </AppContext.Provider>
//   )
// }

// export function useAppState() {
//   const ctx = useContext(AppContext)
//   if (!ctx) throw new Error("useAppState must be used within AppProvider")
//   return ctx
// }






// "use client"

// import {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   type ReactNode,
//   type Dispatch,
// } from "react"

// // --- Types ---
// export interface Product {
//   id: string
//   name: string
//   price: number
//   stock: number
//   category: string
//   sku: string
// }

// export interface CartItem {
//   product: Product
//   quantity: number
// }

// export interface SaleRecord {
//   id: string
//   items: CartItem[]
//   total: number
//   date: string
// }

// interface AppState {
//   products: Product[]
//   cart: CartItem[]
//   sales: SaleRecord[]
//   isLoading: boolean
//   error: string | null
// }

// // --- Actions ---
// type Action =
//   | { type: "SET_LOADING"; payload: boolean }
//   | { type: "SET_ERROR"; payload: string | null }
//   | { type: "SET_PRODUCTS"; payload: Product[] }
//   | { type: "ADD_PRODUCT"; payload: Product }
//   | { type: "UPDATE_PRODUCT"; payload: Product }
//   | { type: "DELETE_PRODUCT"; payload: string }
//   | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
//   | { type: "REMOVE_FROM_CART"; payload: string }
//   | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
//   | { type: "CLEAR_CART" }
//   | { type: "COMPLETE_SALE"; payload: SaleRecord }
//   | { type: "SET_SALES"; payload: SaleRecord[] }

// // --- Helpers ---
// function generateId(): string {
//   return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
// }

// // --- Initial State (empty) ---
// const initialState: AppState = {
//   products: [],
//   cart: [],
//   sales: [],
//   isLoading: false,
//   error: null,
// }

// // --- Reducer ---
// function appReducer(state: AppState, action: Action): AppState {
//   switch (action.type) {
//     case "SET_LOADING":
//       return { ...state, isLoading: action.payload }
    
//     case "SET_ERROR":
//       return { ...state, error: action.payload }
    
//     case "SET_PRODUCTS":
//       return { ...state, products: action.payload }
    
//     case "ADD_PRODUCT":
//       return {
//         ...state,
//         products: [...state.products, action.payload],
//       }

//     case "UPDATE_PRODUCT":
//       return {
//         ...state,
//         products: state.products.map((p) =>
//           p.id === action.payload.id ? action.payload : p
//         ),
//       }

//     case "DELETE_PRODUCT":
//       return {
//         ...state,
//         products: state.products.filter((p) => p.id !== action.payload),
//         cart: state.cart.filter((item) => item.product.id !== action.payload),
//       }

//     case "ADD_TO_CART": {
//       console.log('ADD_TO_CART:', action.payload); // Debug log
      
//       const product = state.products.find(
//         (p) => p.id === action.payload.productId
//       )
//       if (!product) {
//         console.log('Product not found:', action.payload.productId);
//         return state;
//       }

//       const existingItem = state.cart.find(
//         (item) => item.product.id === action.payload.productId
//       )
//       const currentQty = existingItem ? existingItem.quantity : 0
//       const newQty = currentQty + action.payload.quantity

//       if (newQty > product.stock) {
//         console.log('Stock exceeded:', newQty, '>', product.stock);
//         return state;
//       }

//       if (existingItem) {
//         console.log('Updating existing item:', product.id, 'new qty:', newQty);
//         return {
//           ...state,
//           cart: state.cart.map((item) =>
//             item.product.id === action.payload.productId
//               ? { ...item, quantity: newQty }
//               : item
//           ),
//         }
//       }

//       console.log('Adding new item to cart:', product.id);
//       return {
//         ...state,
//         cart: [...state.cart, { 
//           product: { ...product }, // Create a new object to avoid reference issues
//           quantity: action.payload.quantity 
//         }],
//       }
//     }

//     case "REMOVE_FROM_CART":
//       console.log('REMOVE_FROM_CART:', action.payload);
//       return {
//         ...state,
//         cart: state.cart.filter(
//           (item) => item.product.id !== action.payload
//         ),
//       }

//     case "UPDATE_CART_QUANTITY": {
//       console.log('UPDATE_CART_QUANTITY:', action.payload);
      
//       const product = state.products.find(
//         (p) => p.id === action.payload.productId
//       )
//       if (!product) {
//         console.log('Product not found for update:', action.payload.productId);
//         return state;
//       }
      
//       if (action.payload.quantity > product.stock) {
//         console.log('Quantity exceeds stock:', action.payload.quantity, '>', product.stock);
//         return state;
//       }
      
//       if (action.payload.quantity <= 0) {
//         console.log('Removing item due to zero quantity:', action.payload.productId);
//         return {
//           ...state,
//           cart: state.cart.filter(
//             (item) => item.product.id !== action.payload.productId
//           ),
//         }
//       }
      
//       console.log('Updating quantity for:', action.payload.productId, 'to:', action.payload.quantity);
//       return {
//         ...state,
//         cart: state.cart.map((item) =>
//           item.product.id === action.payload.productId
//             ? { ...item, quantity: action.payload.quantity }
//             : item
//         ),
//       }
//     }

//     case "CLEAR_CART":
//       console.log('CLEAR_CART');
//       return { ...state, cart: [] }

//     case "COMPLETE_SALE": {
//       console.log('COMPLETE_SALE:', action.payload);
      
//       // Update product stock
//       const updatedProducts = state.products.map((product) => {
//         const cartItem = state.cart.find(
//           (item) => item.product.id === product.id
//         )
//         if (cartItem) {
//           return { 
//             ...product, 
//             stock: product.stock - cartItem.quantity 
//           }
//         }
//         return product
//       })

//       return {
//         ...state,
//         products: updatedProducts,
//         cart: [],
//         sales: [action.payload, ...state.sales],
//       }
//     }

//     case "SET_SALES":
//       return { ...state, sales: action.payload }

//     default:
//       return state
//   }
// }

// // --- Context ---
// const AppContext = createContext<{
//   state: AppState
//   dispatch: Dispatch<Action>
//   fetchProducts: () => Promise<void>
//   fetchSales: () => Promise<void>
//   createProduct: (product: Omit<Product, "id">) => Promise<void>
//   updateProduct: (product: Product) => Promise<void>
//   deleteProduct: (id: string) => Promise<void>
//   completeSale: (saleData: Omit<SaleRecord, "id">) => Promise<void>
// } | null>(null)

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(appReducer, initialState)

//   // Use proxy in development, full URL in production
//   const API_BASE_URL = process.env.NODE_ENV === 'development' 
//     ? '/api'  // This will use the Next.js proxy
//     : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")

//   // Fetch products from backend
//   const fetchProducts = async () => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       console.log('Fetching products from:', `${API_BASE_URL}/products`);
//       const response = await fetch(`${API_BASE_URL}/products`)
//       if (!response.ok) throw new Error("Failed to fetch products")
//       const data = await response.json()
//       console.log('Products fetched:', data);
//       dispatch({ type: "SET_PRODUCTS", payload: data })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       console.error("Fetch products error:", error)
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to fetch products" })
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Fetch sales from backend
//   const fetchSales = async () => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       console.log('Fetching sales from:', `${API_BASE_URL}/sales`);
//       const response = await fetch(`${API_BASE_URL}/sales`)
//       if (!response.ok) throw new Error("Failed to fetch sales")
//       const data = await response.json()
//       console.log('Sales fetched:', data);
//       dispatch({ type: "SET_SALES", payload: data })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       console.error("Fetch sales error:", error)
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to fetch sales" })
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Create product
//   const createProduct = async (product: Omit<Product, "id">) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       console.log('Creating product:', product);
//       const response = await fetch(`${API_BASE_URL}/products`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(product),
//       })
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to create product")
//       }
//       const newProduct = await response.json()
//       console.log('Product created:', newProduct);
//       dispatch({ type: "ADD_PRODUCT", payload: newProduct })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       console.error("Create product error:", error)
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to create product" })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Update product
//   const updateProduct = async (product: Product) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       console.log('Updating product:', product);
//       const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(product),
//       })
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to update product")
//       }
//       const updatedProduct = await response.json()
//       console.log('Product updated:', updatedProduct);
//       dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       console.error("Update product error:", error)
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to update product" })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Delete product
//   const deleteProduct = async (id: string) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       console.log('Deleting product:', id);
//       const response = await fetch(`${API_BASE_URL}/products/${id}`, {
//         method: "DELETE",
//       })
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to delete product")
//       }
//       console.log('Product deleted:', id);
//       dispatch({ type: "DELETE_PRODUCT", payload: id })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       console.error("Delete product error:", error)
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to delete product" })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Complete sale
//   const completeSale = async (saleData: Omit<SaleRecord, "id">) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       console.log('Completing sale:', saleData);
      
//       const response = await fetch(`${API_BASE_URL}/sales`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(saleData),
//       })
      
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to create sale")
//       }
      
//       const newSale = await response.json()
//       console.log('Sale created:', newSale);
      
//       // Refresh products to get updated stock
//       await fetchProducts()
      
//       dispatch({ type: "COMPLETE_SALE", payload: newSale })
//       dispatch({ type: "SET_ERROR", payload: null })
      
//     } catch (error) {
//       console.error("Complete sale error:", error)
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to complete sale" })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Load initial data
//   useEffect(() => {
//     fetchProducts()
//     fetchSales()
//   }, [])

//   return (
//     <AppContext.Provider value={{
//       state,
//       dispatch,
//       fetchProducts,
//       fetchSales,
//       createProduct,
//       updateProduct,
//       deleteProduct,
//       completeSale,
//     }}>
//       {children}
//     </AppContext.Provider>
//   )
// }

// export function useAppState() {
//   const ctx = useContext(AppContext)
//   if (!ctx) throw new Error("useAppState must be used within AppProvider")
//   return ctx
// }












"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react"

// --- Types ---
export interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  sku: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface SaleRecord {
  id: string
  items: CartItem[]
  total: number
  date: string
}

interface AppState {
  products: Product[]
  cart: CartItem[]
  sales: SaleRecord[]
  isLoading: boolean
  error: string | null
}

// --- Actions ---
type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "COMPLETE_SALE"; payload: SaleRecord }
  | { type: "SET_SALES"; payload: SaleRecord[] }

// --- Helpers ---
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

// --- Initial State (empty) ---
const initialState: AppState = {
  products: [],
  cart: [],
  sales: [],
  isLoading: false,
  error: null,
}

// --- Reducer ---
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    
    case "SET_ERROR":
      return { ...state, error: action.payload }
    
    case "SET_PRODUCTS":
      return { ...state, products: action.payload }
    
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
      }

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      }

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
        cart: state.cart.filter((item) => item.product.id !== action.payload),
      }

    case "ADD_TO_CART": {
      console.log('ADD_TO_CART:', action.payload);
      
      const product = state.products.find(
        (p) => p.id === action.payload.productId
      )
      if (!product) {
        console.log('Product not found:', action.payload.productId);
        return state;
      }

      const existingItem = state.cart.find(
        (item) => item.product.id === action.payload.productId
      )
      const currentQty = existingItem ? existingItem.quantity : 0
      const newQty = currentQty + action.payload.quantity

      if (newQty > product.stock) {
        console.log('Stock exceeded:', newQty, '>', product.stock);
        return state;
      }

      if (existingItem) {
        console.log('Updating existing item:', product.id, 'new qty:', newQty);
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.product.id === action.payload.productId
              ? { ...item, quantity: newQty }
              : item
          ),
        }
      }

      console.log('Adding new item to cart:', product.id);
      return {
        ...state,
        cart: [...state.cart, { 
          product: { ...product },
          quantity: action.payload.quantity 
        }],
      }
    }

    case "REMOVE_FROM_CART":
      console.log('REMOVE_FROM_CART:', action.payload);
      return {
        ...state,
        cart: state.cart.filter(
          (item) => item.product.id !== action.payload
        ),
      }

    case "UPDATE_CART_QUANTITY": {
      console.log('UPDATE_CART_QUANTITY:', action.payload);
      
      const product = state.products.find(
        (p) => p.id === action.payload.productId
      )
      if (!product) {
        console.log('Product not found for update:', action.payload.productId);
        return state;
      }
      
      if (action.payload.quantity > product.stock) {
        console.log('Quantity exceeds stock:', action.payload.quantity, '>', product.stock);
        return state;
      }
      
      if (action.payload.quantity <= 0) {
        console.log('Removing item due to zero quantity:', action.payload.productId);
        return {
          ...state,
          cart: state.cart.filter(
            (item) => item.product.id !== action.payload.productId
          ),
        }
      }
      
      console.log('Updating quantity for:', action.payload.productId, 'to:', action.payload.quantity);
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }

    case "CLEAR_CART":
      console.log('CLEAR_CART');
      return { ...state, cart: [] }

    case "COMPLETE_SALE": {
      console.log('COMPLETE_SALE:', action.payload);
      
      const updatedProducts = state.products.map((product) => {
        const cartItem = state.cart.find(
          (item) => item.product.id === product.id
        )
        if (cartItem) {
          return { 
            ...product, 
            stock: product.stock - cartItem.quantity 
          }
        }
        return product
      })

      return {
        ...state,
        products: updatedProducts,
        cart: [],
        sales: [action.payload, ...state.sales],
      }
    }

    case "SET_SALES":
      return { ...state, sales: action.payload }

    default:
      return state
  }
}

// --- Context ---
const AppContext = createContext<{
  state: AppState
  dispatch: Dispatch<Action>
  fetchProducts: () => Promise<void>
  fetchSales: () => Promise<void>
  createProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  completeSale: (saleData: Omit<SaleRecord, "id">) => Promise<void>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Use proxy in development, full URL in production
  // const API_BASE_URL = process.env.NODE_ENV === 'development' 
  //   ? '/api'
  //   : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'


  // Fetch products from backend
  const fetchProducts = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      console.log('Fetching products from:', `${API_BASE_URL}/products`);
      const response = await fetch(`${API_BASE_URL}/products`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      console.log('Products fetched:', data);
      
      // Map MongoDB _id to id
      const productsWithId = data.map((product: any) => ({
        ...product,
        id: product._id || product.id
      }))
      
      dispatch({ type: "SET_PRODUCTS", payload: productsWithId })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (error) {
      console.error("Fetch products error:", error)
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to fetch products" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Fetch sales from backend
  const fetchSales = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      console.log('Fetching sales from:', `${API_BASE_URL}/sales`);
      const response = await fetch(`${API_BASE_URL}/sales`)
      if (!response.ok) throw new Error("Failed to fetch sales")
      const data = await response.json()
      console.log('Sales fetched:', data);
      
      // Map MongoDB _id to id for sales and their items
      const salesWithId = data.map((sale: any) => ({
        ...sale,
        id: sale._id || sale.id,
        items: sale.items.map((item: any) => ({
          ...item,
          product: {
            ...item.product,
            id: item.product._id || item.product.id
          }
        }))
      }))
      
      dispatch({ type: "SET_SALES", payload: salesWithId })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (error) {
      console.error("Fetch sales error:", error)
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to fetch sales" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Create product
  const createProduct = async (product: Omit<Product, "id">) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      console.log('Creating product:', product);
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create product")
      }
      const newProduct = await response.json()
      console.log('Product created:', newProduct);
      
      // Map MongoDB _id to id
      const productWithId = {
        ...newProduct,
        id: newProduct._id || newProduct.id
      }
      
      dispatch({ type: "ADD_PRODUCT", payload: productWithId })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (error) {
      console.error("Create product error:", error)
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to create product" })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Update product
  const updateProduct = async (product: Product) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      console.log('Updating product:', product);
      
      // Remove the id field and use _id for the backend
      const { id, ...productData } = product;
      
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update product")
      }
      const updatedProduct = await response.json()
      console.log('Product updated:', updatedProduct);
      
      // Map MongoDB _id to id
      const productWithId = {
        ...updatedProduct,
        id: updatedProduct._id || updatedProduct.id
      }
      
      dispatch({ type: "UPDATE_PRODUCT", payload: productWithId })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (error) {
      console.error("Update product error:", error)
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to update product" })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Delete product
  const deleteProduct = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      console.log('Deleting product:', id);
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete product")
      }
      console.log('Product deleted:', id);
      dispatch({ type: "DELETE_PRODUCT", payload: id })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (error) {
      console.error("Delete product error:", error)
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to delete product" })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Complete sale
  const completeSale = async (saleData: Omit<SaleRecord, "id">) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      console.log('Completing sale:', saleData);
      
      // Prepare sale data for backend (convert product.id to product._id)
      const saleForBackend = {
        ...saleData,
        items: saleData.items.map(item => ({
          product: {
            ...item.product,
            _id: item.product.id // Use id as _id for backend
          },
          quantity: item.quantity
        }))
      };
      
      const response = await fetch(`${API_BASE_URL}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleForBackend),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create sale")
      }
      
      const newSale = await response.json()
      console.log('Sale created:', newSale);
      
      // Refresh products to get updated stock
      await fetchProducts()
      
      // Map sale data for frontend
      const saleWithId = {
        ...newSale,
        id: newSale._id || newSale.id,
        items: newSale.items.map((item: any) => ({
          ...item,
          product: {
            ...item.product,
            id: item.product._id || item.product.id
          }
        }))
      };
      
      dispatch({ type: "COMPLETE_SALE", payload: saleWithId })
      dispatch({ type: "SET_ERROR", payload: null })
      
    } catch (error) {
      console.error("Complete sale error:", error)
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to complete sale" })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Load initial data
  useEffect(() => {
    fetchProducts()
    fetchSales()
  }, [])

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      fetchProducts,
      fetchSales,
      createProduct,
      updateProduct,
      deleteProduct,
      completeSale,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppState must be used within AppProvider")
  return ctx
}