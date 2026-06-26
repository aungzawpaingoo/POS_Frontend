// "use client"

// import {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   type ReactNode,
//   type Dispatch,
// } from "react"

// export interface Product {
//   id: string
//   _id?: string
//   name: string
//   price: number
//   stock: number
//   category: string
//   sku: string
//   image_url?: string
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

// export interface UserProfile {
//   id: string
//   email: string
//   name?: string
//   role?: string
// }

// // Extracted schema matched exactly to React Native data payloads
// export interface BackendReceiptItem {
//   id: string
//   time: string
//   method: 'cash' | 'qr'
//   change_returned: number
//   mode: 'full' | 'split'
//   paid: number
//   total: number
//   items?: Array<{
//     name: string
//     price: string | number
//     quantity: number
//   }>
// }

// interface InventoryMetrics {
//   totalProducts: number
//   totalStock: number
//   totalValue: number
// }

// interface AppState {
//   products: Product[]
//   metrics: InventoryMetrics & { dailyRevenue?: number; transactionsCount?: number }
//   cart: CartItem[]
//   sales: SaleRecord[]
//   receipts: BackendReceiptItem[] // Added to hold structural receipt records safely
//   isLoading: boolean
//   error: string | null
//   user: UserProfile | null
//   isAuthenticated: boolean
// }

// type Action =
//   | { type: "SET_LOADING"; payload: boolean }
//   | { type: "SET_ERROR"; payload: string | null }
//   | { type: "SET_INVENTORY"; payload: { products: Product[]; metrics: InventoryMetrics & { dailyRevenue?: number; transactionsCount?: number } } }
//   | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
//   | { type: "REMOVE_FROM_CART"; payload: string }
//   | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
//   | { type: "CLEAR_CART" }
//   | { type: "AUTH_SUCCESS"; payload: { user: UserProfile } }
//   | { type: "LOGOUT" }
//   | { type: "SET_RECEIPTS"; payload: BackendReceiptItem[] } // Added securely

// const initialState: AppState = {
//   products: [],
//   metrics: { totalProducts: 0, totalStock: 0, totalValue: 0, dailyRevenue: 0, transactionsCount: 0 },
//   cart: [],
//   sales: [],
//   receipts: [], // Initialize clean safe arrays
//   isLoading: false,
//   error: null,
//   user: null,
//   isAuthenticated: false,
// }

// function appReducer(state: AppState, action: Action): AppState {
//   switch (action.type) {
//     case "SET_LOADING":
//       return { ...state, isLoading: action.payload }

//     case "SET_ERROR":
//       return { ...state, error: action.payload }

//     case "SET_INVENTORY":
//       return {
//         ...state,
//         products: action.payload.products,
//         metrics: action.payload.metrics,
//       }

//     case "ADD_TO_CART": {
//       const product = state.products.find((p) => p.id === action.payload.productId)
//       if (!product) return state

//       const existingItem = state.cart.find((item) => item.product.id === action.payload.productId)
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
//         cart: [...state.cart, { product: { ...product }, quantity: action.payload.quantity }],
//       }
//     }

//     case "REMOVE_FROM_CART":
//       return {
//         ...state,
//         cart: state.cart.filter((item) => item.product.id !== action.payload),
//       }

//     case "UPDATE_CART_QUANTITY": {
//       const product = state.products.find((p) => p.id === action.payload.productId)
//       if (!product) return state

//       if (action.payload.quantity > product.stock) return state
//       if (action.payload.quantity <= 0) {
//         return {
//           ...state,
//           cart: state.cart.filter((item) => item.product.id !== action.payload.productId),
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

//     case "AUTH_SUCCESS":
//       return { ...state, user: action.payload.user, isAuthenticated: true, error: null }

//     case "LOGOUT":
//       return { ...state, user: null, isAuthenticated: false, cart: [], products: [], receipts: [] }

//     case "SET_RECEIPTS":
//       return { ...state, receipts: action.payload }

//     default:
//       return state
//   }
// }

// const AppContext = createContext<{
//   state: AppState
//   dispatch: Dispatch<Action>
//   login: (email: string, pin: string) => Promise<void>
//   fetchProfile: () => Promise<void>
//   logout: () => void
//   fetchInventory: (searchQuery?: string) => Promise<void>
//   createProduct: (productData: FormData | Omit<Product, "id">) => Promise<void>
//   updateProduct: (id: string, productData: FormData | Partial<Product>) => Promise<void>
//   deleteProduct: (id: string) => Promise<void>
//   checkoutCart: () => Promise<{ status: string; orderId: string }>
//   confirmPayment: (orderId: string, paymentDetails: { paymentMethod: string; billingMode: string; amountPaid: number; receivedCash: number }) => Promise<{ status: string; message?: string }>
//   fetchReceiptsByDate: (dateKey: string) => Promise<void> // Added to interface safely
//   printReceiptDirectly: (receiptId: string) => Promise<{ status: string; message?: string }> // Added to interface safely
// } | null>(null)

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(appReducer, initialState)
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

//   const getHeaders = (isFormData = false) => {
//     const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
//     return {
//       ...(isFormData ? {} : { "Content-Type": "application/json" }),
//       ...(token ? { "Authorization": `Bearer ${token}` } : {})
//     }
//   }

//   const fetchProfile = async () => {
//     const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
//     if (!token) return

//     type ErrorWithMessage = { message: string }
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/profile`, {
//         method: "GET",
//         headers: getHeaders()
//       })
//       if (!response.ok) throw new Error("Session timed out")

//       const userData = await response.json()
//       const mappedUser = { ...userData, id: userData._id || userData.id }
//       dispatch({ type: "AUTH_SUCCESS", payload: { user: mappedUser } })
//     } catch (err) {
//       console.error(err)
//       logout()
//     }
//   }

//   const login = async (email: string, pin: string) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password: pin }),
//       })

//       if (!response.ok) {
//         const errResponse = await response.json().catch(() => ({}))
//         throw new Error(errResponse.message || "အသုံးပြုသူအမည် သို့မဟုတ် လျှို့ဝှက်နံပါတ် မှားယွင်းနေပါသည်။")
//       }

//       const data = await response.json()
//       if (data.token) localStorage.setItem('auth_token', data.token)

//       const userProfile = data.user || data
//       const mappedUser = { ...userProfile, id: userProfile._id || userProfile.id }

//       dispatch({ type: "AUTH_SUCCESS", payload: { user: mappedUser } })
//       dispatch({ type: "SET_ERROR", payload: null })
//     } catch (error) {
//       dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to sign in" })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem('auth_token')
//     dispatch({ type: "LOGOUT" })
//   }

//   const fetchInventory = async (searchQuery = "") => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const url = new URL(`${API_BASE_URL}/inventory/dashboard`, window.location.origin)
//       if (searchQuery) url.searchParams.append("search", searchQuery)

//       const response = await fetch(url.toString(), {
//         method: "GET",
//         headers: getHeaders(),
//       })

//       if (!response.ok) throw new Error("Failed to clear network sync dashboard response")
//       const data = await response.json()

//       if (data && data.status !== "error") {
//         const rawProducts = data.products || []
//         const cleanProducts = rawProducts.map((p: any) => ({
//           ...p,
//           id: p._id || p.id,
//         }))

//         dispatch({
//           type: "SET_INVENTORY",
//           payload: {
//             products: cleanProducts,
//             metrics: {
//               totalProducts: data.metrics?.totalProducts || cleanProducts.length || 0,
//               totalStock: data.metrics?.totalStock || 0,
//               totalValue: data.metrics?.totalValue || 0,
//               dailyRevenue: Number(data.metrics?.dailyRevenue || 0),
//               transactionsCount: Number(data.metrics?.transactionsCount || 0)
//             },
//           },
//         })
//       }
//     } catch (err) {
//       console.error("Dashboard engine context sync tracking failure:", err)
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   const createProduct = async (productData: FormData | Omit<Product, "id">) => {
//     const isFormData = productData instanceof FormData
//     const response = await fetch(`${API_BASE_URL}/inventory/products`, {
//       method: "POST",
//       headers: getHeaders(isFormData),
//       body: isFormData ? productData : JSON.stringify(productData),
//     })
//     if (!response.ok) {
//       const err = await response.json().catch(() => ({}))
//       throw new Error(err.message || "Failed to create item setup sync")
//     }
//   }

//   const updateProduct = async (id: string, productData: FormData | Partial<Product>) => {
//     const isFormData = productData instanceof FormData
//     const response = await fetch(`${API_BASE_URL}/inventory/products/${id}`, {
//       method: "PUT",
//       headers: getHeaders(isFormData),
//       body: isFormData ? productData : JSON.stringify(productData),
//     })
//     if (!response.ok) {
//       const err = await response.json().catch(() => ({}))
//       throw new Error(err.message || "Failed to finalize updates on dynamic route tracking context")
//     }
//   }

//   const deleteProduct = async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/inventory/products/${id}`, {
//       method: "DELETE",
//       headers: getHeaders(),
//     })
//     if (!response.ok) throw new Error("Failed to fulfill deletion sequence parameters securely")
//   }

//   const checkoutCart = async () => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const processedCart: { [key: number]: number } = {}
//       let totalAmount = 0

//       state.cart.forEach((item) => {
//         const idNum = Number(item.product.id)
//         if (!isNaN(idNum)) {
//           processedCart[idNum] = item.quantity
//           totalAmount += item.product.price * item.quantity
//         }
//       })

//       const response = await fetch(`${API_BASE_URL}/pos/checkout`, {
//         method: "POST",
//         headers: getHeaders(),
//         body: JSON.stringify({
//           cart: processedCart,
//           totalAmount: totalAmount
//         })
//       })

//       const data = await response.json()

//       if (data && data.status === "success") {
//         dispatch({ type: "CLEAR_CART" })
//         dispatch({ type: "SET_ERROR", payload: null })
//         return { status: "success", orderId: data.orderId }
//       } else {
//         throw new Error(data?.message || "Error executing transactional operation.")
//       }
//     } catch (error: any) {
//       const errMsg = error.message || "Failed to dispatch transactional transaction ledger updates."
//       dispatch({ type: "SET_ERROR", payload: errMsg })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   const confirmPayment = async (
//     orderId: string, 
//     paymentDetails: { paymentMethod: string; billingMode: string; amountPaid: number; receivedCash: number }
//   ) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const response = await fetch(`${API_BASE_URL}/pos/orders/${orderId}/confirm-payment`, {
//         method: "PUT",
//         headers: getHeaders(),
//         body: JSON.stringify(paymentDetails)
//       })
//       const data = await response.json()
//       if (data && data.status === "success") {
//         dispatch({ type: "SET_ERROR", payload: null })
//         return { status: "success" }
//       } else {
//         throw new Error(data?.message || "Database execution fault.")
//       }
//     } catch (error: any) {
//       const errMsg = error.message || "Could not verify state confirmation on ledger nodes."
//       dispatch({ type: "SET_ERROR", payload: errMsg })
//       throw error
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Pure state alignment corresponding directly with React Native Axios pulling parameters
//   const fetchReceiptsByDate = async (dateKey: string) => {
//     dispatch({ type: "SET_LOADING", payload: true })
//     try {
//       const url = new URL(`${API_BASE_URL}/pos/receipts`, window.location.origin)
//       url.searchParams.append("date", dateKey)

//       const response = await fetch(url.toString(), {
//         method: "GET",
//         headers: getHeaders()
//       })

//       const data = await response.json()
//       if (data && data.status === "success") {
//         dispatch({ type: "SET_RECEIPTS", payload: data.data || [] })
//         dispatch({ type: "SET_ERROR", payload: null })
//       } else {
//         dispatch({ type: "SET_RECEIPTS", payload: [] })
//       }
//     } catch (err: any) {
//       console.error("Web dynamic synchronization error with database routing logs: ", err)
//       dispatch({ type: "SET_RECEIPTS", payload: [] })
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false })
//     }
//   }

//   // Web service dispatcher to drive standard hardware receipt workflows
//   const printReceiptDirectly = async (receiptId: string) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/pos/receipts/${receiptId}/print`, {
//         method: "POST",
//         headers: getHeaders(),
//         body: JSON.stringify({
//           deviceType: "web_browser",
//           hardwareInterface: "bluetooth_thermal"
//         })
//       })
//       return await response.json()
//     } catch (error: any) {
//       return { status: "error", message: error.message || "Network layout exception printing to physical device nodes." }
//     }
//   }

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   return (
//     <AppContext.Provider
//       value={{
//         state,
//         dispatch,
//         login,
//         fetchProfile,
//         logout,
//         fetchInventory,
//         createProduct,
//         updateProduct,
//         deleteProduct,
//         checkoutCart,
//         confirmPayment,
//         fetchReceiptsByDate,
//         printReceiptDirectly
//       }}
//     >
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

export interface Product {
  id: string
  _id?: string
  name: string
  price: number
  stock: number
  category: string
  sku: string
  image_url?: string

}

export interface CartItem {
  product: Product
  quantity: number
  unit_sold: 'main' | 'sub'
  //Discount Part Added//
  customPrice?: number
  discountType?: 'percent' | 'flat'
  discountValue?: number
}

export interface SaleRecord {
  id: string
  items: CartItem[]
  total: number
  date: string
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  role?: string
}

export interface BackendReceiptItem {
  id: string
  time: string
  method: 'cash' | 'qr'
  change_returned: number
  mode: 'full' | 'split'
  paid: number
  total: number
  items?: Array<{
    name: string
    price: string | number
    quantity: number
  }>
}

interface InventoryMetrics {
  totalProducts: number
  totalStock: number
  totalValue: number
}

interface AppState {
  products: Product[]
  metrics: InventoryMetrics & { dailyRevenue?: number; transactionsCount?: number }
  cart: CartItem[]
  sales: SaleRecord[]
  receipts: BackendReceiptItem[]
  isLoading: boolean
  error: string | null
  user: UserProfile | null
  isAuthenticated: boolean
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_CART_DISCOUNT"; payload: { productId: string; discountType: 'percent' | 'flat'; discountValue: number; customPrice: number | undefined } }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_INVENTORY"; payload: { products: Product[]; metrics: InventoryMetrics & { dailyRevenue?: number; transactionsCount?: number } } }
  | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number; unit_sold: 'main' | 'sub' } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string; unit_sold: 'main' | 'sub' } }
  | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number; unit_sold: 'main' | 'sub' } }
  | { type: "CLEAR_CART" }
  | { type: "AUTH_SUCCESS"; payload: { user: UserProfile } }
  | { type: "LOGOUT" }
  | { type: "SET_RECEIPTS"; payload: BackendReceiptItem[] }

const initialState: AppState = {
  products: [],
  metrics: { totalProducts: 0, totalStock: 0, totalValue: 0, dailyRevenue: 0, transactionsCount: 0 },
  cart: [],
  sales: [],
  receipts: [],
  isLoading: false,
  error: null,
  user: null,
  isAuthenticated: false,
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload }

    case "SET_INVENTORY":
      return {
        ...state,
        products: action.payload.products,
        metrics: action.payload.metrics,
      }

    case "ADD_TO_CART": {
      const product = state.products.find((p) => p.id === action.payload.productId)
      if (!product) return state

      const { unit_sold, quantity } = action.payload
      const existingItem = state.cart.find((item) => item.product.id === action.payload.productId && item.unit_sold === unit_sold)

      const newQty = (existingItem ? existingItem.quantity : 0) + quantity

      return {
        ...state,
        cart: existingItem
          ? state.cart.map((item) => item.product.id === action.payload.productId && item.unit_sold === unit_sold ? { ...item, quantity: newQty } : item)
          : [...state.cart, { product: { ...product }, quantity, unit_sold }]
      }
    }

   case "UPDATE_CART_DISCOUNT": {
      const { productId, discountType, discountValue, customPrice } = action.payload;
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === productId
            ? { 
                ...item, 
                discountType: customPrice === undefined ? undefined : discountType, 
                discountValue: customPrice === undefined ? undefined : discountValue, 
                customPrice 
              }
            : item
        ),
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => !(item.product.id === action.payload.productId && item.unit_sold === action.payload.unit_sold)),
      }

    case "UPDATE_CART_QUANTITY": {
      const { quantity, unit_sold, productId } = action.payload
      if (quantity <= 0) {
        return { ...state, cart: state.cart.filter((item) => !(item.product.id === productId && item.unit_sold === unit_sold)) }
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === productId && item.unit_sold === unit_sold
            ? { ...item, quantity }
            : item
        ),
      }
    }

    case "CLEAR_CART":
      return { ...state, cart: [] }

    case "AUTH_SUCCESS":
      return { ...state, user: action.payload.user, isAuthenticated: true, error: null }

    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, cart: [], products: [], receipts: [] }

    case "SET_RECEIPTS":
      return { ...state, receipts: action.payload }

    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: Dispatch<Action>
  login: (email: string, pin: string) => Promise<void>
  fetchProfile: () => Promise<void>
  logout: () => void
  fetchInventory: (searchQuery?: string) => Promise<void>
  createProduct: (productData: FormData | Omit<Product, "id">) => Promise<void>
  updateProduct: (id: string, productData: FormData | Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  checkoutCart: () => Promise<{ status: string; orderId: string }>
  applyDiscountToCartItem: (productId: string, value: number, type: 'percent' | 'flat' | 'clear') => void
  confirmPayment: (orderId: string, paymentDetails: any) => Promise<{ status: string; message?: string }>

  addPayment: (orderId: string, paymentDetails: { amountPaid: number, paymentMethod: string }) => Promise<any>

  fetchReceiptsByDate: (dateKey: string) => Promise<void>
  printReceiptDirectly: (receiptId: string) => Promise<{ status: string; message?: string }>
  fetchTransactionDetail: (id: string) => Promise<any>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

  const getHeaders = (isFormData = false) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    return {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  }

  // const fetchProfile = async () => {
  //   const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  //   if (!token) return
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/auth/profile`, { headers: getHeaders() })
  //     if (!response.ok) throw new Error("Session timed out")
  //     const userData = await response.json()
  //     dispatch({ type: "AUTH_SUCCESS", payload: { user: { ...userData, id: userData._id || userData.id } } })
  //   } catch { logout() }
  // }

  const fetchProfile = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, { headers: getHeaders() })
      if (!response.ok) throw new Error("Session timed out")

      const data = await response.json()

      // Based on your console log, the real user data is inside 'data.user'
      // We extract that specific object to make state management clean
      const userProfile = data.user || data;

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: {
            ...userProfile,
            id: userProfile._id || userProfile.id
          }
        }
      })
    } catch { logout() }
  }

  const login = async (email: string, pin: string) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pin }),
      })
      if (!response.ok) throw new Error("Login failed")
      const data = await response.json()
      if (data.token) localStorage.setItem('auth_token', data.token)
      dispatch({ type: "AUTH_SUCCESS", payload: { user: { ...data.user, id: data.user._id || data.user.id } } })
    } finally { dispatch({ type: "SET_LOADING", payload: false }) }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    dispatch({ type: "LOGOUT" })
  }

  const fetchInventory = async (searchQuery = "") => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const url = new URL(`${API_BASE_URL}/inventory/dashboard`, window.location.origin)
      if (searchQuery) url.searchParams.append("search", searchQuery)
      const response = await fetch(url.toString(), { headers: getHeaders() })
      const data = await response.json()
      if (data && data.status !== "error") {
        dispatch({
          type: "SET_INVENTORY",
          payload: {
            products: (data.products || []).map((p: any) => ({ ...p, id: p._id || p.id, category: p.category })),
            metrics: {
              totalProducts: data.metrics?.totalProducts || 0,
              totalStock: data.metrics?.totalStock || 0,
              totalValue: data.metrics?.totalValue || 0,
              dailyRevenue: Number(data.metrics?.dailyRevenue || 0),
              transactionsCount: Number(data.metrics?.transactionsCount || 0)
            }
          }
        })
      }
    } finally { dispatch({ type: "SET_LOADING", payload: false }) }
  }

  const createProduct = async (productData: FormData | Omit<Product, "id">) => {
    const isFormData = productData instanceof FormData
    await fetch(`${API_BASE_URL}/inventory/products`, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? productData : JSON.stringify(productData),
    })
  }

  const updateProduct = async (id: string, productData: FormData | Partial<Product>) => {
    const isFormData = productData instanceof FormData
    await fetch(`${API_BASE_URL}/inventory/products/${id}`, {
      method: "PUT",
      headers: getHeaders(isFormData),
      body: isFormData ? productData : JSON.stringify(productData),
    })
  }

  const deleteProduct = async (id: string) => {
    await fetch(`${API_BASE_URL}/inventory/products/${id}`, { method: "DELETE", headers: getHeaders() })
  }


  //   const checkoutCart = async () => {
  //     dispatch({ type: "SET_LOADING", payload: true })
  //     try {

  //       const cartObject = state.cart.reduce((acc, item) => {
  //       acc[item.product.id] = item.quantity;
  //       return acc;
  //     }, {} as Record<string, number>);

  //       // The checkout logic now sends the explicit unit_sold type
  //       const response = await fetch(`${API_BASE_URL}/pos/checkout`, {
  //         method: "POST",
  //         headers: getHeaders(),
  //        body: JSON.stringify({ 
  //         cart: cartObject, // Sending as an object
  //         totalAmount: state.cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0)
  //       })
  //     })
  //       const data = await response.json()
  //     if (response.ok && data.status === "success") {
  //       dispatch({ type: "CLEAR_CART" })
  //       return { status: "success", orderId: data.orderId }
  //     }
  //     throw new Error(data.message || "Checkout failed")
  //   } finally { 
  //     dispatch({ type: "SET_LOADING", payload: false }) 
  //   }
  // }

  //Discount part change//
  const checkoutCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      // 1. Map cart items into the structured object payload expected by your backend
      const cartObject = state.cart.reduce((acc, item) => {
        acc[item.product.id] = {
          quantity: item.quantity,
          discountedPrice: item.customPrice !== undefined && item.customPrice !== null ? item.customPrice : Number(item.product.price)
        };
        return acc;
      }, {} as Record<string, { quantity: number; discountedPrice: number }>);

      // 2. Calculate the final absolute total reflecting all custom overrides
      const calculatedTotalAmount = state.cart.reduce((sum, item) => {
        const activePrice = item.customPrice !== undefined ? item.customPrice : Number(item.product.price);
        return sum + (activePrice * item.quantity);
      }, 0);
      

      const response = await fetch(`${API_BASE_URL}/pos/checkout`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          cart: cartObject,
          totalAmount: calculatedTotalAmount
        })
      })

      const data = await response.json()
      if (response.ok && data.status === "success") {
        dispatch({ type: "CLEAR_CART" })
        return { status: "success", orderId: data.orderId }
      }
      throw new Error(data.message || "Checkout failed")
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }
  //-------------------//


  const applyDiscountToCartItem = (productId: string, value: number, type: 'percent' | 'flat' | 'clear') => {
  if (type === 'clear') {
    dispatch({
      type: "UPDATE_CART_DISCOUNT",
      payload: { productId, discountType: 'flat', discountValue: 0, customPrice: undefined }
    });
    return;
  }

  // ✨ FIX: Explicitly find the 'main' unit item to match what POSView is using
    const cartItem = state.cart.find(item => item.product.id === productId && item.unit_sold === 'main');
    if (!cartItem) return;

    const originalPrice = Number(cartItem.product.price);
    let customPrice = originalPrice;

    if (type === 'percent') {
      customPrice = originalPrice - (originalPrice * (value / 100));
    } else if (type === 'flat') {
      customPrice = originalPrice - value;
    }

    // Floor the custom price to eliminate floating point decimals before saving to global state
    const finalizedCustomPrice = Math.max(0, Math.floor(customPrice));

    dispatch({
      type: "UPDATE_CART_DISCOUNT",
      payload: { 
        productId, 
        discountType: type, 
        discountValue: value, 
        customPrice: finalizedCustomPrice 
      }
    });
  };

// Remember to add "applyDiscountToCartItem" down into your <AppContext.Provider value={{...}}> statement at the bottom of the file!

  const confirmPayment = async (orderId: string, paymentDetails: any) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await fetch(`${API_BASE_URL}/pos/orders/${orderId}/confirm-payment`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(paymentDetails)
      })
      return await response.json()
    } finally { dispatch({ type: "SET_LOADING", payload: false }) }
  }

  const fetchTransactionDetail = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pos/transaction/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("အော်ဒါအချက်အလက်ကို ရှာမတွေ့ပါ။");
    return await response.json();
  };

  const fetchReceiptsByDate = async (dateKey: string) => {
    const response = await fetch(`${API_BASE_URL}/pos/receipts?date=${dateKey}`, { headers: getHeaders() })
    const data = await response.json()
    dispatch({ type: "SET_RECEIPTS", payload: data.data || [] })
  }

  const printReceiptDirectly = async (receiptId: string) => {
    const response = await fetch(`${API_BASE_URL}/pos/receipts/${receiptId}/print`, { method: "POST", headers: getHeaders() })
    return await response.json()
  }

  useEffect(() => { fetchProfile() }, [])


  const addPayment = async (orderId: string, paymentDetails: { amountPaid: number, paymentMethod: string }) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await fetch(`${API_BASE_URL}/pos/orders/${orderId}/add-payment`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(paymentDetails)
      })
      return await response.json()
    } finally { dispatch({ type: "SET_LOADING", payload: false }) }
  }

  return (
    <AppContext.Provider value={{
      state, dispatch, login, fetchProfile, logout, fetchInventory,
      createProduct, updateProduct, deleteProduct, checkoutCart,
      confirmPayment, addPayment, fetchReceiptsByDate, printReceiptDirectly,
      fetchTransactionDetail, applyDiscountToCartItem
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









