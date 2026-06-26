"use client"

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import {
  PointOfSale as CashIcon,
  QrCodeScanner as QrIcon,
  CalendarMonth as CalendarIcon,
  CheckCircleOutline as SuccessIcon
} from '@mui/icons-material'
import { useAppState } from '@/lib/store'

interface PaymentViewProps {
  orderId?: string
  totalAmount?: number
  onPaymentComplete?: () => void
  isTopUp?: boolean
}

export default function PaymentView({ orderId, totalAmount = 0, onPaymentComplete, isTopUp = false }: PaymentViewProps) {

 console.log("Payment View received ", { orderId, totalAmount });
  // const { state, confirmPayment } = useAppState()
  const { state, confirmPayment, addPayment, fetchTransactionDetail } = useAppState()
  const userRole = state.user?.role === 'owner' ? 'owner' : 'employee'

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile'>('cash')
  const [billingMode, setBillingMode] = useState<'full' | 'split'>('full')
  const [depositPaid, setDepositPaid] = useState('')
  const [receivedCash, setReceivedCash] = useState('')
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)


  useEffect(() => {
    const loadTransaction = async () => {
      // Only attempt to load if orderId is actually provided
      if (orderId) {
        try {
          const data = await fetchTransactionDetail(orderId);
         console.log("Transaction Details:", data);
          // Example: If you have a state for the order details:
          // setOrderData(data); 
        } catch (err) {
          console.error("Failed to load details:", err);
          setLocalError("အော်ဒါအချက်အလက်ကို တင်ရာတွင် အမှားဖြစ်ပေါ်နေပါသည်။");
        }
      }
    };

    loadTransaction();
  }, [orderId, fetchTransactionDetail]); // Added fetchTransactionDetail here

  const [timeHorizon, setTimeHorizon] = useState<'daily' | 'monthly' | 'yearly'>('daily')
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  const getFormattedDateString = (dateStr: string) => {
    if (!dateStr) return ''
    const dateObj = new Date(dateStr)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()
    return `${day} ${month} ${year}`
  }

  const getMetricsByTimeline = () => {
    let multiplier = 1
    if (timeHorizon === 'monthly') multiplier = 30
    if (timeHorizon === 'yearly') multiplier = 365

    const baseInvoiceValue = totalAmount * multiplier
    return {
      grossRevenue: baseInvoiceValue,
      estimatedCostOfGoods: baseInvoiceValue * 0.65,
      netProfitMargin: baseInvoiceValue * 0.35,
      commercialTax: baseInvoiceValue * 0.05,
    }
  }

  const financials = getMetricsByTimeline()
  const targetedPaymentValue = billingMode === 'full' ? totalAmount : (parseFloat(depositPaid) || 0)
  const remainingBalance = totalAmount - targetedPaymentValue

  const handleProcessPayment = async () => {
    setLocalError(null)

    if (!orderId) {
      setLocalError('အော်ဒါအမှတ်စဉ် ရှာမတွေ့ပါ။ ကျေးဇူးပြု၍ POS ကောင်တာမှ ပြန်လည်စတင်ပါ။')
      return
    }

    if (billingMode === 'split' && !depositPaid) {
      setLocalError('ကျေးဇူးပြု၍ စရန်ငွေပမာဏ ရိုက်ထည့်ပါ။')
      return
    }

    if (paymentMethod === 'cash') {
      if (!receivedCash) {
        setLocalError('ဝယ်သူပေးသော ငွေသားပမာဏ ရိုက်ထည့်ပါ... ')
        return
      }
      if (parseFloat(receivedCash) < targetedPaymentValue) {
        setLocalError('လက်ခံရရှိငွေသည် ကျသင့်ငွေထက် နည်းနေပါသည်။')
        return
      }
    }


    // Logic for partial/split payments
    if (!isTopUp && billingMode === 'split' && !depositPaid) {
      setLocalError('ကျေးဇူးပြု၍ စရန်ငွေပမာဏ ရိုက်ထည့်ပါ။');
      return;
    }

    // Cash validation
    if (paymentMethod === 'cash') {
      if (!receivedCash) {
        setLocalError('ဝယ်သူပေးသော ငွေသားပမာဏ ရိုက်ထည့်ပါ...');
        return;
      }
      if (parseFloat(receivedCash) < targetedPaymentValue) {
        setLocalError('လက်ခံရရှိငွေသည် ကျသင့်ငွေထက် နည်းနေပါသည်။');
        return;
      }
    }


    //   try {
    //     setLoading(true)
    //     const res = await confirmPayment(orderId, {
    //       paymentMethod,
    //       billingMode,
    //       amountPaid: targetedPaymentValue,
    //       receivedCash: paymentMethod === 'cash' ? parseFloat(receivedCash) : 0
    //     })

    //     if (res && res.status === 'success') {
    //       setSuccessDialogOpen(true)
    //     }
    //   } catch (err: any) {
    //     setLocalError(err.message || 'Network ledger processing error.')
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    try {
      setLoading(true);
      let res;

      if (isTopUp) {
        // --- CALL NEW ADD PAYMENT LOGIC ---
        res = await addPayment(orderId, {
          amountPaid: targetedPaymentValue,
          paymentMethod
        });
      } else {
        // --- CALL ORIGINAL CONFIRM PAYMENT LOGIC ---
        res = await confirmPayment(orderId, {
          paymentMethod,
          billingMode,
          amountPaid: targetedPaymentValue,
          receivedCash: paymentMethod === 'cash' ? parseFloat(receivedCash) : 0
        });
      }

      if (res && res.status === 'success') {
        setSuccessDialogOpen(true);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Network ledger processing error.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false)
    setPaymentMethod('cash')
    setBillingMode('full')
    setDepositPaid('')
    setReceivedCash('')
    if (onPaymentComplete) {
      onPaymentComplete()
    }
  }

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {localError && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '8px', fontWeight: 600 }}>
          {localError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid #F5E1E5', borderRadius: '12px', boxShadow: 'none', bgcolor: '#2D1520', color: '#ffffff', mb: 3 }}>
            <CardContent sx={{ p: '24px !important' }}>
              <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 700, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {userRole === 'employee' ? 'စုစုပေါင်း ကျသင့်ငွေ' : 'စုစုပေါင်းရောင်းရငွေ'}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#FDF8F9', letterSpacing: '-0.03em', mt: 2 }}>
                {financials.grossRevenue.toLocaleString()}.00 MMK
              </Typography>
            </CardContent>
          </Card>

          {userRole === 'employee' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1520', mb: 1.5 }}>
                  ငွေပေးချေမှု ပုံစံ
                </Typography>
                <ToggleButtonGroup
                  value={billingMode}
                  exclusive
                  onChange={(_, val) => {
                    if (val) {
                      setBillingMode(val)
                      if (val === 'full') setDepositPaid('')
                    }
                  }}
                  fullWidth
                  sx={{ gap: 1, '& .MuiToggleButton-root': { border: '1px solid #F5E1E5 !important', borderRadius: '8px !important' } }}
                >
                  <ToggleButton
                    value="full"
                    sx={{
                      fontWeight: 700,
                      textTransform: 'none',
                      color: '#7A6069',
                      fontSize: '1.5 rem',
                      '&.Mui-selected': { bgcolor: '#2563EB !important', color: '#ffffff !important' }
                    }}
                  >
                    အပြည့်အဝ
                  </ToggleButton>
                  {/* <ToggleButton
                    value="split"
                    sx={{
                      fontWeight: 700,
                      textTransform: 'none',
                      color: '#7A6069',
                      '&.Mui-selected': { bgcolor: '#2563EB !important', color: '#ffffff !important' }
                    }}
                  >
                    စရန်ငွေ
                  </ToggleButton> */}
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1520', mb: 2 }}>
                  ငွေပေးချေမည့် နည်းလမ်း
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card
                      onClick={() => setPaymentMethod('cash')}
                      sx={{
                        border: '1px solid #F5E1E5',
                        borderRadius: '8px',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        bgcolor: paymentMethod === 'cash' ? '#2D1520' : '#ffffff',
                        color: paymentMethod === 'cash' ? '#ffffff' : '#2D1520',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: '16px !important' }}>
                        <CashIcon sx={{ color: paymentMethod === 'cash' ? '#ffffff' : '#2563EB', fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>ငွေသား</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card
                      onClick={() => setPaymentMethod('mobile')}
                      sx={{
                        border: '1px solid #F5E1E5',
                        borderRadius: '8px',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        bgcolor: paymentMethod === 'mobile' ? '#2D1520' : '#ffffff',
                        color: paymentMethod === 'mobile' ? '#ffffff' : '#2D1520',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: '16px !important' }}>
                        <QrIcon sx={{ color: paymentMethod === 'mobile' ? '#ffffff' : '#2563EB', fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>မိုဘိုင်းလ်ဖုန်း</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1520', mb: 1.5 }}>
                  ရက်စွဲ စစ်ထုတ်မှု (Date Filter)
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputProps={{
                    startAdornment: <CalendarIcon sx={{ color: '#2563EB', mr: 1 }} />
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "#F5E1E5" }
                    }
                  }}
                />
              </Box>

              <Box>
                <ToggleButtonGroup
                  value={timeHorizon}
                  exclusive
                  onChange={(_, val) => val && setTimeHorizon(val)}
                  fullWidth
                  sx={{ gap: 1, '& .MuiToggleButton-root': { border: '1px solid #F5E1E5 !important', borderRadius: '8px !important' } }}
                >
                  <ToggleButton value="daily" sx={{ fontWeight: 700, textTransform: 'none', color: '#7A6069', '&.Mui-selected': { bgcolor: '#2563EB !important', color: '#ffffff !important' } }}>နေ့စဉ်</ToggleButton>
                  <ToggleButton value="monthly" sx={{ fontWeight: 700, textTransform: 'none', color: '#7A6069', '&.Mui-selected': { bgcolor: '#2563EB !important', color: '#ffffff !important' } }}>လချုပ်</ToggleButton>
                  <ToggleButton value="yearly" sx={{ fontWeight: 700, textTransform: 'none', color: '#7A6069', '&.Mui-selected': { bgcolor: '#2563EB !important', color: '#ffffff !important' } }}>နှစ်ချုပ်</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {userRole === 'employee' ? (
            <Card sx={{ border: '1px solid #F5E1E5', borderRadius: '12px', boxShadow: 'none', bgcolor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent sx={{ p: 3 }}>
                {billingMode === 'split' && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#2D1520', mb: 1 }}>လက်ခံရရှိသည့် စရန်ငွေ</Typography>
                    <TextField
                      fullWidth
                      placeholder="စရန်ငွေပမာဏ ရိုက်ထည့်ပါ..."
                      type="number"
                      value={depositPaid}
                      onChange={(e) => {
                        setDepositPaid(e.target.value)
                        setReceivedCash('')
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", "& fieldset": { borderColor: "#F5E1E5" } } }}
                    />
                  </Box>
                )}

                {paymentMethod === 'cash' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#2D1520', mb: 2 }}>
                        {billingMode === 'split' ? 'ဝယ်သူပေးသော ငွေသားပမာဏ' : 'လက်ခံရရှိသည့် ငွေသား'}
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder={billingMode === 'split' ? "ပေးချေသည့် ပမာဏ..." : "ငွေပမာဏ ရိုက်ထည့်ပါ..."}
                        type="number"
                        value={receivedCash}
                        onChange={(e) => setReceivedCash(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", "& fieldset": { borderColor: "#F5E1E5" } } }}
                      />
                    </Box>

                    {parseFloat(receivedCash) > targetedPaymentValue && targetedPaymentValue > 0 && (
                      <Box sx={{ p: 2, bgcolor: '#FDF8F9', borderRadius: '8px', border: '1px dashed #2563EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#7A6069' }}>ပြန်အမ်းငွေ -</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2563EB' }}>
                          {(parseFloat(receivedCash) - targetedPaymentValue).toLocaleString()} MMK
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#FDF8F9', borderRadius: '8px', border: '1px dashed #F5E1E5' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#7A6069', mb: 1 }}>
                      {billingMode === 'split' ? 'စရန်ငွေ' : 'ကျသင့်ငွေအပြည့်'} ပေးချေရန် -
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#2563EB', mb: 2 }}>
                      {targetedPaymentValue.toLocaleString()} MMK
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 800, display: 'block', lineHeight: 1.6 }}>
                      Mobile Payment<br />ဖြင့်စိတ်ချစွာပေးချေနိုင်ပါသည်။
                    </Typography>
                  </Box>
                )}

                {billingMode === 'split' && remainingBalance > 0 && remainingBalance < totalAmount && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#FDF8F9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#7A6069' }}>ပစ္စည်းရောက်မှ ရှင်းရမည့်လက်ကျန် -</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1520' }}>{remainingBalance.toLocaleString()} MMK</Typography>
                  </Box>
                )}
              </CardContent>

              {/* <Box sx={{ p: 3, borderTop: '1px solid #F5E1E5' }}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  onClick={handleProcessPayment}
                  sx={{
                    bgcolor: '#2563EB',
                    color: '#ffffff',
                    boxShadow: 'none',
                    py: 1.5,
                    borderRadius: '8px',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#2563EB' }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : (billingMode === 'split' ? 'စရန်ငွေဖြင့် အော်ဒါတင်မည်' : 'ငွေပေးချေမှု အတည်ပြုမည်')}
                </Button>
              </Box> */}
              <Box sx={{ p: 3, borderTop: '1px solid #F5E1E5' }}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  onClick={handleProcessPayment}
                  sx={{
                    bgcolor: '#2563EB',
                    color: '#ffffff',
                    boxShadow: 'none',
                    py: 1.5,
                    borderRadius: '8px',
                    fontSize: '2 rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#2563EB' }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isTopUp ? (
                    'လက်ကျန်ငွေ ပေးချေမည်'
                  ) : billingMode === 'split' ? (
                    'စရန်ငွေဖြင့် အော်ဒါတင်မည်'
                  ) : (
                    'ငွေပေးချေမှု အတည်ပြုမည်'
                  )}
                </Button>
              </Box>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1520' }}>
                ဘဏ္ဍာရေးဆိုင်ရာ အချက်အလက်များ ({getFormattedDateString(selectedDate)})
              </Typography>

              <Card sx={{ border: '1px solid #F5E1E5', borderRadius: '8px', boxShadow: 'none' }}>
                <CardContent sx={{ p: '16px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 700 }}>ခန့်မှန်း အရင်းအနှီးတန်ဖိုး</Typography>
                  <Typography variant="body1" sx={{ color: '#2D1520', fontWeight: 800 }}>{financials.estimatedCostOfGoods.toLocaleString()}.00 MMK</Typography>
                </CardContent>
              </Card>

              <Card sx={{ border: '1px solid #F5E1E5', borderRadius: '8px', boxShadow: 'none' }}>
                <CardContent sx={{ p: '16px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 700 }}>ခန့်မှန်း အသားတင်အမြတ်</Typography>
                  <Typography variant="body1" sx={{ color: '#2D1520', fontWeight: 800 }}>{financials.netProfitMargin.toLocaleString()}.00 MMK</Typography>
                </CardContent>
              </Card>

              <Card sx={{ border: '1px solid #F5E1E5', borderRadius: '8px', boxShadow: 'none' }}>
                <CardContent sx={{ p: '16px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 700 }}>ကျသင့် ကုန်သွယ်လုပ်ငန်းခွန် (၅%)</Typography>
                  <Typography variant="body1" sx={{ color: '#2D1520', fontWeight: 800 }}>{financials.commercialTax.toLocaleString()}.00 MMK</Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Success Confirmation Dialog Modal */}
      <Dialog
        open={successDialogOpen}
        onClose={handleCloseSuccessDialog}
        PaperProps={{ sx: { borderRadius: '12px', border: '1px solid #F5E1E5', boxShadow: 'none', p: 1, maxWidth: '400px', width: '100%' } }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 3 }}>
          <SuccessIcon sx={{ color: '#28a745', fontSize: 64, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1520', mb: 1 }}>
            ငွေပေးချေမှု အောင်မြင်ပါသည်
          </Typography>
          <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 600, mb: 2 }}>
            {billingMode === 'split' ? 'စရန်ငွေ လက်ခံရရှိပြီးပါပြီ။' : 'ငွေပေးချေမှု လုပ်ငန်းစဉ် ပြီးမြောက်သွားပါပြီ။'}
          </Typography>

          {paymentMethod === 'cash' && receivedCash && (
            <Box sx={{ bgcolor: '#FDF8F9', p: 1.5, borderRadius: '8px', width: '100%' }}>
              <Typography variant="caption" sx={{ color: '#7A6069', fontWeight: 700, display: 'block', mb: 0.5 }}>ပြန်အမ်းငွေ</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#28a745' }}>
                {(parseFloat(receivedCash) - targetedPaymentValue).toLocaleString()} MMK
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleCloseSuccessDialog}
            sx={{ bgcolor: '#2D1520', color: '#ffffff', boxShadow: 'none', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#422030' } }}
          >
            အိုကေ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}