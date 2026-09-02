'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// ═══════════════════════════════════════════════════════════════════
// Each page is now its OWN component to avoid hook mismatch errors.
// ═══════════════════════════════════════════════════════════════════

export default function ERPViewsTravel(props) {
  const { page } = props;
  if (page === 'flight_status') return <FlightStatusView {...props} />;
  if (page === 'frequent_flyer') return <FrequentFlyerView {...props} />;
  if (page === 'corporate_travel') return <CorporateTravelView {...props} />;
  if (page === 'visa_processing') return <VisaProcessingView {...props} />;
  return null;
}

// ============================================================
// SHARED HELPERS
// ============================================================
function useTravelHelpers(props) {
  const { lang, theme, tr } = props;
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';
  const t = (key, fallback) => tr?.[key] || fallback || key;

  const styles = {
    container: {
      padding: '20px',
      background: isDark ? '#0F172A' : '#F8FAFC',
      minHeight: '100vh',
      color: isDark ? '#E2E8F0' : '#1E293B',
      transition: 'all 0.3s ease'
    },
    card: {
      background: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.05)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#FBBF24',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: 0
    },
    input: {
      padding: '10px 15px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '8px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.2s'
    },
    select: {
      padding: '10px 15px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '8px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box'
    },
    textarea: {
      padding: '10px 15px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '8px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: 'inherit'
    },
    btn: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '13px',
      transition: 'all 0.2s'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
      color: '#fff'
    },
    btnSuccess: {
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: '#fff'
    },
    btnDanger: {
      background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
      color: '#fff'
    },
    btnWarning: {
      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
      color: '#0F172A'
    },
    btnGhost: {
      background: 'transparent',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      color: isDark ? '#94A3B8' : '#64748B'
    },
    btnInfo: {
      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
      color: '#fff'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    statCard: {
      background: isDark ? 'linear-gradient(135deg, #1E293B, #0F172A)' : 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
      padding: '20px',
      borderRadius: '12px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0'
    },
    statLabel: {
      fontSize: '12px',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#FBBF24',
      marginTop: '5px'
    },
    label: {
      fontSize: '13px',
      fontWeight: 600,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: '6px',
      display: 'block'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    },
    sectionTitle: {
      color: '#FBBF24',
      fontSize: '15px',
      fontWeight: 700,
      margin: '0 0 15px',
      paddingBottom: '10px',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0'
    },
    badge: {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      display: 'inline-block'
    },
    badgeSuccess: {
      background: '#065F46',
      color: '#34D399'
    },
    badgeDanger: {
      background: '#7F1D1D',
      color: '#FCA5A5'
    },
    badgeWarning: {
      background: '#78350F',
      color: '#FBBF24'
    },
    badgeInfo: {
      background: '#1E3A8A',
      color: '#93C5FD'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px'
    },
    th: {
      padding: '12px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      color: '#FBBF24',
      textAlign: 'left',
      fontWeight: 600,
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: isDark ? '2px solid #334155' : '2px solid #E2E8F0'
    },
    td: {
      padding: '12px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B'
    },
    tdCenter: {
      padding: '12px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B',
      textAlign: 'center'
    },
    tdRight: {
      padding: '12px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B',
      textAlign: 'right',
      fontWeight: 600
    },
    actionsCell: {
      display: 'flex',
      gap: '5px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    actionBtn: {
      padding: '6px 10px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: 600,
      transition: 'all 0.2s'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#64748B'
    },
    emptyIcon: {
      fontSize: '60px',
      marginBottom: '15px'
    }
  };

  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

  return { isAr, isDark, styles, fmt, t };
}

// ============================================================
// FLIGHT STATUS VIEW – Ticket Generator with Print matching sample
// ============================================================
function FlightStatusView(props) {
  const { data, tr, today, userProfile, showToast, setData, logAction, lang, theme } = props;
  const { isAr, isDark, styles, fmt, t } = useTravelHelpers(props);
  const [ticketForm, setTicketForm] = useState({
    passenger_name: '',
    passenger_phone: '',
    passenger_email: '',
    airline: '',
    flight_number: '',
    origin: '',
    destination: '',
    departure_date: today,
    departure_time: '08:00',
    arrival_time: '12:00',
    seat_number: '',
    booking_reference: '',
    ticket_number: '',
    status: 'Confirmed',
    class: 'Economy',
    gate: '',
    terminal: '',
    baggage: '30 Kg',
    meal: 'Standard',
    special_requests: '',
    fare: 0,
    tax: 0,
    total: 0,
    airline_name: ''
  });
  const [tickets, setTickets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [pnrCheck, setPnrCheck] = useState('');
  const [pnrResult, setPnrResult] = useState(null);

  const airlines = [
    { code: 'SV', name: 'Saudi Airline' },
    { code: 'XY', name: 'Flynas' },
    { code: 'F3', name: 'Flyadeal' },
    { code: 'EK', name: 'Emirates' },
    { code: 'EY', name: 'Etihad' },
    { code: 'QR', name: 'Qatar Airways' },
    { code: 'GF', name: 'Gulf Air' },
    { code: 'MS', name: 'EgyptAir' },
    { code: 'RJ', name: 'Royal Jordanian' },
    { code: 'PK', name: 'Pakistan International' },
    { code: 'WY', name: 'Oman Air' },
    { code: 'KU', name: 'Kuwait Airways' },
    { code: 'G9', name: 'Air Arabia' },
    { code: 'TK', name: 'Turkish Airlines' },
    { code: '6E', name: 'IndiGo' },
    { code: 'AI', name: 'Air India' }
  ];

  const cities = [
    'Riyadh (RUH)', 'Jeddah (JED)', 'Dammam (DMM)', 'Madinah (MED)',
    'Makkah', 'Cairo (CAI)', 'Dubai (DXB)', 'Abu Dhabi (AUH)',
    'Doha (DOH)', 'Manama (BAH)', 'Kuwait (KWI)', 'Muscat (MCT)',
    'Amman (AMM)', 'London (LHR)', 'Paris (CDG)', 'New York (NYC)',
    'Istanbul (IST)', 'Kuala Lumpur (KUL)', 'Singapore (SIN)',
    'Hong Kong (HKG)', 'Tokyo (NRT)', 'Bangkok (BKK)',
    'Mumbai (BOM)', 'Delhi (DEL)', 'Karachi (KHI)', 'Lahore (LHE)'
  ];

  const statuses = ['Confirmed', 'On Time', 'Delayed', 'Boarding', 'Departed', 'Arrived', 'Cancelled'];
  const classes = ['Economy', 'Business', 'First Class'];
  const terminals = ['1', '2', '3', '4', '5'];
  const gates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Generate random ticket
  const generateRandomTicket = () => {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNum = Math.floor(100 + Math.random() * 900);
    const origin = cities[Math.floor(Math.random() * cities.length)];
    let dest = cities.filter(c => c !== origin);
    dest = dest[Math.floor(Math.random() * dest.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const cls = classes[Math.floor(Math.random() * classes.length)];
    const hour = Math.floor(6 + Math.random() * 12);
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const depTime = `${String(hour).padStart(2, '0')}:${minute}`;
    const arrHour = (hour + Math.floor(2 + Math.random() * 6)) % 24;
    const arrTime = `${String(arrHour).padStart(2, '0')}:${minute}`;
    const fare = Math.floor(200 + Math.random() * 800);
    const tax = fare * 0.15;
    const total = fare + tax;

    return {
      passenger_name: `PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      passenger_phone: `+966 5${Math.floor(10000000 + Math.random() * 90000000)}`,
      passenger_email: `passenger${Math.floor(100 + Math.random() * 900)}@email.com`,
      airline: airline.code,
      airline_name: airline.name,
      flight_number: `${airline.code}${flightNum}`,
      origin: origin,
      destination: dest,
      departure_date: today,
      departure_time: depTime,
      arrival_time: arrTime,
      seat_number: `${String.fromCharCode(65 + Math.floor(Math.random() * 30))}${Math.floor(1 + Math.random() * 50)}`,
      booking_reference: `${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      ticket_number: `TKT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: status,
      class: cls,
      gate: gates[Math.floor(Math.random() * gates.length)] + Math.floor(1 + Math.random() * 30),
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      baggage: `${Math.floor(20 + Math.random() * 20)} Kg`,
      meal: ['Standard', 'Vegetarian', 'Halal', 'Kosher', 'Gluten-Free'][Math.floor(Math.random() * 5)],
      special_requests: '',
      fare: fare,
      tax: tax,
      total: total
    };
  };

  const handleGenerateTicket = (e) => {
    e.preventDefault();
    const ticket = generateRandomTicket();
    setTicketForm({
      passenger_name: ticket.passenger_name,
      passenger_phone: ticket.passenger_phone,
      passenger_email: ticket.passenger_email,
      airline: ticket.airline,
      airline_name: ticket.airline_name,
      flight_number: ticket.flight_number,
      origin: ticket.origin,
      destination: ticket.destination,
      departure_date: ticket.departure_date,
      departure_time: ticket.departure_time,
      arrival_time: ticket.arrival_time,
      seat_number: ticket.seat_number,
      booking_reference: ticket.booking_reference,
      ticket_number: ticket.ticket_number,
      status: ticket.status,
      class: ticket.class,
      gate: ticket.gate,
      terminal: ticket.terminal,
      baggage: ticket.baggage,
      meal: ticket.meal,
      special_requests: '',
      fare: ticket.fare,
      tax: ticket.tax,
      total: ticket.total
    });
    showToast?.(isAr ? '✅ تم إنشاء تذكرة جديدة!' : '✅ New ticket generated!');
  };

  const handleSaveTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.passenger_name || !ticketForm.flight_number || !ticketForm.origin || !ticketForm.destination) {
      showToast?.(isAr ? '⚠️ الرجاء ملء جميع الحقول المطلوبة' : '⚠️ Please fill all required fields');
      return;
    }

    try {
      const payload = {
        ...ticketForm,
        tenant_id: userProfile.tenant_id
      };

      if (editingId) {
        setTickets(prev => prev.map(t => t.id === editingId ? { ...t, ...payload, id: t.id } : t));
        showToast?.(isAr ? '✅ تم تحديث التذكرة!' : '✅ Ticket updated!');
        setEditingId(null);
      } else {
        const newTicket = {
          ...payload,
          id: `tkt-${Date.now()}`,
          created_at: new Date().toISOString()
        };
        setTickets(prev => [newTicket, ...prev]);
        showToast?.(isAr ? '✅ تم حفظ التذكرة!' : '✅ Ticket saved!');
      }

      setTicketForm({
        passenger_name: '',
        passenger_phone: '',
        passenger_email: '',
        airline: '',
        airline_name: '',
        flight_number: '',
        origin: '',
        destination: '',
        departure_date: today,
        departure_time: '08:00',
        arrival_time: '12:00',
        seat_number: '',
        booking_reference: '',
        ticket_number: '',
        status: 'Confirmed',
        class: 'Economy',
        gate: '',
        terminal: '',
        baggage: '30 Kg',
        meal: 'Standard',
        special_requests: '',
        fare: 0,
        tax: 0,
        total: 0
      });
    } catch (err) {
      showToast?.(isAr ? '❌ خطأ: ' + err.message : '❌ Error: ' + err.message);
    }
  };

  const handleEditTicket = (ticket) => {
    setEditingId(ticket.id);
    setTicketForm({
      passenger_name: ticket.passenger_name || '',
      passenger_phone: ticket.passenger_phone || '',
      passenger_email: ticket.passenger_email || '',
      airline: ticket.airline || '',
      airline_name: ticket.airline_name || '',
      flight_number: ticket.flight_number || '',
      origin: ticket.origin || '',
      destination: ticket.destination || '',
      departure_date: ticket.departure_date || today,
      departure_time: ticket.departure_time || '08:00',
      arrival_time: ticket.arrival_time || '12:00',
      seat_number: ticket.seat_number || '',
      booking_reference: ticket.booking_reference || '',
      ticket_number: ticket.ticket_number || '',
      status: ticket.status || 'Confirmed',
      class: ticket.class || 'Economy',
      gate: ticket.gate || '',
      terminal: ticket.terminal || '',
      baggage: ticket.baggage || '30 Kg',
      meal: ticket.meal || 'Standard',
      special_requests: ticket.special_requests || '',
      fare: ticket.fare || 0,
      tax: ticket.tax || 0,
      total: ticket.total || 0
    });
  };

  const handleDeleteTicket = (id) => {
    if (!confirm(isAr ? 'حذف هذه التذكرة؟' : 'Delete this ticket?')) return;
    setTickets(prev => prev.filter(t => t.id !== id));
    showToast?.(isAr ? '✅ تم الحذف!' : '✅ Deleted!');
  };

  // PNR Check
  const handlePnrCheck = (e) => {
    e.preventDefault();
    if (!pnrCheck) {
      showToast?.(isAr ? '⚠️ الرجاء إدخال رقم الحجز' : '⚠️ Please enter PNR');
      return;
    }
    const found = tickets.find(t => t.booking_reference?.toUpperCase() === pnrCheck.toUpperCase());
    if (!found) {
      showToast?.(isAr ? '❌ لا توجد تذكرة بهذا الرقم' : '❌ No ticket found with this PNR');
      setPnrResult(null);
      return;
    }
    setPnrResult(found);
    showToast?.(isAr ? '✅ تم العثور على التذكرة!' : '✅ Ticket found!');
  };

  // ============================================================
  // PRINT TICKET – matching the PDF sample exactly
  // ============================================================
  const handlePrintTicket = (ticket) => {
    // Build the detailed HTML exactly like the sample
    const printContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ticket ${ticket.flight_number}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
    .ticket { border: 2px solid #1E3A8A; border-radius: 16px; padding: 20px; max-width: 800px; margin: auto; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1E3A8A; padding-bottom: 10px; }
    .header .left { font-weight: bold; font-size: 14px; }
    .header .right { text-align: right; font-size: 12px; }
    .ref-no { font-size: 12px; color: #666; }
    .status { display: inline-block; background: #D1FAE5; color: #065F46; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 5px; }
    .flight-details { margin: 15px 0; padding: 10px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; }
    .flight-details h3 { margin: 0 0 10px; color: #1E3A8A; font-size: 18px; }
    .flight-details .route { font-size: 16px; font-weight: bold; color: #1E3A8A; }
    .flight-details .airline-ref { font-size: 12px; color: #64748B; }
    .flight-details .crs-ref { font-size: 12px; color: #64748B; }
    .flight-details table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    .flight-details th { background: #1E3A8A; color: white; padding: 8px; text-align: left; }
    .flight-details td { padding: 6px 8px; border-bottom: 1px solid #E2E8F0; }
    .traveler-info { margin: 15px 0; padding: 10px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; }
    .traveler-info h3 { margin: 0 0 10px; color: #1E3A8A; }
    .traveler-info .row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #E2E8F0; }
    .traveler-info .row:last-child { border-bottom: none; }
    .baggage { margin: 15px 0; padding: 10px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; }
    .baggage h3 { margin: 0 0 10px; color: #1E3A8A; }
    .baggage .item { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #E2E8F0; }
    .baggage .item:last-child { border-bottom: none; }
    .note { margin: 15px 0; padding: 10px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; color: #991B1B; font-size: 12px; }
    .note strong { color: #DC2626; }
    .footer { margin-top: 15px; text-align: center; font-size: 10px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 10px; }
    .web-checkin { background: #EFF6FF; padding: 8px 12px; border-radius: 8px; display: inline-block; margin-top: 5px; }
    .web-checkin a { color: #2563EB; text-decoration: none; font-weight: bold; }
    @media print { body { background: white; padding: 0; } .ticket { border: none; box-shadow: none; } }
  </style>
</head>
<body>
<div class="ticket">
  <div class="header">
    <div class="left">
      <strong>Name :</strong> SUEUD AL TAAYIRA<br>
      <span class="ref-no">Ref.No: ${ticket.ticket_number || 'N/A'}</span>
    </div>
    <div class="right">
      <strong>Date of Booking:</strong> ${ticket.departure_date}<br>
      <span class="status">${ticket.status}</span>
    </div>
  </div>

  <div class="flight-details">
    <h3>ONWARD ${ticket.origin} → ${ticket.destination}</h3>
    <div class="route">${ticket.departure_date} | Non Stop | 01 hrs 50 mins</div>
    <div class="airline-ref">Airline Ref : ${ticket.booking_reference || 'N/A'}</div>
    <div class="crs-ref">CRS Ref : ${ticket.pnr || 'N/A'}</div>
    <div style="margin-top:5px;"><strong>${ticket.airline_name || ticket.airline}</strong></div>
    <div>Travel Class: ${ticket.class}</div>
    <div>Check-In Baggage: Adult - 2 PC | 1 Piece equal 23 Kg</div>
    <div>Cabin Baggage: Adult 1 PC : 1 Piece equal 7 Kg</div>
    <table>
      <tr>
        <th>Flight Number</th>
        <th>From (Terminal)</th>
        <th>Departure date &amp; time</th>
        <th>Stops</th>
        <th>To (Terminal)</th>
        <th>Arrival date &amp; time</th>
      </tr>
      <tr>
        <td>${ticket.flight_number} (AIRBUS JET 320)</td>
        <td>${ticket.origin} [${ticket.origin.match(/\(([^)]+)\)/)?.[1] || 'JED'}]<br>${ticket.origin}<br>Saudi Arabia<br>Terminal ${ticket.terminal || '1'}</td>
        <td>${ticket.departure_time}<br>${ticket.departure_date}</td>
        <td>Non Stop<br>(01h:50m)</td>
        <td>${ticket.destination} [${ticket.destination.match(/\(([^)]+)\)/)?.[1] || 'RAE'}]<br>${ticket.destination}<br>Saudi Arabia</td>
        <td>${ticket.arrival_time}<br>${ticket.departure_date}</td>
      </tr>
    </table>
    ${ticket.booking_reference ? `<div class="web-checkin"><a href="https://www.google.com/search?q=${encodeURIComponent(ticket.airline_name + ' online check in ' + ticket.booking_reference)}" target="_blank">🌐 Web check-in</a></div>` : ''}
  </div>

  <div class="traveler-info">
    <h3>Traveler(s) Information</h3>
    <div class="row"><span><strong>Code</strong></span><span><strong>Name</strong></span><span><strong>Ticket No.</strong></span></div>
    <div class="row"><span>Mr.</span><span>${ticket.passenger_name}</span><span>${ticket.ticket_number || 'N/A'}</span></div>
  </div>

  <div class="baggage">
    <h3>Baggage</h3>
    <div class="item"><span>Carry-On : Adult 1 PC : 1 Piece equal 7 Kg</span><span>Bag 1 Chgs May Apply if Bags Exceed Ttl Wt Allowance</span></div>
    <div class="item"><span>Baggage Allowance : Adult - 2 PC | 1 Piece equal 23 Kg</span><span>Bag 2 Chgs May Apply if Bags Exceed Ttl Wt Allowance</span></div>
    <div class="item" style="font-size:10px;color:#64748B;">Refer to airline baggage policy for further details.</div>
  </div>

  <div class="note">
    <strong>Important Note :</strong> Transit Visa is a mandatory requirement if there are via TWO Schengen countries or TWO stop in same countries<br>
    <strong>Important Note :</strong> Refund/date change penalties upto 100% may apply.
  </div>

  <div class="footer">
    Computer-generated ticket. Valid without signature.
  </div>
</div>
</body>
</html>`;
    const win = window.open('', '_blank', 'width=800,height=600');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      setTimeout(() => { win.focus(); win.print(); }, 500);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛫 {isAr ? 'إنشاء تذكرة طيران' : 'Flight Ticket Generator'}</h1>
        <button onClick={handleGenerateTicket} style={{ ...styles.btn, ...styles.btnWarning }}>
          🎲 {isAr ? 'توليد عشوائي' : 'Random Generate'}
        </button>
      </div>

      {/* PNR Check Section */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>🔍 {isAr ? 'التحقق من رقم الحجز (PNR)' : 'PNR Check'}</h3>
        <form onSubmit={handlePnrCheck} style={styles.formRow}>
          <div>
            <label style={styles.label}>{isAr ? 'رقم الحجز (PNR)' : 'Booking Reference (PNR)'}</label>
            <input
              style={styles.input}
              placeholder={isAr ? 'مثال: ABC123' : 'e.g. ABC123'}
              value={pnrCheck}
              onChange={e => setPnrCheck(e.target.value.toUpperCase())}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '12px' }}>
              🔍 {isAr ? 'تحقق' : 'Check'}
            </button>
          </div>
        </form>
        {pnrResult && (
          <div style={{ marginTop: '15px', padding: '12px', background: isDark ? '#0F172A' : '#F1F5F9', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div><strong>{isAr ? 'المسافر' : 'Passenger'}:</strong> {pnrResult.passenger_name}</div>
              <div><strong>{isAr ? 'الرحلة' : 'Flight'}:</strong> {pnrResult.flight_number}</div>
              <div><strong>{isAr ? 'الحالة' : 'Status'}:</strong> {pnrResult.status}</div>
              <div><strong>{isAr ? 'من' : 'From'}:</strong> {pnrResult.origin}</div>
              <div><strong>{isAr ? 'إلى' : 'To'}:</strong> {pnrResult.destination}</div>
              <div><strong>{isAr ? 'التاريخ' : 'Date'}:</strong> {pnrResult.departure_date}</div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Form */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>
          {editingId ? '✏️ ' + (isAr ? 'تعديل التذكرة' : 'Edit Ticket') : '📝 ' + (isAr ? 'إنشاء تذكرة جديدة' : 'Create New Ticket')}
        </h3>
        <form onSubmit={handleSaveTicket} style={styles.formRow}>
          <div>
            <label style={styles.label}>{isAr ? 'اسم المسافر *' : 'Passenger Name *'}</label>
            <input style={styles.input} value={ticketForm.passenger_name} onChange={e => setTicketForm({ ...ticketForm, passenger_name: e.target.value })} required />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الهاتف' : 'Phone'}</label>
            <input style={styles.input} value={ticketForm.passenger_phone} onChange={e => setTicketForm({ ...ticketForm, passenger_phone: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" value={ticketForm.passenger_email} onChange={e => setTicketForm({ ...ticketForm, passenger_email: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'شركة الطيران *' : 'Airline *'}</label>
            <select style={styles.select} value={ticketForm.airline} onChange={(e) => {
              const selected = airlines.find(a => a.code === e.target.value);
              setTicketForm({ ...ticketForm, airline: e.target.value, airline_name: selected?.name || '' });
            }} required>
              <option value="">{isAr ? 'اختر الخطوط' : 'Select Airline'}</option>
              {airlines.map(a => <option key={a.code} value={a.code}>{a.code} - {a.name}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'رقم الرحلة *' : 'Flight Number *'}</label>
            <input style={styles.input} placeholder="e.g. SV101" value={ticketForm.flight_number} onChange={e => setTicketForm({ ...ticketForm, flight_number: e.target.value.toUpperCase() })} required />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'من *' : 'From *'}</label>
            <select style={styles.select} value={ticketForm.origin} onChange={e => setTicketForm({ ...ticketForm, origin: e.target.value })} required>
              <option value="">{isAr ? 'اختر المدينة' : 'Select City'}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'إلى *' : 'To *'}</label>
            <select style={styles.select} value={ticketForm.destination} onChange={e => setTicketForm({ ...ticketForm, destination: e.target.value })} required>
              <option value="">{isAr ? 'اختر المدينة' : 'Select City'}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'تاريخ المغادرة' : 'Departure Date'}</label>
            <input type="date" style={styles.input} value={ticketForm.departure_date} onChange={e => setTicketForm({ ...ticketForm, departure_date: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'وقت المغادرة' : 'Departure Time'}</label>
            <input type="time" style={styles.input} value={ticketForm.departure_time} onChange={e => setTicketForm({ ...ticketForm, departure_time: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'وقت الوصول' : 'Arrival Time'}</label>
            <input type="time" style={styles.input} value={ticketForm.arrival_time} onChange={e => setTicketForm({ ...ticketForm, arrival_time: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'رقم المقعد' : 'Seat Number'}</label>
            <input style={styles.input} placeholder="e.g. 12A" value={ticketForm.seat_number} onChange={e => setTicketForm({ ...ticketForm, seat_number: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'رقم الحجز' : 'Booking Reference'}</label>
            <input style={styles.input} placeholder="e.g. ABC123" value={ticketForm.booking_reference} onChange={e => setTicketForm({ ...ticketForm, booking_reference: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'رقم التذكرة' : 'Ticket Number'}</label>
            <input style={styles.input} placeholder="e.g. TKT-123456" value={ticketForm.ticket_number} onChange={e => setTicketForm({ ...ticketForm, ticket_number: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الحالة' : 'Status'}</label>
            <select style={styles.select} value={ticketForm.status} onChange={e => setTicketForm({ ...ticketForm, status: e.target.value })}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الدرجة' : 'Class'}</label>
            <select style={styles.select} value={ticketForm.class} onChange={e => setTicketForm({ ...ticketForm, class: e.target.value })}>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'البوابة' : 'Gate'}</label>
            <input style={styles.input} placeholder="e.g. B12" value={ticketForm.gate} onChange={e => setTicketForm({ ...ticketForm, gate: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الصالة' : 'Terminal'}</label>
            <input style={styles.input} placeholder="e.g. 3" value={ticketForm.terminal} onChange={e => setTicketForm({ ...ticketForm, terminal: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الأمتعة' : 'Baggage'}</label>
            <input style={styles.input} placeholder="e.g. 30 Kg" value={ticketForm.baggage} onChange={e => setTicketForm({ ...ticketForm, baggage: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الوجبة' : 'Meal'}</label>
            <select style={styles.select} value={ticketForm.meal} onChange={e => setTicketForm({ ...ticketForm, meal: e.target.value })}>
              <option>Standard</option><option>Vegetarian</option><option>Halal</option><option>Kosher</option><option>Gluten-Free</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'السعر (ريال)' : 'Fare (SAR)'}</label>
            <input type="number" step="0.01" style={styles.input} value={ticketForm.fare} onChange={e => setTicketForm({ ...ticketForm, fare: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الإجمالي' : 'Total'}</label>
            <input type="number" step="0.01" style={{ ...styles.input, fontWeight: 700, color: '#34D399' }} value={ticketForm.total} onChange={e => setTicketForm({ ...ticketForm, total: parseFloat(e.target.value) || 0 })} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, padding: '12px 30px' }}>
              {editingId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '✅ ' + (isAr ? 'حفظ التذكرة' : 'Save Ticket')}
            </button>
            {editingId && (
              <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setEditingId(null); setTicketForm({ passenger_name: '', passenger_phone: '', passenger_email: '', airline: '', airline_name: '', flight_number: '', origin: '', destination: '', departure_date: today, departure_time: '08:00', arrival_time: '12:00', seat_number: '', booking_reference: '', ticket_number: '', status: 'Confirmed', class: 'Economy', gate: '', terminal: '', baggage: '30 Kg', meal: 'Standard', special_requests: '', fare: 0, tax: 0, total: 0 }); }}>
                ✕ {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tickets List */}
      {tickets.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? 'سجل التذاكر' : 'Ticket History'}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'المسافر' : 'Passenger'}</th>
                  <th style={styles.th}>{isAr ? 'الرحلة' : 'Flight'}</th>
                  <th style={styles.th}>{isAr ? 'من' : 'From'}</th>
                  <th style={styles.th}>{isAr ? 'إلى' : 'To'}</th>
                  <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                  <th style={styles.th}>{isAr ? 'الحالة' : 'Status'}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{t.passenger_name}</td>
                    <td style={{ ...styles.td, color: '#60A5FA', fontWeight: 600 }}>{t.flight_number}</td>
                    <td style={styles.td}>{t.origin}</td>
                    <td style={styles.td}>{t.destination}</td>
                    <td style={styles.td}>{t.departure_date}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...(t.status === 'Confirmed' || t.status === 'On Time' ? styles.badgeSuccess : t.status === 'Cancelled' ? styles.badgeDanger : styles.badgeWarning) }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }} onClick={() => handlePrintTicket(t)}>🖨️</button>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditTicket(t)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteTicket(t.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FREQUENT FLYER VIEW
// ============================================================
function FrequentFlyerView(props) {
  const { data, tr, today, userProfile, showToast, setData, logAction, lang, theme } = props;
  const { isAr, isDark, styles, fmt, t } = useTravelHelpers(props);
  const [ffMembers, setFfMembers] = useState([]);
  const [ffForm, setFfForm] = useState({
    customer_name: '',
    airline: '',
    membership_no: '',
    tier: 'Blue',
    points: 0,
    status: 'Active'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (userProfile?.tenant_id) {
      supabase.from('frequent_flyer')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
        .order('points', { ascending: false })
        .then(({ data }) => {
          if (data) setFfMembers(data);
        })
        .catch(() => setFfMembers([]));
    }
  }, [userProfile?.tenant_id]);

  const handleFfSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...ffForm, tenant_id: userProfile.tenant_id };
      if (editingId) {
        const { data: up, error } = await supabase.from('frequent_flyer').update(payload).eq('id', editingId).select().single();
        if (error) throw error;
        setFfMembers(prev => prev.map(f => f.id === editingId ? up : f));
        showToast?.(isAr ? '✅ تم التحديث!' : '✅ Updated!');
        setEditingId(null);
      } else {
        const { data: newMember, error } = await supabase.from('frequent_flyer').insert([payload]).select().single();
        if (error) throw error;
        setFfMembers(prev => [newMember, ...prev]);
        showToast?.(isAr ? '✅ تمت الإضافة!' : '✅ Added!');
        await logAction?.(`Frequent flyer: ${ffForm.customer_name}`);
      }
      setFfForm({
        customer_name: '',
        airline: '',
        membership_no: '',
        tier: 'Blue',
        points: 0,
        status: 'Active'
      });
    } catch (err) {
      showToast?.(isAr ? '❌ خطأ: ' + err.message : '❌ Error: ' + err.message);
    }
  };

  const handleEditFf = (member) => {
    setEditingId(member.id);
    setFfForm({
      customer_name: member.customer_name,
      airline: member.airline,
      membership_no: member.membership_no,
      tier: member.tier,
      points: member.points,
      status: member.status
    });
  };

  const handleDeleteFf = async (id) => {
    if (!confirm(isAr ? 'حذف هذا العضو؟' : 'Delete this member?')) return;
    try {
      const { error } = await supabase.from('frequent_flyer').delete().eq('id', id);
      if (error) throw error;
      setFfMembers(prev => prev.filter(f => f.id !== id));
      showToast?.(isAr ? '✅ تم الحذف!' : '✅ Deleted!');
    } catch (err) {
      showToast?.(isAr ? '❌ خطأ: ' + err.message : '❌ Error: ' + err.message);
    }
  };

  const getTierColor = (tier) => {
    const map = { 'Blue': '#3B82F6', 'Silver': '#94A3B8', 'Gold': '#FBBF24', 'Platinum': '#A78BFA', 'Diamond': '#34D399' };
    return map[tier] || '#3B82F6';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🌟 {isAr ? 'إدارة المسافر الدائم' : 'Frequent Flyer Management'}</h1>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{editingId ? '✏️ ' + (isAr ? 'تعديل العضو' : 'Edit Member') : '➕ ' + (isAr ? 'إضافة عضو' : 'Add Member')}</h3>
        <form onSubmit={handleFfSubmit} style={styles.formRow}>
          <div>
            <label style={styles.label}>{isAr ? 'اسم العميل' : 'Customer Name'}</label>
            <input style={styles.input} value={ffForm.customer_name} onChange={e => setFfForm({ ...ffForm, customer_name: e.target.value })} required />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'خط الطيران' : 'Airline'}</label>
            <input style={styles.input} value={ffForm.airline} onChange={e => setFfForm({ ...ffForm, airline: e.target.value })} placeholder={isAr ? 'مثال: السعودية، الإمارات' : 'e.g. Saudia, Emirates'} required />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'رقم العضوية' : 'Membership No'}</label>
            <input style={styles.input} value={ffForm.membership_no} onChange={e => setFfForm({ ...ffForm, membership_no: e.target.value })} required />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'المستوى' : 'Tier'}</label>
            <select style={styles.select} value={ffForm.tier} onChange={e => setFfForm({ ...ffForm, tier: e.target.value })}>
              <option>Blue</option><option>Silver</option><option>Gold</option><option>Platinum</option><option>Diamond</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'النقاط' : 'Points'}</label>
            <input type="number" style={styles.input} value={ffForm.points} onChange={e => setFfForm({ ...ffForm, points: parseInt(e.target.value) })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الحالة' : 'Status'}</label>
            <select style={styles.select} value={ffForm.status} onChange={e => setFfForm({ ...ffForm, status: e.target.value })}>
              <option>Active</option><option>Inactive</option><option>Expired</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '12px' }}>
              {editingId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '✅ ' + (isAr ? 'إضافة' : 'Add')}
            </button>
            {editingId && (
              <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setEditingId(null); setFfForm({ customer_name: '', airline: '', membership_no: '', tier: 'Blue', points: 0, status: 'Active' }); }}>
                ✕ {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>

      {ffMembers.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? 'قائمة الأعضاء' : 'Member List'}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'العميل' : 'Customer'}</th>
                  <th style={styles.th}>{isAr ? 'الخطوط' : 'Airline'}</th>
                  <th style={styles.th}>{isAr ? 'رقم العضوية' : 'Membership'}</th>
                  <th style={styles.th}>{isAr ? 'المستوى' : 'Tier'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'النقاط' : 'Points'}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {ffMembers.map(m => (
                  <tr key={m.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{m.customer_name}</td>
                    <td style={styles.td}>{m.airline}</td>
                    <td style={styles.td}>{m.membership_no}</td>
                    <td style={styles.td}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        background: getTierColor(m.tier) + '20',
                        color: getTierColor(m.tier),
                        fontWeight: 700,
                        fontSize: '12px'
                      }}>
                        {m.tier}
                      </span>
                    </td>
                    <td style={{ ...styles.tdRight, color: '#FBBF24', fontWeight: 700 }}>{m.points}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditFf(m)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteFf(m.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CORPORATE TRAVEL VIEW
// ============================================================
function CorporateTravelView(props) {
  const { data, tr, today, userProfile, showToast, setData, logAction, lang, theme } = props;
  const { isAr, isDark, styles, fmt, t } = useTravelHelpers(props);
  const [corpTravels, setCorpTravels] = useState([]);

  useEffect(() => {
    if (userProfile?.tenant_id) {
      supabase.from('corporate_travel')
        .select('*, corporates(name)')
        .eq('tenant_id', userProfile.tenant_id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setCorpTravels(data);
        })
        .catch(() => setCorpTravels([]));
    }
  }, [userProfile?.tenant_id]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏢 {isAr ? 'السفر المؤسسي' : 'Corporate Travel'}</h1>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{isAr ? 'ملخص السفر المؤسسي' : 'Corporate Travel Summary'}</h3>
        <div style={styles.grid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>📋 {isAr ? 'إجمالي الحجوزات' : 'Total Bookings'}</div>
            <div style={styles.statValue}>{corpTravels.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>🏢 {isAr ? 'الشركات النشطة' : 'Active Corporate Clients'}</div>
            <div style={styles.statValue}>{(data.corporates || []).length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>💰 {isAr ? 'إجمالي الإنفاق' : 'Total Spend'}</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>
              {corpTravels.reduce((s, t) => s + (t.total_amount || 0), 0).toFixed(2)} SAR
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{isAr ? 'الحجوزات المؤسسية الحديثة' : 'Recent Corporate Bookings'}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{isAr ? 'الشركة' : 'Corporate'}</th>
                <th style={styles.th}>{isAr ? 'محجوز بواسطة' : 'Booked By'}</th>
                <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {corpTravels.map(t => (
                <tr key={t.id}>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{t.corporates?.name || 'N/A'}</td>
                  <td style={styles.td}>{t.booked_by || 'N/A'}</td>
                  <td style={styles.td}>{t.booking_date}</td>
                  <td style={{ ...styles.tdRight, color: '#34D399', fontWeight: 700 }}>{(t.total_amount || 0).toFixed(2)} SAR</td>
                  <td style={styles.tdCenter}>
                    <span style={{ ...styles.badge, ...styles.badgeSuccess }}>{t.status || 'Confirmed'}</span>
                  </td>
                </tr>
              ))}
              {corpTravels.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                    {isAr ? 'لا توجد حجوزات سفر مؤسسي.' : 'No corporate travel bookings yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// VISA PROCESSING VIEW – NEW
// ============================================================
function VisaProcessingView(props) {
  const { data, tr, today, userProfile, showToast, setData, logAction, lang, theme } = props;
  const { isAr, isDark, styles, fmt, t } = useTravelHelpers(props);
  const [visaApps, setVisaApps] = useState([]);
  const [visaForm, setVisaForm] = useState({
    applicant_name: '',
    passport_no: '',
    nationality: '',
    visa_type: 'Tourist',
    destination: '',
    application_date: today,
    status: 'Pending',
    notes: '',
    customer_id: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (userProfile?.tenant_id) {
      supabase.from('visa_applications')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
        .order('application_date', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setVisaApps(data);
          } else {
            // Fallback to invoices with service_type 'Visa'
            const visaInvs = (data.invoices || []).filter(i => i.service_type === 'Visa');
            const mapped = visaInvs.map(inv => ({
              id: inv.id,
              applicant_name: inv.customers?.name || inv.old_customer_name || 'N/A',
              passport_no: inv.ticket_no || 'N/A',
              nationality: inv.flight_type || 'N/A',
              visa_type: inv.sector || 'Tourist',
              destination: inv.flight_sector || 'N/A',
              application_date: inv.invoice_date,
              status: inv.status === 'Paid' ? 'Approved' : 'Pending',
              notes: inv.notes || '',
              customer_id: inv.customer_id
            }));
            setVisaApps(mapped);
          }
        });
    }
  }, [userProfile?.tenant_id]);

  const handleVisaSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...visaForm, tenant_id: userProfile.tenant_id };
      if (editingId) {
        const { data: up, error } = await supabase
          .from('visa_applications')
          .update(payload)
          .eq('id', editingId)
          .select()
          .single();
        if (error) throw error;
        setVisaApps(prev => prev.map(v => v.id === editingId ? up : v));
        showToast(isAr ? '✅ تم تحديث طلب التأشيرة' : '✅ Visa application updated');
        setEditingId(null);
      } else {
        const { data: newApp, error } = await supabase
          .from('visa_applications')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        setVisaApps(prev => [newApp, ...prev]);
        showToast(isAr ? '✅ تم إنشاء طلب تأشيرة جديد' : '✅ New visa application created');
        await logAction(`Visa application for ${visaForm.applicant_name}`);
      }
      setVisaForm({
        applicant_name: '',
        passport_no: '',
        nationality: '',
        visa_type: 'Tourist',
        destination: '',
        application_date: today,
        status: 'Pending',
        notes: '',
        customer_id: ''
      });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleEditVisa = (app) => {
    setEditingId(app.id);
    setVisaForm({
      applicant_name: app.applicant_name || '',
      passport_no: app.passport_no || '',
      nationality: app.nationality || '',
      visa_type: app.visa_type || 'Tourist',
      destination: app.destination || '',
      application_date: app.application_date || today,
      status: app.status || 'Pending',
      notes: app.notes || '',
      customer_id: app.customer_id || ''
    });
  };

  const handleDeleteVisa = async (app) => {
    if (!confirm(isAr ? 'حذف طلب التأشيرة هذا؟' : 'Delete this visa application?')) return;
    try {
      const { error } = await supabase.from('visa_applications').delete().eq('id', app.id);
      if (error) throw error;
      setVisaApps(prev => prev.filter(v => v.id !== app.id));
      showToast(isAr ? '✅ تم الحذف' : '✅ Deleted');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛂 {isAr ? 'معالجة التأشيرات' : 'Visa Processing'}</h1>
        <button style={{ ...styles.btn, ...styles.btnInfo }} onClick={() => {
          const pending = visaApps.filter(v => v.status === 'Pending');
          if (pending.length === 0) showToast(isAr ? 'لا توجد طلبات معلقة' : 'No pending applications');
          else showToast(`📋 ${pending.length} ${isAr ? 'طلب معلق' : 'pending applications'}`);
        }}>
          {isAr ? 'عرض المعلقة' : 'Show Pending'}
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{editingId ? '✏️ ' + (isAr ? 'تعديل الطلب' : 'Edit Application') : '📝 ' + (isAr ? 'طلب تأشيرة جديد' : 'New Visa Application')}</h3>
        <form onSubmit={handleVisaSubmit} style={styles.formRow}>
          <div>
            <label style={styles.label}>{isAr ? 'اسم مقدم الطلب' : 'Applicant Name'}</label>
            <input style={styles.input} value={visaForm.applicant_name} onChange={e => setVisaForm({ ...visaForm, applicant_name: e.target.value })} required />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'رقم جواز السفر' : 'Passport No'}</label>
            <input style={styles.input} value={visaForm.passport_no} onChange={e => setVisaForm({ ...visaForm, passport_no: e.target.value })} required />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الجنسية' : 'Nationality'}</label>
            <input style={styles.input} value={visaForm.nationality} onChange={e => setVisaForm({ ...visaForm, nationality: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'نوع التأشيرة' : 'Visa Type'}</label>
            <select style={styles.select} value={visaForm.visa_type} onChange={e => setVisaForm({ ...visaForm, visa_type: e.target.value })}>
              <option>Tourist</option><option>Business</option><option>Work</option><option>Transit</option><option>Hajj</option><option>Umrah</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الوجهة' : 'Destination'}</label>
            <input style={styles.input} value={visaForm.destination} onChange={e => setVisaForm({ ...visaForm, destination: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'تاريخ التقديم' : 'Application Date'}</label>
            <input type="date" style={styles.input} value={visaForm.application_date} onChange={e => setVisaForm({ ...visaForm, application_date: e.target.value })} required />
          </div>
          <div>
            <label style={styles.label}>{isAr ? 'الحالة' : 'Status'}</label>
            <select style={styles.select} value={visaForm.status} onChange={e => setVisaForm({ ...visaForm, status: e.target.value })}>
              <option>Pending</option><option>Processing</option><option>Approved</option><option>Rejected</option><option>Issued</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={styles.label}>{isAr ? 'ملاحظات' : 'Notes'}</label>
            <textarea style={styles.textarea} value={visaForm.notes} onChange={e => setVisaForm({ ...visaForm, notes: e.target.value })} rows={2} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, padding: '12px 30px' }}>
              {editingId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '✅ ' + (isAr ? 'إنشاء' : 'Create')}
            </button>
            {editingId && (
              <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setEditingId(null); setVisaForm({ applicant_name: '', passport_no: '', nationality: '', visa_type: 'Tourist', destination: '', application_date: today, status: 'Pending', notes: '', customer_id: '' }); }}>
                ✕ {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{isAr ? 'قائمة طلبات التأشيرة' : 'Visa Applications'}</h3>
        {visaApps.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🛂</div>
            <p style={{ color: '#94A3B8' }}>{isAr ? 'لا توجد طلبات تأشيرة.' : 'No visa applications found.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'مقدم الطلب' : 'Applicant'}</th>
                  <th style={styles.th}>{isAr ? 'جواز السفر' : 'Passport'}</th>
                  <th style={styles.th}>{isAr ? 'النوع' : 'Type'}</th>
                  <th style={styles.th}>{isAr ? 'الوجهة' : 'Destination'}</th>
                  <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                  <th style={styles.th}>{isAr ? 'الحالة' : 'Status'}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {visaApps.map(a => (
                  <tr key={a.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{a.applicant_name}</td>
                    <td style={styles.td}>{a.passport_no}</td>
                    <td style={styles.td}>{a.visa_type}</td>
                    <td style={styles.td}>{a.destination}</td>
                    <td style={styles.td}>{a.application_date}</td>
                    <td style={styles.td}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        background: a.status === 'Approved' ? '#065F46' : a.status === 'Rejected' ? '#7F1D1D' : '#78350F',
                        color: a.status === 'Approved' ? '#34D399' : a.status === 'Rejected' ? '#FCA5A5' : '#FBBF24'
                      }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditVisa(a)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteVisa(a)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
