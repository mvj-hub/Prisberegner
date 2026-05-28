import React, { useEffect, useState } from "react";

const ENROLLMENT_FEE = 1950;
const MATERIAL_PRICE_PER_WEEK = 115;

const COLORS = {
  primary: "#ea8115",
  soft: "#bedbd5",
  text: "#0b171f",
  card: "#ffffff",
};

const DATA = [
  {
    id: "efteraar-2026-19",
    label: "10. august - 20. december  ·  19 uger",
    weeks: 19,
    weeklyPrice: 2150,
    trips: [
      {
        id: "bouldering-kjuge",
        label: "Klatrerejse til Kjugekull (Bouldering, 1. periode)",
        price: 3500,
      },
      {
        id: "friluft-norge",
        label: "Vandring i Norge (Friluftsliv, 1. periode)",
        price: 4000,
      },
      { id: "skibums", label: "Skibums", price: 20500 },
    ],
    globalTrips: [
      { id: "south-africa", label: "Sydafrika", price: 15750 },
    ],
  },
  {
    id: "efteraar-2026-13",
    label: "21. september - 20. december  ·  13 uger",
    weeks: 13,
    weeklyPrice: 2150,
    trips: [],
    globalTrips: [
      { id: "south-africa", label: "Sydafrika", price: 15750 },
    ],
  },
  {
    id: "foraar-2027-25",
    label: "24. januar - 27. juni  ·  25 uger",
    weeks: 25,
    weeklyPrice: 2200,
    trips: [
      {
        id: "friluft-norge",
        label: "Fjeldski i Norge (Friluftsliv, 1. periode)",
        price: 4500,
      },
    ],
    globalTrips: [
      {
        id: "catalonia",
        label: "Catalonien (obligatorisk)",
        price: 7600,
        required: true,
      },
      { id: "alpine", label: "Alpin skitur i Italien", price: 7500 },
      {
        id: "fontainebleau",
        label: "Klatretur til Fontainebleau i Frankrig",
        price: 4500,
      },
    ],
  },
  {
    id: "foraar-2027-15",
    label: "15. marts - 27. juni  ·  15 uger",
    weeks: 15,
    weeklyPrice: 2200,
    trips: [],
    globalTrips: [
      {
        id: "catalonia",
        label: "Catalonien (obligatorisk)",
        price: 7600,
        required: true,
      },
      {
        id: "fontainebleau",
        label: "Klatretur til Fontainebleau i Frankrig",
        price: 4500,
      },
    ],
  },
  {
    id: "efteraar-2027-18",
    label: "16. august - 19. december  ·  18 uger",
    weeks: 18,
    weeklyPrice: 2200,
    trips: [
      {
        id: "bouldering-kjuge",
        label: "Klatrerejse til Kjugekull (Bouldering, 1. periode)",
        price: 3500,
      },
      {
        id: "friluft-norge",
        label: "Vandring i Norge (Friluftsliv, 1. periode)",
        price: 4500,
      },
      { id: "skibums", label: "Skibums", price: 22000 },
    ],
    globalTrips: [
      { id: "south-africa", label: "Sydafrika", price: 17000 },
    ],
  },
  {
    id: "efteraar-2027-13",
    label: "20. september - 19. december  ·  13 uger",
    weeks: 13,
    weeklyPrice: 2200,
    trips: [],
    globalTrips: [
      { id: "south-africa", label: "Sydafrika", price: 17000 },
    ],
  },
];

export default function PriceCalculator() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedSeason, setSelectedSeason] = useState("Efterår");

  const filteredStays = DATA.filter((s) => {
    const yearMatch = s.id.split("-")[1] === selectedYear;
    const seasonMatch =
      selectedSeason === "Forår"
        ? s.id.startsWith("foraar")
        : s.id.startsWith("efteraar");

    return yearMatch && seasonMatch;
  });

  const [selectedStayId, setSelectedStayId] = useState(
    filteredStays[0]?.id || DATA[0].id
  );

  const [selectedMainTrip, setSelectedMainTrip] = useState(null);
  const [selectedGlobalTrips, setSelectedGlobalTrips] = useState({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const selectedStay =
    DATA.find((s) => s.id === selectedStayId) || filteredStays[0];

  if (!selectedStay) return null;

  const schoolPrice = selectedStay.weeks * selectedStay.weeklyPrice;
  const materialPrice = selectedStay.weeks * MATERIAL_PRICE_PER_WEEK;
  const basePrice = schoolPrice + materialPrice;

  const mainTripPrice =
    selectedStay.trips.find((t) => t.id === selectedMainTrip)?.price || 0;

  const globalTripsPrice = selectedStay.globalTrips.reduce((sum, t) => {
    return selectedGlobalTrips[t.id] ? sum + t.price : sum;
  }, 0);

  const total =
    basePrice + mainTripPrice + globalTripsPrice + ENROLLMENT_FEE;

  const card = {
    border: "1px solid #e5e5e5",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    background: COLORS.card,
  };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        fontFamily: "system-ui",
        padding: "0 16px",

        // 🔥 IMPORTANT FIX
        display: "flex",
        alignItems: "flex-start",
        gap: 24,
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ flex: 1 }}>
        <section>
          <h2>1. Vælg ophold</h2>

          {filteredStays.map((stay) => (
            <div
              key={stay.id}
              onClick={() => setSelectedStayId(stay.id)}
              style={{
                ...card,
                cursor: "pointer",
                background:
                  selectedStayId === stay.id ? COLORS.soft : "#fff",
              }}
            >
              <div style={{ fontWeight: 700 }}>{stay.label}</div>

              {/* BEVARET FEATURE */}
              <div style={{ color: "#666", marginTop: 6 }}>
                {stay.weeks} uger ·{" "}
                {stay.weeklyPrice.toLocaleString("da-DK")} kr/uge
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 30 }}>
          <h2>2. Hovedfagsrejser</h2>

          {selectedStay.trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() =>
                setSelectedMainTrip((p) => (p === trip.id ? null : trip.id))
              }
              style={{
                ...card,
                cursor: "pointer",
                background:
                  selectedMainTrip === trip.id ? COLORS.soft : "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{trip.label}</span>
                <strong style={{ color: COLORS.primary }}>
                  {trip.price.toLocaleString("da-DK")} kr
                </strong>
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 30 }}>
          <h2>3. Fælles rejser</h2>

          {selectedStay.globalTrips.map((trip) => (
            <div key={trip.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{trip.label}</span>
                <strong style={{ color: COLORS.primary }}>
                  {trip.price.toLocaleString("da-DK")} kr
                </strong>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* SIDEBAR — ONLY FIXED PART */}
      {!isMobile && (
        <div
          style={{
            width: 320,

            // 🔥 THIS IS THE KEY FIX
            position: "sticky",
            top: 20,
            alignSelf: "flex-start",

            background: COLORS.soft,
            borderRadius: 18,
            padding: 20,
            height: "fit-content",
          }}
        >
          <h2>Din pris</h2>
          <hr />

          <p>Ophold: {schoolPrice.toLocaleString("da-DK")} kr.</p>
          <p>Materialepris: {materialPrice.toLocaleString("da-DK")} kr.</p>
          <p>Hovedfagsrejse: {mainTripPrice.toLocaleString("da-DK")} kr.</p>
          <p>Fælles rejser: {globalTripsPrice.toLocaleString("da-DK")} kr.</p>
          <p>Indmeldelse: {ENROLLMENT_FEE.toLocaleString("da-DK")} kr.</p>

          <h1 style={{ color: COLORS.primary }}>
            {total.toLocaleString("da-DK")} kr.
          </h1>
        </div>
      )}
    </div>
  );
}