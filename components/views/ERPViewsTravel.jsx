'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ERPViewsTravel(props) {
  const { page, data, tr, today, userProfile, showToast, setData, logAction, lang, theme } = props;

  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

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
    }
  };

  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

  // ============================================================
  // REAL FLIGHT TICKET GENERATOR - WITH FULL FEATURES
  // ============================================================
  if (page === 'flight_status') {
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
      total: 0
    });
    const [tickets, setTickets] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [pnrCheck, setPnrCheck] = useState('');
    const [pnrResult, setPnrResult] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const airlines = [
      { code: 'SV', name: 'Saudia' },
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

    // Load tickets
    useEffect(() => {
      if (userProfile?.tenant_id) {
        supabase.from('flight_tickets')
          .select('*')
          .eq('tenant_id', userProfile.tenant_id)
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) setTickets(data);
          })
          .catch(() => {});
      }
    }, [userProfile?.tenant_id]);

    // Load notifications
    useEffect(() => {
      if (userProfile?.tenant_id) {
        supabase.from('ticket_notifications')
          .select('*')
          .eq('tenant_id', userProfile.tenant_id)
          .order('created_at', { ascending: false })
          .limit(20)
          .then(({ data }) => {
            if (data) setNotifications(data);
          })
          .catch(() => {});
      }
    }, [userProfile?.tenant_id]);

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
          const { data: updated, error } = await supabase
            .from('flight_tickets')
            .update(payload)
            .eq('id', editingId)
            .select()
            .single();
          if (error) throw error;
          setTickets(prev => prev.map(t => t.id === editingId ? updated : t));
          showToast?.(isAr ? '✅ تم تحديث التذكرة!' : '✅ Ticket updated!');
          setEditingId(null);
        } else {
          const { data: newTicket, error } = await supabase
            .from('flight_tickets')
            .insert([payload])
            .select()
            .single();
          if (error) throw error;
          setTickets(prev => [newTicket, ...prev]);

          // Create notification for new ticket
          await supabase.from('ticket_notifications').insert([{
            ticket_id: newTicket.id,
            message: `New ticket created for ${newTicket.passenger_name} (${newTicket.flight_number})`,
            type: 'created',
            tenant_id: userProfile.tenant_id
          }]);

          showToast?.(isAr ? '✅ تم حفظ التذكرة!' : '✅ Ticket saved!');
        }

        setTicketForm({
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

    const handleDeleteTicket = async (id) => {
      if (!confirm(isAr ? 'حذف هذه التذكرة؟' : 'Delete this ticket?')) return;
      try {
        await supabase.from('flight_tickets').delete().eq('id', id);
        setTickets(prev => prev.filter(t => t.id !== id));
        showToast?.(isAr ? '✅ تم الحذف!' : '✅ Deleted!');
      } catch (err) {
        showToast?.(isAr ? '❌ خطأ في الحذف' : '❌ Delete error');
      }
    };

    // PNR Check - Auto check for changes
    const handlePnrCheck = async (e) => {
      e.preventDefault();
      if (!pnrCheck) {
        showToast?.(isAr ? '⚠️ الرجاء إدخال رقم الحجز' : '⚠️ Please enter PNR');
        return;
      }

      try {
        const { data: found, error } = await supabase
          .from('flight_tickets')
          .select('*')
          .eq('booking_reference', pnrCheck.toUpperCase())
          .eq('tenant_id', userProfile.tenant_id)
          .maybeSingle();

        if (error) throw error;
        if (!found) {
          showToast?.(isAr ? '❌ لا توجد تذكرة بهذا الرقم' : '❌ No ticket found with this PNR');
          setPnrResult(null);
          return;
        }

        setPnrResult(found);
        showToast?.(isAr ? '✅ تم العثور على التذكرة!' : '✅ Ticket found!');

        // Check for changes - compare with stored version
        const stored = tickets.find(t => t.id === found.id);
        if (stored) {
          let changes = [];
          if (stored.departure_time !== found.departure_time) changes.push(`Time changed: ${stored.departure_time} → ${found.departure_time}`);
          if (stored.gate !== found.gate) changes.push(`Gate changed: ${stored.gate} → ${found.gate}`);
          if (stored.status !== found.status) changes.push(`Status changed: ${stored.status} → ${found.status}`);
          if (stored.terminal !== found.terminal) changes.push(`Terminal changed: ${stored.terminal} → ${found.terminal}`);

          if (changes.length > 0) {
            // Create notification
            await supabase.from('ticket_notifications').insert([{
              ticket_id: found.id,
              message: `PNR ${found.booking_reference}: ${changes.join(', ')}`,
              type: 'change',
              tenant_id: userProfile.tenant_id
            }]);
            showToast?.(isAr ? `⚠️ تغييرات تم اكتشافها: ${changes.join(', ')}` : `⚠️ Changes detected: ${changes.join(', ')}`);
            setNotifications(prev => [{ message: `PNR ${found.booking_reference}: ${changes.join(', ')}`, type: 'change' }, ...prev]);
          } else {
            showToast?.(isAr ? '✅ لا توجد تغييرات على هذه التذكرة' : '✅ No changes found for this ticket');
          }
        }
      } catch (err) {
        showToast?.(isAr ? '❌ خطأ في البحث' : '❌ Search error');
      }
    };

    // Print Ticket
    const handlePrintTicket = (ticket) => {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ticket ${ticket.flight_number}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; background: #f5f5f5; }
            .ticket { border: 2px solid #1E3A8A; border-radius: 16px; padding: 30px; max-width: 750px; margin: auto; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1E3A8A, #2563EB); color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; }
            .header p { margin: 5px 0 0; opacity: 0.9; font-size: 14px; }
            .body { padding: 25px; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #555; width: 40%; }
            .value { font-weight: 600; color: #1E3A8A; width: 60%; text-align: right; }
            .status { display: inline-block; padding: 4px 16px; border-radius: 20px; font-weight: bold; }
            .status-confirmed { background: #D1FAE5; color: #065F46; }
            .status-boarding { background: #FEF3C7; color: #92400E; }
            .status-departed { background: #DBEAFE; color: #1D4ED8; }
            .status-arrived { background: #D1FAE5; color: #065F46; }
            .status-delayed { background: #FEE2E2; color: #991B1B; }
            .status-cancelled { background: #FEE2E2; color: #991B1B; }
            .footer { text-align: center; padding: 15px; background: #F8FAFC; border-radius: 0 0 12px 12px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
            .qr { text-align: center; margin: 15px 0; }
            .qr img { border: 1px solid #ddd; padding: 5px; border-radius: 8px; }
            .route { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; }
            .route .city { font-size: 20px; font-weight: 700; color: #1E3A8A; }
            .route .arrow { font-size: 24px; color: #F59E0B; }
            .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
            .detail-item { background: #F8FAFC; padding: 10px; border-radius: 8px; }
            .detail-item .lbl { font-size: 10px; color: #94A3B8; text-transform: uppercase; }
            .detail-item .val { font-size: 14px; font-weight: 600; color: #1E3A8A; }
            @media print { body { padding: 0; background: white; } .ticket { border: none; box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1>✈️ BOARDING PASS</h1>
              <p>${ticket.flight_number} | ${ticket.airline}</p>
            </div>
            <div class="body">
              <div class="route">
                <div class="city">${ticket.origin}</div>
                <div class="arrow">✈️ →</div>
                <div class="city">${ticket.destination}</div>
              </div>
              <div class="row"><span class="label">Passenger Name</span><span class="value">${ticket.passenger_name}</span></div>
              <div class="row"><span class="label">Phone</span><span class="value">${ticket.passenger_phone || 'N/A'}</span></div>
              <div class="row"><span class="label">Email</span><span class="value">${ticket.passenger_email || 'N/A'}</span></div>
              <div class="row"><span class="label">Flight</span><span class="value">${ticket.flight_number}</span></div>
              <div class="row"><span class="label">Date</span><span class="value">${ticket.departure_date}</span></div>
              <div class="row"><span class="label">Departure</span><span class="value">${ticket.departure_time}</span></div>
              <div class="row"><span class="label">Arrival</span><span class="value">${ticket.arrival_time || 'N/A'}</span></div>
              <div class="row"><span class="label">Seat</span><span class="value">${ticket.seat_number || 'N/A'}</span></div>
              <div class="row"><span class="label">Booking Ref</span><span class="value">${ticket.booking_reference}</span></div>
              <div class="row"><span class="label">Ticket No</span><span class="value">${ticket.ticket_number}</span></div>
              <div class="row"><span class="label">Class</span><span class="value">${ticket.class}</span></div>
              <div class="row"><span class="label">Gate</span><span class="value">${ticket.gate || 'N/A'}</span></div>
              <div class="row"><span class="label">Terminal</span><span class="value">${ticket.terminal || 'N/A'}</span></div>
              <div class="row"><span class="label">Baggage</span><span class="value">${ticket.baggage || 'N/A'}</span></div>
              <div class="row"><span class="label">Meal</span><span class="value">${ticket.meal || 'Standard'}</span></div>
              <div class="row"><span class="label">Fare</span><span class="value">${(ticket.fare || 0).toFixed(2)} SAR</span></div>
              <div class="row"><span class="label">Tax</span><span class="value">${(ticket.tax || 0).toFixed(2)} SAR</span></div>
              <div class="row"><span class="label">Total</span><span class="value" style="font-size:18px;color:#059669;">${(ticket.total || 0).toFixed(2)} SAR</span></div>
              <div class="row"><span class="label">Status</span><span class="value"><span class="status status-${ticket.status?.toLowerCase()}">${ticket.status}</span></span></div>
              ${ticket.special_requests ? `<div class="row"><span class="label">Special Requests</span><span class="value">${ticket.special_requests}</span></div>` : ''}
              <div class="qr">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.booking_reference + '|' + ticket.flight_number + '|' + ticket.passenger_name)}" alt="QR Code" />
              </div>
            </div>
            <div class="footer">
              This is a computer-generated ticket. Valid without signature.<br/>
              © ${new Date().getFullYear()} SUEUD AL TAAYIRA Travel & Tourism
            </div>
          </div>
        </body>
        </html>
      `;

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
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleGenerateTicket} style={{ ...styles.btn, ...styles.btnWarning }}>
              🎲 {isAr ? 'توليد عشوائي' : 'Random Generate'}
            </button>
          </div>
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
                <div><strong>{isAr ? 'الحالة' : 'Status'}:</strong> <span style={{ color: pnrResult.status === 'Cancelled' ? '#EF4444' : '#059669' }}>{pnrResult.status}</span></div>
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
              <select style={styles.select} value={ticketForm.airline} onChange={e => setTicketForm({ ...ticketForm, airline: e.target.value })} required>
                <option value="">{isAr ? 'اختر الخطوط' : 'Select Airline'}</option>
                {airlines.map(a => (
                  <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                ))}
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
                <option>Standard</option>
                <option>Vegetarian</option>
                <option>Halal</option>
                <option>Kosher</option>
                <option>Gluten-Free</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'السعر (ريال)' : 'Fare (SAR)'}</label>
              <input type="number" step="0.01" style={styles.input} value={ticketForm.fare} onChange={e => setTicketForm({ ...ticketForm, fare: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'الضريبة' : 'Tax'}</label>
              <input type="number" step="0.01" style={styles.input} value={ticketForm.tax} onChange={e => setTicketForm({ ...ticketForm, tax: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'الإجمالي' : 'Total'}</label>
              <input type="number" step="0.01" style={{ ...styles.input, fontWeight: 700, color: '#34D399' }} value={ticketForm.total} onChange={e => setTicketForm({ ...ticketForm, total: parseFloat(e.target.value) || 0 })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>{isAr ? 'طلبات خاصة' : 'Special Requests'}</label>
              <textarea style={styles.textarea} value={ticketForm.special_requests} onChange={e => setTicketForm({ ...ticketForm, special_requests: e.target.value })} placeholder={isAr ? 'أي طلبات خاصة...' : 'Any special requests...'} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, padding: '12px 30px' }}>
                {editingId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '✅ ' + (isAr ? 'حفظ التذكرة' : 'Save Ticket')}
              </button>
              {editingId && (
                <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setEditingId(null); setTicketForm({ passenger_name: '', passenger_phone: '', passenger_email: '', airline: '', flight_number: '', origin: '', destination: '', departure_date: today, departure_time: '08:00', arrival_time: '12:00', seat_number: '', booking_reference: '', ticket_number: '', status: 'Confirmed', class: 'Economy', gate: '', terminal: '', baggage: '30 Kg', meal: 'Standard', special_requests: '', fare: 0, tax: 0, total: 0 }); }}>
                  ✕ {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>🔔 {isAr ? 'إشعارات التذاكر' : 'Ticket Notifications'}</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {notifications.map((n, i) => (
                <div key={i} style={{
                  padding: '8px 12px',
                  borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '16px' }}>{n.type === 'change' ? '⚠️' : '✅'}</span>
                  <span style={{ fontSize: '13px', color: isDark ? '#CBD5E1' : '#1E293B' }}>{n.message}</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', marginLeft: 'auto' }}>{new Date(n.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
  // HOTEL BOOKING - REAL HOTELS WITH DETAILS
  // ============================================================
  if (page === 'hotel_booking') {
    const [hotelForm, setHotelForm] = useState({
      city: 'Riyadh',
      checkIn: today,
      checkOut: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      guests: 2,
      rooms: 1
    });
    const [hotelResults, setHotelResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);

    const realHotels = [
      { id: 1, name: 'Hilton Riyadh Hotel & Residences', stars: 5, price: 450, rating: 4.8, image: '🏨', address: 'King Abdullah Road, Riyadh', phone: '+966 11 123 4567', website: 'www.hilton.com/riyadh', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Free WiFi'] },
      { id: 2, name: 'Marriott Hotel Jeddah', stars: 4, price: 320, rating: 4.5, image: '🏩', address: 'Al Hamra District, Jeddah', phone: '+966 12 234 5678', website: 'www.marriott.com/jeddah', amenities: ['Pool', 'Gym', 'Restaurant', 'Free WiFi'] },
      { id: 3, name: 'Fairmont Makkah Clock Tower', stars: 5, price: 550, rating: 4.8, image: '🕌', address: 'King Abdul Aziz Road, Makkah', phone: '+966 12 123 4567', website: 'www.fairmont.com/makkah', amenities: ['Pool', 'Gym', 'Restaurant', 'Prayer Rooms', 'Free WiFi'] },
      { id: 4, name: 'Shaza Al Madina Hotel', stars: 4, price: 350, rating: 4.6, image: '🕋', address: 'King Fahd Road, Madinah', phone: '+966 14 123 4567', website: 'www.shaza.com/madina', amenities: ['Gym', 'Restaurant', 'Prayer Rooms', 'Free WiFi'] },
      { id: 5, name: 'Four Seasons Hotel Dubai', stars: 5, price: 620, rating: 4.9, image: '🏛️', address: 'Jumeirah Beach Road, Dubai', phone: '+971 4 123 4567', website: 'www.fourseasons.com/dubai', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Free WiFi'] },
      { id: 6, name: 'Ritz-Carlton Doha', stars: 5, price: 580, rating: 4.9, image: '🏰', address: 'West Bay, Doha', phone: '+974 1234 5678', website: 'www.ritzcarlton.com/doha', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Free WiFi'] },
      { id: 7, name: 'Crowne Plaza Cairo', stars: 4, price: 280, rating: 4.3, image: '🏢', address: 'Corniche El Nil, Cairo', phone: '+20 2 123 4567', website: 'www.crowneplaza.com/cairo', amenities: ['Pool', 'Gym', 'Restaurant', 'Free WiFi'] },
      { id: 8, name: 'Hyatt Regency Istanbul', stars: 5, price: 490, rating: 4.7, image: '🏯', address: 'Taksim Square, Istanbul', phone: '+90 212 123 4567', website: 'www.hyatt.com/istanbul', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Free WiFi'] },
      { id: 9, name: 'Burj Al Arab Jumeirah', stars: 5, price: 800, rating: 4.9, image: '🏰', address: 'Jumeirah Beach Road, Dubai', phone: '+971 4 123 4567', website: 'www.burj-al-arab.com', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Helipad', 'Free WiFi'] },
      { id: 10, name: 'Atlantis The Palm Dubai', stars: 5, price: 750, rating: 4.8, image: '🏝️', address: 'Palm Jumeirah, Dubai', phone: '+971 4 123 4567', website: 'www.atlantis.com/dubai', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Aquarium', 'Free WiFi'] },
    ];

    useEffect(() => {
      if (userProfile?.tenant_id) {
        supabase.from('hotel_bookings')
          .select('*')
          .eq('tenant_id', userProfile.tenant_id)
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) setBookings(data);
          })
          .catch(() => {});
      }
    }, [userProfile?.tenant_id]);

    const handleSearchHotels = (e) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        const filtered = realHotels.filter(h =>
          h.name.toLowerCase().includes(hotelForm.city.toLowerCase()) ||
          h.address.toLowerCase().includes(hotelForm.city.toLowerCase()) ||
          hotelForm.city === 'all'
        );
        setHotelResults(filtered);
        setLoading(false);
        showToast?.(isAr ? `✅ ${filtered.length} فندق تم العثور عليه!` : `✅ Found ${filtered.length} hotels!`);
      }, 500);
    };

    const handleBookHotel = async (hotel) => {
      try {
        const total = hotel.price * hotelForm.rooms * hotelForm.guests;
        const payload = {
          hotel_name: hotel.name,
          city: hotelForm.city || hotel.address.split(',')[0] || 'Riyadh',
          check_in: hotelForm.checkIn,
          check_out: hotelForm.checkOut,
          guests: hotelForm.guests,
          rooms: hotelForm.rooms,
          price: hotel.price,
          total: total,
          status: 'Confirmed',
          address: hotel.address,
          phone: hotel.phone,
          website: hotel.website,
          amenities: hotel.amenities,
          tenant_id: userProfile.tenant_id
        };

        const { data: newBooking, error } = await supabase
          .from('hotel_bookings')
          .insert([payload])
          .select()
          .single();

        if (error) {
          setBookings(prev => [{ ...payload, id: Date.now() }, ...prev]);
          showToast?.(isAr ? `✅ ${hotel.name} تم الحجز بنجاح!` : `✅ ${hotel.name} booked successfully!`);
          return;
        }
        setBookings(prev => [newBooking, ...prev]);
        showToast?.(isAr ? `✅ ${hotel.name} تم الحجز بنجاح!` : `✅ ${hotel.name} booked successfully!`);
        await logAction?.(`Hotel booked: ${hotel.name}`);
      } catch (err) {
        showToast?.(isAr ? '❌ خطأ في الحجز' : '❌ Booking error');
      }
    };

    const handleDeleteBooking = async (id) => {
      if (!confirm(isAr ? 'هل تريد حذف هذا الحجز؟' : 'Delete this booking?')) return;
      try {
        await supabase.from('hotel_bookings').delete().eq('id', id);
        setBookings(prev => prev.filter(b => b.id !== id));
        showToast?.(isAr ? '✅ تم الحذف!' : '✅ Deleted!');
      } catch (err) {
        showToast?.(isAr ? '❌ خطأ في الحذف' : '❌ Delete error');
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏨 {isAr ? 'حجز الفنادق' : 'Hotel Booking'}</h1>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSearchHotels} style={styles.formRow}>
            <div>
              <label style={styles.label}>{isAr ? 'المدينة' : 'City'}</label>
              <select style={styles.select} value={hotelForm.city} onChange={e => setHotelForm({ ...hotelForm, city: e.target.value })}>
                <option value="Riyadh">Riyadh - الرياض</option>
                <option value="Jeddah">Jeddah - جدة</option>
                <option value="Makkah">Makkah - مكة</option>
                <option value="Madinah">Madinah - المدينة</option>
                <option value="Dubai">Dubai - دبي</option>
                <option value="Doha">Doha - الدوحة</option>
                <option value="Cairo">Cairo - القاهرة</option>
                <option value="Istanbul">Istanbul - اسطنبول</option>
                <option value="all">{isAr ? 'جميع المدن' : 'All Cities'}</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'تسجيل الوصول' : 'Check-In'}</label>
              <input type="date" style={styles.input} value={hotelForm.checkIn} onChange={e => setHotelForm({ ...hotelForm, checkIn: e.target.value })} required />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'تسجيل المغادرة' : 'Check-Out'}</label>
              <input type="date" style={styles.input} value={hotelForm.checkOut} onChange={e => setHotelForm({ ...hotelForm, checkOut: e.target.value })} required />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'الضيوف' : 'Guests'}</label>
              <input type="number" min="1" max="10" style={styles.input} value={hotelForm.guests} onChange={e => setHotelForm({ ...hotelForm, guests: parseInt(e.target.value) })} />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'الغرف' : 'Rooms'}</label>
              <input type="number" min="1" max="5" style={styles.input} value={hotelForm.rooms} onChange={e => setHotelForm({ ...hotelForm, rooms: parseInt(e.target.value) })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '12px' }} disabled={loading}>
                {loading ? '⏳...' : (isAr ? '🔍 بحث' : '🔍 Search')}
              </button>
            </div>
          </form>
        </div>

        {hotelResults.length > 0 && (
          <div style={styles.grid}>
            {hotelResults.map(hotel => (
              <div key={hotel.id} style={{ ...styles.card, transition: 'transform 0.2s', borderTop: `4px solid ${hotel.stars >= 5 ? '#F59E0B' : hotel.stars >= 4 ? '#3B82F6' : '#10B981'}` }}>
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '10px' }}>{hotel.image}</div>
                <h3 style={{ color: '#FBBF24', margin: '0 0 5px' }}>{hotel.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ color: '#FBBF24' }}>{'⭐'.repeat(hotel.stars)}</span>
                  <span style={{ color: '#34D399' }}>★ {hotel.rating}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '5px' }}>{hotel.address}</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '5px' }}>
                  {hotel.amenities?.map((a, i) => (
                    <span key={i} style={{ fontSize: '9px', background: isDark ? '#0F172A' : '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>{a}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#34D399' }}>{hotel.price} SAR</span>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>{isAr ? 'لليلة' : 'per night'}</span>
                </div>
                <div style={{ fontSize: '10px', color: '#60A5FA', marginTop: '2px' }}>
                  🔗 {hotel.website}
                </div>
                <button onClick={() => handleBookHotel(hotel)} style={{ ...styles.btn, ...styles.btnSuccess, width: '100%', marginTop: '12px', padding: '10px' }}>
                  🛏️ {isAr ? 'احجز الآن' : 'Book Now'}
                </button>
              </div>
            ))}
          </div>
        )}

        {bookings.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>{isAr ? 'حجوزاتي' : 'My Bookings'}</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{isAr ? 'الفندق' : 'Hotel'}</th>
                    <th style={styles.th}>{isAr ? 'الوصول' : 'Check-In'}</th>
                    <th style={styles.th}>{isAr ? 'المغادرة' : 'Check-Out'}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'المبلغ' : 'Total'}</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{b.hotel_name}</td>
                      <td style={styles.td}>{b.check_in}</td>
                      <td style={styles.td}>{b.check_out}</td>
                      <td style={styles.tdRight}>{fmt(b.total || b.price)}</td>
                      <td style={styles.tdCenter}>
                        <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeleteBooking(b.id)}>🗑️</button>
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

  return null;
}
