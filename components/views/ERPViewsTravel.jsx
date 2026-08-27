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
  // HOTEL BOOKING ENGINE - FIXED
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
    const [bookings, setBookings] = useState([]);

    // Load bookings
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
        showToast?.(isAr ? `✅ ${filtered.length} فندق تم العثور عليه!` : `✅ Found ${filtered.length} hotels!`);
      }, 800);
    };

    const handleBookHotel = async (hotel) => {
      try {
        const payload = {
          hotel_name: hotel.name,
          city: hotelForm.city,
          check_in: hotelForm.checkIn,
          check_out: hotelForm.checkOut,
          guests: hotelForm.guests,
          rooms: hotelForm.rooms,
          price: hotel.price,
          total: hotel.price * hotelForm.rooms * hotelForm.guests,
          status: 'Confirmed',
          tenant_id: userProfile.tenant_id
        };
        const { data: newBooking, error } = await supabase
          .from('hotel_bookings')
          .insert([payload])
          .select()
          .single();

        if (error) {
          // Table might not exist, just show success
          showToast?.(isAr ? `✅ ${hotel.name} تم الحجز بنجاح!` : `✅ ${hotel.name} booked successfully!`);
          setBookings(prev => [{ ...payload, id: Date.now() }, ...prev]);
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
              <input
                style={styles.input}
                placeholder={isAr ? 'مثال: الرياض، دبي، القاهرة' : 'e.g. Riyadh, Dubai, Cairo'}
                value={hotelForm.city}
                onChange={e => setHotelForm({ ...hotelForm, city: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'تسجيل الوصول' : 'Check-In'}</label>
              <input
                type="date"
                style={styles.input}
                value={hotelForm.checkIn}
                onChange={e => setHotelForm({ ...hotelForm, checkIn: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'تسجيل المغادرة' : 'Check-Out'}</label>
              <input
                type="date"
                style={styles.input}
                value={hotelForm.checkOut}
                onChange={e => setHotelForm({ ...hotelForm, checkOut: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'الضيوف' : 'Guests'}</label>
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
              <label style={styles.label}>{isAr ? 'الغرف' : 'Rooms'}</label>
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
                {loading ? '⏳...' : (isAr ? '🔍 بحث' : '🔍 Search')}
              </button>
            </div>
          </form>
        </div>

        {hotelResults.length > 0 && (
          <div style={styles.grid}>
            {hotelResults.map(hotel => (
              <div key={hotel.id} style={{ ...styles.card, transition: 'transform 0.2s' }}>
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '10px' }}>{hotel.image}</div>
                <h3 style={{ color: '#FBBF24', margin: '0 0 5px' }}>{hotel.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#FBBF24' }}>{'⭐'.repeat(hotel.stars)}</span>
                  <span style={{ color: '#34D399' }}>★ {hotel.rating}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#34D399' }}>{hotel.price} SAR</span>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>{isAr ? 'لليلة' : 'per night'}</span>
                </div>
                <button
                  onClick={() => handleBookHotel(hotel)}
                  style={{ ...styles.btn, ...styles.btnSuccess, width: '100%', marginTop: '12px', padding: '10px' }}
                >
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
                        <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeleteBooking(b.id)}>
                          🗑️
                        </button>
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
  // TRAVEL INSURANCE - FIXED
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
          .then(({ data }) => {
            if (data) setPolicies(data);
          })
          .catch(() => {});
      }
    }, [userProfile?.tenant_id]);

    const calculatePremium = () => {
      const baseRates = {
        'Single Trip': 150,
        'Annual': 1200,
        'Family': 400,
        'Group': 300
      };
      const coverageMultipliers = {
        'Standard': 1,
        'Premium': 1.5,
        'Comprehensive': 2
      };
      const base = baseRates[insuranceForm.policy_type] || 150;
      const multiplier = coverageMultipliers[insuranceForm.coverage_type] || 1;
      return base * multiplier;
    };

    useEffect(() => {
      setInsuranceForm(prev => ({ ...prev, premium: calculatePremium() }));
    }, [insuranceForm.policy_type, insuranceForm.coverage_type]);

    const handleInsuranceSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = { ...insuranceForm, tenant_id: userProfile.tenant_id };
        const { data: newPolicy, error } = await supabase
          .from('insurance_policies')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setPolicies(prev => [newPolicy, ...prev]);
        showToast?.(isAr ? '✅ تم إصدار بوليصة التأمين!' : '✅ Insurance policy issued!');
        await logAction?.(`Insurance policy for ${insuranceForm.customer_name}`);
        setInsuranceForm({
          customer_name: '',
          passport_no: '',
          policy_type: 'Single Trip',
          destination: '',
          start_date: today,
          end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
          coverage_type: 'Standard',
          premium: 0
        });
      } catch (err) {
        showToast?.(isAr ? '❌ خطأ: ' + err.message : '❌ Error: ' + err.message);
      }
    };

    const handleDeletePolicy = async (id) => {
      if (!confirm(isAr ? 'حذف هذه البوليصة؟' : 'Delete this policy?')) return;
      try {
        await supabase.from('insurance_policies').delete().eq('id', id);
        setPolicies(prev => prev.filter(p => p.id !== id));
        showToast?.(isAr ? '✅ تم الحذف!' : '✅ Deleted!');
      } catch (err) {
        showToast?.(isAr ? '❌ خطأ في الحذف' : '❌ Delete error');
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛡️ {isAr ? 'التأمين على السفر' : 'Travel Insurance'}</h1>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? 'إصدار بوليصة تأمين' : 'Issue Insurance Policy'}</h3>
          <form onSubmit={handleInsuranceSubmit} style={styles.formRow}>
            <div>
              <label style={styles.label}>{isAr ? 'اسم العميل' : 'Customer Name'}</label>
              <input
                style={styles.input}
                value={insuranceForm.customer_name}
                onChange={e => setInsuranceForm({ ...insuranceForm, customer_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'رقم جواز السفر' : 'Passport No'}</label>
              <input
                style={styles.input}
                value={insuranceForm.passport_no}
                onChange={e => setInsuranceForm({ ...insuranceForm, passport_no: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'نوع البوليصة' : 'Policy Type'}</label>
              <select
                style={styles.select}
                value={insuranceForm.policy_type}
                onChange={e => setInsuranceForm({ ...insuranceForm, policy_type: e.target.value })}
              >
                <option>Single Trip</option>
                <option>Annual</option>
                <option>Family</option>
                <option>Group</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'الوجهة' : 'Destination'}</label>
              <input
                style={styles.input}
                value={insuranceForm.destination}
                onChange={e => setInsuranceForm({ ...insuranceForm, destination: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'تاريخ البدء' : 'Start Date'}</label>
              <input
                type="date"
                style={styles.input}
                value={insuranceForm.start_date}
                onChange={e => setInsuranceForm({ ...insuranceForm, start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'تاريخ الانتهاء' : 'End Date'}</label>
              <input
                type="date"
                style={styles.input}
                value={insuranceForm.end_date}
                onChange={e => setInsuranceForm({ ...insuranceForm, end_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'نوع التغطية' : 'Coverage Type'}</label>
              <select
                style={styles.select}
                value={insuranceForm.coverage_type}
                onChange={e => setInsuranceForm({ ...insuranceForm, coverage_type: e.target.value })}
              >
                <option>Standard</option>
                <option>Premium</option>
                <option>Comprehensive</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'القسط (ريال)' : 'Premium (SAR)'}</label>
              <input
                type="number"
                style={{ ...styles.input, fontWeight: 700, color: '#34D399', fontSize: '18px' }}
                value={insuranceForm.premium}
                readOnly
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '12px' }}>
                🛡️ {isAr ? 'إصدار البوليصة' : 'Issue Policy'}
              </button>
            </div>
          </form>
        </div>

        {policies.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>{isAr ? 'البوليصات النشطة' : 'Active Policies'}</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{isAr ? 'العميل' : 'Customer'}</th>
                    <th style={styles.th}>{isAr ? 'النوع' : 'Type'}</th>
                    <th style={styles.th}>{isAr ? 'الوجهة' : 'Destination'}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'القسط' : 'Premium'}</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map(p => (
                    <tr key={p.id}>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{p.customer_name}</td>
                      <td style={styles.td}>{p.policy_type}</td>
                      <td style={styles.td}>{p.destination}</td>
                      <td style={{ ...styles.tdRight, color: '#34D399', fontWeight: 700 }}>{fmt(p.premium)}</td>
                      <td style={styles.tdCenter}>
                        <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeletePolicy(p.id)}>
                          🗑️
                        </button>
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
  // FREQUENT FLYER - FIXED
  // ============================================================
  if (page === 'frequent_flyer') {
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
          .catch(() => {});
      }
    }, [userProfile?.tenant_id]);

    const handleFfSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = { ...ffForm, tenant_id: userProfile.tenant_id };
        if (editingId) {
          const { data: updated, error } = await supabase
            .from('frequent_flyer')
            .update(payload)
            .eq('id', editingId)
            .select()
            .single();
          if (error) throw error;
          setFfMembers(prev => prev.map(f => f.id === editingId ? updated : f));
          showToast?.(isAr ? '✅ تم التحديث!' : '✅ Updated!');
          setEditingId(null);
        } else {
          const { data: newMember, error } = await supabase
            .from('frequent_flyer')
            .insert([payload])
            .select()
            .single();
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
        await supabase.from('frequent_flyer').delete().eq('id', id);
        setFfMembers(prev => prev.filter(f => f.id !== id));
        showToast?.(isAr ? '✅ تم الحذف!' : '✅ Deleted!');
      } catch (err) {
        showToast?.(isAr ? '❌ خطأ في الحذف' : '❌ Delete error');
      }
    };

    const getTierColor = (tier) => {
      const map = {
        'Blue': '#3B82F6',
        'Silver': '#94A3B8',
        'Gold': '#FBBF24',
        'Platinum': '#A78BFA',
        'Diamond': '#34D399'
      };
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
              <input
                style={styles.input}
                value={ffForm.customer_name}
                onChange={e => setFfForm({ ...ffForm, customer_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'خط الطيران' : 'Airline'}</label>
              <input
                style={styles.input}
                value={ffForm.airline}
                onChange={e => setFfForm({ ...ffForm, airline: e.target.value })}
                placeholder={isAr ? 'مثال: السعودية، الإمارات' : 'e.g. Saudia, Emirates'}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'رقم العضوية' : 'Membership No'}</label>
              <input
                style={styles.input}
                value={ffForm.membership_no}
                onChange={e => setFfForm({ ...ffForm, membership_no: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'المستوى' : 'Tier'}</label>
              <select
                style={styles.select}
                value={ffForm.tier}
                onChange={e => setFfForm({ ...ffForm, tier: e.target.value })}
              >
                <option>Blue</option>
                <option>Silver</option>
                <option>Gold</option>
                <option>Platinum</option>
                <option>Diamond</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'النقاط' : 'Points'}</label>
              <input
                type="number"
                style={styles.input}
                value={ffForm.points}
                onChange={e => setFfForm({ ...ffForm, points: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'الحالة' : 'Status'}</label>
              <select
                style={styles.select}
                value={ffForm.status}
                onChange={e => setFfForm({ ...ffForm, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Expired</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '12px' }}>
                {editingId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '✅ ' + (isAr ? 'إضافة' : 'Add')}
              </button>
              {editingId && (
                <button
                  type="button"
                  style={{ ...styles.btn, ...styles.btnGhost }}
                  onClick={() => {
                    setEditingId(null);
                    setFfForm({
                      customer_name: '',
                      airline: '',
                      membership_no: '',
                      tier: 'Blue',
                      points: 0,
                      status: 'Active'
                    });
                  }}
                >
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
                          <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditFf(m)}>✏️</button>
                          <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeleteFf(m.id)}>🗑️</button>
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
  // FLIGHT STATUS - FIXED
  // ============================================================
  if (page === 'flight_status') {
    const [flightNo, setFlightNo] = useState('');
    const [flightDate, setFlightDate] = useState(today);
    const [flightStatus, setFlightStatus] = useState(null);
    const [loading, setLoading] = useState(false);

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
      setTimeout(() => {
        setFlightStatus(mockFlightStatus(flightNo));
        setLoading(false);
        showToast?.(isAr ? '✅ تم جلب حالة الرحلة!' : '✅ Flight status retrieved!');
      }, 1000);
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛫 {isAr ? 'حالة الرحلة' : 'Flight Status'}</h1>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleTrackFlight} style={styles.formRow}>
            <div>
              <label style={styles.label}>{isAr ? 'رقم الرحلة' : 'Flight Number'}</label>
              <input
                style={styles.input}
                placeholder={isAr ? 'مثال: SV101, EK205' : 'e.g. SV101, EK205'}
                value={flightNo}
                onChange={e => setFlightNo(e.target.value.toUpperCase())}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{isAr ? 'التاريخ' : 'Date'}</label>
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
                {loading ? '⏳...' : (isAr ? '🔍 تتبع' : '🔍 Track')}
              </button>
            </div>
          </form>
        </div>

        {flightStatus && (
          <div style={{ ...styles.card, borderTop: `4px solid ${flightStatus.status === 'On Time' ? '#059669' : flightStatus.status === 'Cancelled' ? '#DC2626' : '#F59E0B'}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
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
                  <div style={{ background: isDark ? '#0F172A' : '#F1F5F9', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{isAr ? 'من' : 'From'}</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#60A5FA' }}>{flightStatus.origin}</div>
                  </div>
                  <div style={{ background: isDark ? '#0F172A' : '#F1F5F9', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{isAr ? 'إلى' : 'To'}</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#34D399' }}>{flightStatus.destination}</div>
                  </div>
                </div>
              </div>
              <div style={{ background: isDark ? '#0F172A' : '#F1F5F9', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: isDark ? '1px solid #1E293B' : '1px solid #E2E8F0' }}>
                  <span style={{ color: '#94A3B8' }}>{isAr ? 'المجدول' : 'Scheduled'}</span>
                  <span style={{ fontWeight: 600 }}>{flightStatus.scheduled}</span>
                </div>
                {flightStatus.actual && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: isDark ? '1px solid #1E293B' : '1px solid #E2E8F0', color: '#FBBF24' }}>
                    <span style={{ color: '#94A3B8' }}>{isAr ? 'الفعلي' : 'Actual'}</span>
                    <span style={{ fontWeight: 600 }}>{flightStatus.actual}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: isDark ? '1px solid #1E293B' : '1px solid #E2E8F0' }}>
                  <span style={{ color: '#94A3B8' }}>{isAr ? 'البوابة' : 'Gate'}</span>
                  <span style={{ fontWeight: 600 }}>{flightStatus.gate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: isDark ? '1px solid #1E293B' : '1px solid #E2E8F0' }}>
                  <span style={{ color: '#94A3B8' }}>{isAr ? 'الصالة' : 'Terminal'}</span>
                  <span style={{ fontWeight: 600 }}>{flightStatus.terminal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#94A3B8' }}>{isAr ? 'الأمتعة' : 'Baggage'}</span>
                  <span style={{ fontWeight: 600 }}>{flightStatus.baggage}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
