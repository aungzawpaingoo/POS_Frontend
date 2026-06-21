"use client"

import React, { useState, useEffect } from 'react'
import { useAppState } from '../lib/store'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert
} from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Print as PrintIcon,
  CalendarMonth as CalendarIcon,
  Refresh as RefreshIcon,
  FolderOff as EmptyIcon
} from '@mui/icons-material'

interface ReceiptItem {
  name: string
  price: string | number
  quantity: number
}

interface Receipt {
  id: string
  time: string
  total: number
  paid: number
  method: 'cash' | 'kpay' | string
  change_returned: number
  mode: 'full' | 'split' | string
  items?: ReceiptItem[]
}

// interface PaymentViewProps {
//   onPaymentComplete?: () => void
// }

interface ReceiptViewProps {
  onPaymentComplete?: () => void
  onCollectBalance?: (orderId: string, balance: number) => void
}

// export default function PaymentView({ onPaymentComplete }: PaymentViewProps) {
export default function ReceiptView({ onPaymentComplete, onCollectBalance }: ReceiptViewProps) {
  const { state, fetchReceiptsByDate, printReceiptDirectly } = useAppState()
  const receipts = (state.receipts || []) as Receipt[]
  const isLoading = state.isLoading

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  })

  const [printingId, setPrintingId] = useState<string | null>(null)
  const [uiFeedback, setUiFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchReceiptsByDate(selectedDate)
  }, [selectedDate])

  const handleRefreshData = () => {
    fetchReceiptsByDate(selectedDate)
  }

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(e.target.value)
    }
  }

  const parseDisplayTime = (timeString: string) => {
    if (!timeString || !timeString.includes(':')) return timeString
    try {
      const [hours, minutes] = timeString.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } catch {
      return timeString
    }
  }

  const totalSalesForToday = receipts.reduce((sum, item) => sum + (item.paid || 0), 0)

  const handlePrintReceiptJob = async (receiptId: string) => {
    setPrintingId(receiptId)
    setUiFeedback(null)

    const result = await printReceiptDirectly(receiptId)

    if (result && result.status === 'success') {
      setUiFeedback({ type: 'success', text: 'အောင်မြင်ပါသည် - ဘောက်ချာ ပရင်တာသို့ ပေးပို့ပြီးပါပြီ။' })
    } else {
      setUiFeedback({ type: 'error', text: result?.message || 'ပရင့်ထုတ်ရန် အဆင်မပြေပါ - Printer buffer allocation error.' })
    }
    setPrintingId(null)
  }

  return (
    <Box sx={{ width: { xs: '100%', md: '95%' }, mx: 'auto', pb: 6 }}>
      {uiFeedback && (
        <Alert
          severity={uiFeedback.type}
          onClose={() => setUiFeedback(null)}
          sx={{ mb: 3, borderRadius: '8px', border: `1px solid ${uiFeedback.type === 'success' ? '#D1E7DD' : '#F8D7DA'}`, boxShadow: 'none' }}
        >
          {uiFeedback.text}
        </Alert>
      )}

      {/* Header Panel Layout with Date Filter adjusted to span 95% cleanly */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={3} mb={4}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1520', mb: 2 }}>
            ဘောက်ချာမှတ်တမ်း စီမံခန့်ခွဲမှု
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#7A6069', fontWeight: 500 }}>
            ရောင်းချပြီးခဲ့သော စာရင်းမှတ်တမ်းများအား နေ့ရက်အလိုက် ပြန်လည်စစ်ဆေးခြင်း
          </Typography>
        </Box>

        {/* Date Filter Action Segment - Spans across smoothly */}
        <Box display="flex" alignItems="center" gap={1.5} sx={{ width: { xs: '100%', md: 'auto' }, flexGrow: { xs: 0, md: 0.5 }, justifyContent: 'flex-end' }}>
          <TextField
            type="date"
            value={selectedDate}
            onChange={handleDateInputChange}
            size="medium"
            InputProps={{
              startAdornment: <CalendarIcon sx={{ color: '#2563EB', mr: 1, fontSize: '20px' }} />,
            }}
            sx={{
              bgcolor: '#ffffff',
              width: { xs: '100%', sm: '320px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                borderColor: '#F5E1E5',
                '& fieldset': { borderColor: '#F5E1E5' },
                '&:hover fieldset': { borderColor: '#2563EB' },
                '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: '1px' }
              }
            }}
          />
          <Button
            variant="outlined"
            onClick={handleRefreshData}
            disabled={isLoading}
            sx={{
              minWidth: '50px',
              width: '50px',
              height: '50px',
              p: 0,
              borderRadius: '8px',
              borderColor: '#F5E1E5',
              color: '#2D1520',
              '&:hover': { borderColor: '#2563EB', bgcolor: '#FDF8F9' }
            }}
          >
            <RefreshIcon sx={{ fontSize: '20px' }} />
          </Button>
        </Box>
      </Box>

      {/* Dynamic Metric Display Wrapper: Today Sales Block (ယနေ့ရောင်းရငွေ) */}
      <Card sx={{ border: '1px solid #2563EB', borderRadius: '12px', boxShadow: 'none', bgcolor: '#FDF8F9', mb: 4 }}>
        <CardContent sx={{ p: '24px !important', display: 'block', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 800, color: '#7A6069' }}>
            ယနေ့ရောင်းရငွေစုစုပေါင်း
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563EB', mt: 2 }}>
            {totalSalesForToday.toLocaleString()} MMK
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1520', mb: 2 }}>
        ဘောက်ချာစာရင်း ({receipts.length} စောင်)
      </Typography>

      {isLoading && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10} gap={2}>
          <CircularProgress size={36} sx={{ color: '#2563EB' }} />
          <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 600 }}>
            ဒေတာများကို ရယူနေပါသည်...
          </Typography>
        </Box>
      )}

      {!isLoading && receipts.length === 0 && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} sx={{ border: '1px dashed #F5E1E5', borderRadius: '12px', bgcolor: '#ffffff' }}>
          <EmptyIcon sx={{ color: '#C4A3AF', fontSize: 48, mb: 1.5 }} />
          <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 700, textAlign: 'center', lineHeight: 1.6 }}>
            ရွေးချယ်ထားသော ရက်စွဲအတွက်<br />ဘောက်ချာမှတ်တမ်း မရှိပါ။
          </Typography>
        </Box>
      )}

      {!isLoading && receipts.length > 0 && (
        <Box display="flex" flexDirection="column" gap={1.5}>
          {receipts.map((item) => (
            <Accordion
              key={item.id}
              disableGutters
              elevation={0}
              sx={{
                border: '1px solid #F5E1E5',
                borderRadius: '8px !important',
                overflow: 'hidden',
                bgcolor: '#ffffff',
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#2D1520' }} />}
                sx={{ px: 2.5, py: 0.5, '&.Mui-expanded': { bgcolor: '#FDF8F9' } }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" pr={2}>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1520' }}>
                    Order Number - {item.id}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7A6069', fontWeight: 700 }}>
                    {parseDisplayTime(item.time)}
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 2.5, py: 3, borderTop: '1px solid #F5E1E5', bgcolor: '#ffffff' }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6} display="flex" flexDirection="column" gap={1.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 600 }}>ပေးချေမှု</Typography>
                      <Typography variant="body2" sx={{ color: '#2D1520', fontWeight: 800 }}>
                        {item.method === 'cash' ? 'လက်ငင်းငွေသား' : 'မိုဘိုင်းလ်ဖုန်း (QR)'}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 600 }}>ပြန်အမ်းငွေ</Typography>
                      <Typography variant="body2" sx={{ color: '#2D1520', fontWeight: 800 }}>
                        {item.change_returned.toLocaleString()} MMK
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 600 }}>ငွေပေးချေမှု ပုံစံ</Typography>
                      <Typography variant="body2" sx={{ color: '#2D1520', fontWeight: 800 }}>
                        {item.mode === 'full' ? 'အပြည့်အဝပေးချေမှု' : 'စရန်ငွေ / ခွဲပေးမှု'}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" pt={0.5}>
                      <Typography variant="body2" sx={{ color: '#7A6069', fontWeight: 600 }}>ယခုလက်ခံရရှိငွေ</Typography>
                      <Typography variant="body2" sx={{ color: '#2D1520', fontWeight: 900 }}>
                        {item.paid.toLocaleString()} MMK
                      </Typography>
                    </Box>

                    {item.mode === 'split' && (item.total - item.paid) > 0 && (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        sx={{ bgcolor: '#FFF5F5', p: 1.5, borderRadius: '6px', border: '1px solid #FFE3E3' }}
                      >
                        <Typography variant="body2" sx={{ color: '#E53E3E', fontWeight: 700 }}>ရှင်းရမည့်လက်ကျန်</Typography>
                        <Typography variant="body2" sx={{ color: '#E53E3E', fontWeight: 900 }}>
                          {(item.total - item.paid).toLocaleString()} MMK
                        </Typography>
                      </Box>
                    )}

                    {item.mode === 'split' && (item.total - item.paid) > 0 && onCollectBalance && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="warning"
                        onClick={() => onCollectBalance(item.id, item.total - item.paid)}
                        sx={{
                          mb: 2,
                          bgcolor: '#ED8936',
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: '8px'
                        }}
                      >
                        လက်ကျန်ငွေကောက်ခံရန်
                      </Button>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ color: '#C4A3AF', fontWeight: 800, letterSpacing: '0.5px', display: 'block', mb: 1.5 }}>
                      ပစ္စည်းများ (ITEMS)
                    </Typography>

                    {item.items && item.items.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap={1.5}>
                        {item.items.map((product, idx) => {
                          const parsedPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
                          return (
                            <Box key={idx} display="flex" justifyContent="space-between" alignItems="flex-start">
                              <Box sx={{ maxWidth: '70%' }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1520', mb: 0.25 }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7A6069', display: 'block' }}>
                                  {parsedPrice.toLocaleString()} MMK × {product.quantity}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1520', pt: 0.5 }}>
                                {(parsedPrice * product.quantity).toLocaleString()} MMK
                              </Typography>
                            </Box>
                          )
                        })}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#7A6069', fontStyle: 'italic' }}>
                        ပစ္စည်းအချက်အလက်များ မရရှိပါ။
                      </Typography>
                    )}

                    <Divider sx={{ borderColor: '#F5E1E5', my: 2 }} />

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1520' }}>စုစုပေါင်းငွေ</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2563EB' }}>
                        {item.total.toLocaleString()} MMK
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      disabled={printingId === item.id}
                      startIcon={printingId === item.id ? <CircularProgress size={16} color="inherit" /> : <PrintIcon />}
                      onClick={() => handlePrintReceiptJob(item.id)}
                      sx={{
                        bgcolor: '#2563EB',
                        color: '#ffffff',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: 'none',
                        borderRadius: '8px',
                        py: 1,
                        '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
                        '&.Mui-disabled': { bgcolor: '#93C5FD', color: '#ffffff' }
                      }}
                    >
                      ဘောက်ချာဖြတ်ပိုင်းထုတ်မည်
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  )
}