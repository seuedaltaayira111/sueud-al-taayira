'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const styles = {
  container: { padding: '20px', background: 'var(--bg-primary, #0F172A)', minHeight: '100vh', color: 'var(--text-primary, #F8FAFC)' },
  card: { background: 'var(--bg-secondary, #1E293B)', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '1px solid var(--border-color, #334155)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 },
  input: { padding: '10px 15px', background: 'var(--bg-primary, #0F172A)', border: '1px solid var(--border-color, #334155)', borderRadius: '8px', color: 'var(--text-primary, #F8FAFC)', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  select: { padding: '10px 15px', background: 'var(--bg-primary, #0F172A)', border: '1px solid var(--border-color, #334155)', borderRadius: '8px', color: 'var(--text-primary, #F8FAFC)', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s' },
  btnPrimary: { background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff' },
  btnSuccess: { background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff' },
  btnDanger: { background: 'linear-gradient(135deg, #DC2626, #B91C1C)', color: '#fff' },
  btnWarning: { background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0F172A' },
  btnGhost: { background: 'transparent', border: '1px solid var(--border-color, #334155)', color: 'var(--text-muted, #94A3B8)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  statCard: { background: 'linear-gradient(135deg, #1E293B, #0F172A)', padding: '20px', borderRadius: '12px', border: '1px solid #334155' },
  statLabel: { fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statValue: { fontSize: '24px', fontWeight: 700, color: '#FBBF24', marginTop: '5px' },
  label: { fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary, #CBD5E1)', marginBottom: '6px', display: 'block' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { padding: '12px', background: '#0F172A', color: '#FBBF24', textAlign: 'left', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #334155' },
  td: { padding: '12px', borderBottom: '1px solid #1E293B', color: '#CBD5E1' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, display: 'inline-block' },
  badgeSuccess: { background: '#065F46', color: '#34D399' },
  badgeWarning: { background: '#78350F', color: '#FBBF24' },
  badgeDanger: { background: '#7F1D1D', color: '#FCA5A5' },
  badgeInfo: { background: '#1E3A8A', color: '#93C5FD' },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
  sectionTitle: { color: '#FBBF24', fontSize: '15px', fontWeight: 700, margin: '0 0 15px', paddingBottom: '10px', borderBottom: '1px solid #334155' }
};

export default function ERPViewsTravel(props) {
  const { page, data, tr, today, userProfile, showToast, setData, logAction } = props;
  const t = (key, fallback) => tr?.[key] || fallback || key;

  // ============================================================
  // 1. FLIGHT STATUS TRACKING
  // ============================================================
  if (page === 'flight_status') {
    const [flightNo, setFlightNo] = useState('');
    const [flightDate, setFlightDate] = useState(today);
    const [flightStatus, setFlightStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock flight status data (In real implementation, use aviation API like AviationStack, AeroDataBox, etc.)
    const mockFlightStatus = (flight) => {
      const statuses = ['On Time', 'Delayed', 'Boarding', 'Departed', 'Arrived', 'Cancelled', 'Scheduled'];
      const airlines = ['SV', 'XY', 'F3', 'EK', 'EY', 'QR', 'GF', 'MS', 'RJ', 'PK', 'WY', 'KU', 'G9', 'TK', '6E', 'AI'];
      const cities = ['RUH', 'JED', 'DMM', 'MED', 'CAI', 'DXB', 'AUH', 'DOH', 'BAH', 'KWI', 'MCT', 'AMM', 'LHR', 'CDG', 'NYC'];
      
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomAirline = airlines[Math.floor(Math.random() * airlines.length)];
      const randomOrigin = cities[Math.floor(Math.random() * cities.length)];
      const randomDest = cities.filter(c => c !== randomOrigin)[Math.floor(Math.random() * (cities.length - 1))];
      
      return {
        flight: flight || `${randomAirline}${Math.floor(100 + Math.random() * 900)}`,
        airline: randomAirline,
        origin: randomOrigin,
        destination: randomDest,
        status: randomStatus,
        scheduled: `${Math.floor(6 + Math.random() * 12)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        actual: randomStatus === 'On Time' ? '' : `${Math.floor(6 + Math.random() * 12)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        gate: String.fromCharCode(65 + Math.floor(Math.random() * 10)) + Math.floor(1 + Math.random() * 30),
        terminal: Math.floor(1 + Math.random() * 5),
        baggage: Math.floor(1 + Math.random() * 10)
      };
    };

    const handleTrackFlight = (e) => {
      e.preventDefault();
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFlightStatus(mockFlightStatus(flightNo));
        setLoading(false);
        showToast?.('✅ Flight status retrieved!');
      }, 1000);
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛫 {t('flight_status', 'Flight Status')}</h1>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleTrackFlight} style={styles.formRow}>
            <div>
              <label style={styles.label}>Flight Number / رقم الرحلة</label>
              <input
                style={styles.input}
                placeholder="e.g. SV101, EK205"
                value={flightNo}
                onChange={e => setFlightNo(e.target.value.toUpperCase())}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Date / التاريخ</label>
              <input
                type="date"
                style={styles.input}
                value={flightDate}
                onChange={e => setFlightDate(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '12px' }} disabled={loading}>
                {loading ? '⏳ Checking...' : '🔍 Track Flight'}
              </button>
            </div>
          </form>
        </div>

        {flightStatus && (
          <div style={styles.card} style={{ borderTop: `4px solid ${flightStatus.status === 'On Time' ? '#059669' : flightStatus.status === 'Cancelled' ? '#DC2626' : '#F59E0B'}` }}>
            <div style={styles.grid} style={{ gridTemplateColumns: '2fr 1fr' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#FBBF24' }}>{flightStatus.flight}</div>
                  <span style={{
                    ...styles.badge,
                    background: flightStatus.status === 'On Time' ? '#065F46' : flightStatus.status === 'Cancelled' ? '#7F1D1D' : '#78350F',
                    color: flightStatus.status === 'On Time' ? '#34D399' : flightStatus.status === 'Cancelled' ? '#FCA5A5' : '#FBBF24',
                    fontSize: '14px',
                    padding: '4px 16px'
                  }}>
                    {flightStatus.status}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: '#0F172A', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>From / من</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#60A5FA' }}>{flightStatus.origin}</div>
                  </div>
                  <div style={{ background: '#0F172A', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>To / إلى</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#34D399' }}>{flightStatus.destination}</div>
                  </div>
                </div>
              </div>
              <div style={{ background: '#0F172A', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1E293B' }}>
                  <span style={{ color: '#94A3B8' }}>Scheduled / المجدول</span>
                  <span style={{ fontWeight: 600 }}>{flightStatus.scheduled}</span>
                </div>
                {flightStatus.actual && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1E293B', color: '#FBBF24' }}>
                    <span style={{ color: '#94A3B8' }}>Actual / الفعلي</span>
                    <span style={{ fontWeight: 600 }}>{flightStatus.actual}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1E293B' }}>
                  <span style={{ color: '#94A3B8' }}>Gate / البوابة</span>
                  <span style={{ fontWeight: 600 }}>{flightStatus.gate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1E293B' }}>
                  <span style={{ color: '#94A3B8' }}>Terminal / الصالة</span>
                  <span style={{ fontWeight: 600 }}>{flightStatus.terminal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#94A3B8' }}>Baggage / الأمتعة</span>
                  <span style={{ fontWeight: 600 }}>{flightStatus.baggage}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 2. HOTEL BOOKING ENGINE
  // ============================================================
  if (page === 'hotel_booking') {
    const [hotelForm, setHotelForm] = useState({
      city: '',
      checkIn: today,
      checkOut: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      guests: 2,
      rooms: 1
    });
    const [hotelResults, setHotelResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mock hotel data
    const mockHotels = [
      { id: 1, name: 'Hilton Riyadh', stars: 5, price: 450, rating: 4.8, image: '🏨' },
      { id: 2, name: 'Marriott Jeddah', stars: 4, price: 320, rating: 4.5, image: '🏩' },
      { id: 3, name: 'Ritz-Carlton Doha', stars: 5, price: 580, rating: 4.9, image: '🏰' },
      { id: 4, name: 'Four Seasons Dubai', stars: 5, price: 620, rating: 4.9, image: '🏛️' },
      { id: 5, name: 'Crowne Plaza Cairo', stars: 4, price: 280, rating: 4.3, image: '🏢' },
      { id: 6, name: 'Hyatt Regency Istanbul', stars: 5, price: 490, rating: 4.7, image: '🏯' },
    ];

    const handleSearchHotels = (e) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        const filtered = mockHotels.filter(h =>
          h.name.toLowerCase().includes(hotelForm.city.toLowerCase()) ||
          hotelForm.city === '' ||
          hotelForm.city === 'all'
        );
        setHotelResults(filtered);
        setLoading(false);
        showToast?.('✅ Found ' + filtered.length + ' hotels!');
      }, 800);
    };

    const handleBookHotel = (hotel) => {
      showToast?.(`✅ ${hotel.name} booked successfully!`);
      logAction?.(`Hotel booked: ${hotel.name} for ${hotelForm.guests} guests`);
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏨 {t('hotel_booking', 'Hotel Booking')}</h1>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSearchHotels} style={styles.formRow}>
            <div>
              <label style={styles.label}>City / المدينة</label>
              <input
                style={styles.input}
                placeholder="e.g. Riyadh, Dubai, Cairo"
                value={hotelForm.city}
                onChange={e => setHotelForm({ ...hotelForm, city: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.label}>Check-In / تسجيل الوصول</label>
              <input
                type="date"
                style={styles.input}
                value={hotelForm.checkIn}
                onChange={e => setHotelForm({ ...hotelForm, checkIn: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Check-Out / تسجيل المغادرة</label>
              <input
                type="date"
                style={styles.input}
                value={hotelForm.checkOut}
                onChange={e => setHotelForm({ ...hotelForm, checkOut: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Guests / الضيوف</label>
              <input
                type="number"
                min="1"
                max="10"
                style={styles.input}
                value={hotelForm.guests}
                onChange={e => setHotelForm({ ...hotelForm, guests: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label style={styles.label}>Rooms / الغرف</label>
              <input
                type="number"
                min="1"
                max="5"
                style={styles.input}
                value={hotelForm.rooms}
                onChange={e => setHotelForm({ ...hotelForm, rooms: parseInt(e.target.value) })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '12px' }} disabled={loading}>
                {loading ? '⏳ Searching...' : '🔍 Search Hotels'}
              </button>
            </div>
          </form>
        </div>

        {hotelResults.length > 0 && (
          <div style={styles.grid}>
            {hotelResults.map(hotel => (
              <div key={hotel.id} style={{ ...styles.card, transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '10px' }}>{hotel.image}</div>
                <h3 style={{ color: '#FBBF24', margin: '0 0 5px' }}>{hotel.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#FBBF24' }}>{'⭐'.repeat(hotel.stars)}</span>
                  <span style={{ color: '#34D399' }}>★ {hotel.rating}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#34D399' }}>{hotel.price} SAR</span>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>per night</span>
                </div>
                <button
                  onClick={() => handleBookHotel(hotel)}
                  style={{ ...styles.btn, ...styles.btnSuccess, width: '100%', marginTop: '12px', padding: '10px' }}
                >
                  🛏️ Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 3. VISA PROCESSING SYSTEM
  // ============================================================
  if (page === 'visa_processing') {
    const [visaApplications, setVisaApplications] = useState([]);
    const [visaForm, setVisaForm] = useState({
      applicant_name: '',
      passport_no: '',
      nationality: '',
      visa_type: 'Tourist',
      destination: '',
      travel_date: today,
      status: 'Pending'
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
      // Load visa applications from Supabase
      if (userProfile?.tenant_id) {
        supabase.from('visa_applications')
          .select('*')
          .eq('tenant_id', userProfile.tenant_id)
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) setVisaApplications(data);
          });
      }
    }, [userProfile?.tenant_id]);

    const handleVisaSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = { ...visaForm, tenant_id: userProfile.tenant_id };
        if (editingId) {
          const { data: updated, error } = await supabase
            .from('visa_applications')
            .update(payload)
            .eq('id', editingId)
            .select()
            .single();
          if (error) throw error;
          setVisaApplications(prev => prev.map(v => v.id === editingId ? updated : v));
          showToast('✅ Visa application updated!');
          setEditingId(null);
        } else {
          const { data: newVisa, error } = await supabase
            .from('visa_applications')
            .insert([payload])
            .select()
            .single();
          if (error) throw error;
          setVisaApplications(prev => [newVisa, ...prev]);
          showToast('✅ Visa application created!');
          await logAction?.(`Visa application for ${visaForm.applicant_name}`);
        }
        setVisaForm({
          applicant_name: '',
          passport_no: '',
          nationality: '',
          visa_type: 'Tourist',
          destination: '',
          travel_date: today,
          status: 'Pending'
        });
      } catch (err) {
        showToast('Error: ' + err.message);
      }
    };

    const handleEditVisa = (visa) => {
      setEditingId(visa.id);
      setVisaForm({
        applicant_name: visa.applicant_name,
        passport_no: visa.passport_no,
        nationality: visa.nationality,
        visa_type: visa.visa_type,
        destination: visa.destination,
        travel_date: visa.travel_date,
        status: visa.status
      });
    };

    const handleDeleteVisa = async (id) => {
      if (!confirm('Delete this visa application?')) return;
      try {
        await supabase.from('visa_applications').delete().eq('id', id);
        setVisaApplications(prev => prev.filter(v => v.id !== id));
        showToast('🗑️ Visa application deleted!');
      } catch (err) {
        showToast('Error: ' + err.message);
      }
    };

    const getVisaStatusBadge = (status) => {
      const map = {
        'Pending': styles.badgeWarning,
        'Processing': styles.badgeInfo,
        'Approved': styles.badgeSuccess,
        'Rejected': styles.badgeDanger,
        'Delivered': styles.badgeSuccess
      };
      return map[status] || styles.badgeWarning;
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛂 {t('visa_processing', 'Visa Processing')}</h1>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{editingId ? '✏️ Edit Visa Application' : '📝 New Visa Application'}</h3>
          <form onSubmit={handleVisaSubmit} style={styles.formRow}>
            <div>
              <label style={styles.label}>Applicant Name / اسم المتقدم</label>
              <input
                style={styles.input}
                value={visaForm.applicant_name}
                onChange={e => setVisaForm({ ...visaForm, applicant_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Passport No / رقم جواز السفر</label>
              <input
                style={styles.input}
                value={visaForm.passport_no}
                onChange={e => setVisaForm({ ...visaForm, passport_no: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Nationality / الجنسية</label>
              <input
                style={styles.input}
                value={visaForm.nationality}
                onChange={e => setVisaForm({ ...visaForm, nationality: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Visa Type / نوع التأشيرة</label>
              <select
                style={styles.select}
                value={visaForm.visa_type}
                onChange={e => setVisaForm({ ...visaForm, visa_type: e.target.value })}
              >
                <option>Tourist</option>
                <option>Business</option>
                <option>Work</option>
                <option>Transit</option>
                <option>Hajj</option>
                <option>Umrah</option>
                <option>Student</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Destination / الوجهة</label>
              <input
                style={styles.input}
                value={visaForm.destination}
                onChange={e => setVisaForm({ ...visaForm, destination: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Travel Date / تاريخ السفر</label>
              <input
                type="date"
                style={styles.input}
                value={visaForm.travel_date}
                onChange={e => setVisaForm({ ...visaForm, travel_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Status / الحالة</label>
              <select
                style={styles.select}
                value={visaForm.status}
                onChange={e => setVisaForm({ ...visaForm, status: e.target.value })}
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Delivered</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, padding: '12px 30px' }}>
                {editingId ? '💾 Update' : '✅ Submit'}
              </button>
              {editingId && (
                <button
                  type="button"
                  style={{ ...styles.btn, ...styles.btnGhost }}
                  onClick={() => {
                    setEditingId(null);
                    setVisaForm({
                      applicant_name: '',
                      passport_no: '',
                      nationality: '',
                      visa_type: 'Tourist',
                      destination: '',
                      travel_date: today,
                      status: 'Pending'
                    });
                  }}
                >
                  ✕ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📋 Visa Applications</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Applicant</th>
                  <th style={styles.th}>Passport</th>
                  <th style={styles.th}>Visa Type</th>
                  <th style={styles.th}>Destination</th>
                  <th style={styles.th}>Travel Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visaApplications.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #1E293B' }}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{v.applicant_name}</td>
                    <td style={styles.td}>{v.passport_no}</td>
                    <td style={styles.td}>{v.visa_type}</td>
                    <td style={styles.td}>{v.destination}</td>
                    <td style={styles.td}>{v.travel_date}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...getVisaStatusBadge(v.status) }}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button
                        style={{ ...styles.btn, ...styles.btnWarning, padding: '4px 10px', marginRight: '5px', fontSize: '12px' }}
                        onClick={() => handleEditVisa(v)}
                      >
                        ✏️
                      </button>
                      <button
                        style={{ ...styles.btn, ...styles.btnDanger, padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => handleDeleteVisa(v.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {visaApplications.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ ...styles.td, textAlign: 'center', padding: '30px', color: '#94A3B8' }}>
                      No visa applications yet. Create one above!
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
  // 4. TRAVEL INSURANCE
  // ============================================================
  if (page === 'travel_insurance') {
    const [insuranceForm, setInsuranceForm] = useState({
      customer_name: '',
      passport_no: '',
      policy_type: 'Single Trip',
      destination: '',
      start_date: today,
      end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      coverage_type: 'Standard',
      premium: 0
    });
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
      if (userProfile?.tenant_id) {
        supabase.from('insurance_policies')
          .select('*')
          .eq('tenant_id', userProfile.tenant_id)
          .order('created_at', { ascending: false })
          .then(({
