import React, { useEffect, useMemo, useState } from "react";

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
    label: "10. august - 20. december",
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
    label: "21. september - 20. december",
    weeks: 13,
    weeklyPrice: 2150,
    trips: [],
    globalTrips: [
      { id: "south-africa", label: "Sydafrika", price: 15750 },
    ],
  },

  {
    id: "foraar-2027-25",
    label: "24. januar - 27. juni",
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
      {
        id: "alpine",
        label: "Alpin skitur i Italien",
        price: 7500,
      },
      {
        id: "fontainebleau",
        label: "Klatretur til Fontainebleau i Frankrig",
        price: 4500,
      },
    ],
  },

  {
    id: "foraar-2027-15",
    label: "15. marts - 27. juni",
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
    label: "16. august - 19. december",
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
    label: "20. september - 19. december",
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
  const [selectedMainTrip, setSelectedMainTrip] = useState(null);
  const [selectedGlobalTrips, setSelectedGlobalTrips] = useState({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const filteredStays = useMemo(() => {
    return DATA.filter((s) => {
      const yearMatch = s.id.split("-")[1] === selectedYear;

      const seasonMatch =
        selectedSeason === "Forår"
          ? s.id.startsWith("foraar")
          : s.id.startsWith("efteraar");

      return yearMatch && seasonMatch;
    });
  }, [selectedYear, selectedSeason]);

  const [selectedStayId, setSelectedStayId] = useState(
    filteredStays[0]?.id || DATA[0].id
  );

  const selectedStay = useMemo(() => {
    return (
      DATA.find((s) => s.id === selectedStayId) || filteredStays[0]
    );
  }, [selectedStayId, filteredStays]);

  useEffect(() => {
    if (!filteredStays.find((s) => s.id === selectedStayId)) {
      setSelectedStayId(filteredStays[0]?.id);
    }
  }, [filteredStays, selectedStayId]);

  useEffect(() => {
    if (!selectedStay) return;

    setSelectedMainTrip(null);

    const defaults = {};

    selectedStay.globalTrips.forEach((t) => {
      defaults[t.id] = !!t.required;
    });

    setSelectedGlobalTrips(defaults);
  }, [selectedStay]);

  useEffect(() => {
  const sendHeight = () => {
    requestAnimationFrame(() => {
      const height =
        document.documentElement.scrollHeight;

      window.parent.postMessage(
        {
          type: "PRICE_CALCULATOR_HEIGHT",
          height: height + 20,
        },
        "*"
      );
    });
  };

  sendHeight();

  window.addEventListener("resize", sendHeight);

  return () => {
    window.removeEventListener(
      "resize",
      sendHeight
    );
  };
}, [
  selectedStayId,
  selectedMainTrip,
  selectedGlobalTrips,
  isSheetOpen,
]);

  if (!selectedStay) return null;

  const years = [
    ...new Set(DATA.map((s) => s.id.split("-")[1])),
  ];

  const seasonsForYear = [
    ...new Set(
      DATA.filter(
        (s) => s.id.split("-")[1] === selectedYear
      ).map((s) =>
        s.id.startsWith("foraar")
          ? "Forår"
          : "Efterår"
      )
    ),
  ];

  const handleMainTripChange = (id) => {
    setSelectedMainTrip((prev) => {
      const nextValue = prev === id ? null : id;

      if (nextValue === "skibums") {
        setSelectedGlobalTrips((prevTrips) => ({
          ...prevTrips,
          "south-africa": false,
        }));
      }

      return nextValue;
    });
  };

  const toggleGlobalTrip = (id) => {
    setSelectedGlobalTrips((prev) => {
      const next = {
        ...prev,
        [id]: !prev[id],
      };

      if (
        id === "south-africa" &&
        next[id] &&
        selectedMainTrip === "skibums"
      ) {
        setSelectedMainTrip(null);
      }

      return next;
    });
  };

  const schoolPrice =
    selectedStay.weeks * selectedStay.weeklyPrice;

  const materialPrice =
    selectedStay.weeks * MATERIAL_PRICE_PER_WEEK;

  const basePrice = schoolPrice + materialPrice;

  const mainTripPrice =
    selectedStay.trips.find((t) => t.id === selectedMainTrip)?.price || 0;

  const globalTripsPrice =
    selectedStay.globalTrips.reduce((sum, t) => {
      return selectedGlobalTrips[t.id]
        ? sum + t.price
        : sum;
    }, 0);

  const total =
    basePrice +
    mainTripPrice +
    globalTripsPrice +
    ENROLLMENT_FEE;

  const card = {
    border: "1px solid #e5e5e5",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    background: COLORS.card,
    transition: "all 0.15s ease",
    willChange: "transform",
  };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        fontFamily: "system-ui",
        padding: "24px 16px 120px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 24,
        color: COLORS.text,
        contain: "layout style",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <section>
          <h2>1. Vælg ophold</h2>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            {years.map((year) => {
              const selected = selectedYear === year;

              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 14,
                    border: selected
                      ? `2px solid ${COLORS.primary}`
                      : "1px solid #ddd",
                    background: selected
                      ? COLORS.soft
                      : "#fff",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {year}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            {seasonsForYear.map((season) => {
              const selected = selectedSeason === season;

              return (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 14,
                    border: selected
                      ? `2px solid ${COLORS.primary}`
                      : "1px solid #ddd",
                    background: selected
                      ? COLORS.soft
                      : "#fff",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {season}
                </button>
              );
            })}
          </div>

          {filteredStays.map((stay) => {
            const selected = selectedStayId === stay.id;

            return (
              <div
                key={stay.id}
                onClick={() => setSelectedStayId(stay.id)}
                style={{
                  ...card,
                  cursor: "pointer",
                  background: selected
                    ? COLORS.soft
                    : "#fff",
                  border: selected
                    ? `2px solid ${COLORS.primary}`
                    : "1px solid #ddd",
                  boxShadow: selected
                    ? "0 10px 25px rgba(0,0,0,0.08)"
                    : "none",
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {stay.label}
                </div>

                <div
                  style={{
                    color: "#666",
                    marginTop: 6,
                  }}
                >
                  {stay.weeks} uger ·{" "}
                  {stay.weeklyPrice.toLocaleString(
                    "da-DK"
                  )}{" "}
                  kr/uge
                </div>
              </div>
            );
          })}
        </section>

        <section style={{ marginTop: 30 }}>
          <h2>2. Hovedfagsrejser</h2>

          {selectedStay.trips.length === 0 ? (
            <p style={{ color: "#666" }}>
              Ingen hovedfagsrejser til dette ophold.
            </p>
          ) : (
            selectedStay.trips.map((trip) => {
              const selected =
                selectedMainTrip === trip.id;

              return (
                <div
                  key={trip.id}
                  onClick={() =>
                    handleMainTripChange(trip.id)
                  }
                  style={{
                    ...card,
                    cursor: "pointer",
                    background: selected
                      ? COLORS.soft
                      : "#fff",
                    border: selected
                      ? `2px solid ${COLORS.primary}`
                      : "1px solid #ddd",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 12,
                    }}
                  >
                    <span>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          handleMainTripChange(
                            trip.id
                          )
                        }
                      />{" "}
                      {trip.label}
                    </span>

                    <strong
                      style={{
                        color: COLORS.primary,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {trip.price.toLocaleString(
                        "da-DK"
                      )}{" "}
                      kr
                    </strong>
                  </label>
                </div>
              );
            })
          )}
        </section>

        <section style={{ marginTop: 30 }}>
          <h2>3. Fælles rejser</h2>

          {selectedStay.globalTrips.map((trip) => {
            const disabled =
              trip.id === "south-africa" &&
              selectedMainTrip === "skibums";

            const checked =
              selectedGlobalTrips[trip.id];

            return (
              <div
                key={trip.id}
                style={{
                  ...card,
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled
                    ? "not-allowed"
                    : "pointer",
                  background: checked
                    ? COLORS.soft
                    : "#fff",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 12,
                  }}
                >
                  <span>
                    <input
                      type="checkbox"
                      checked={checked || false}
                      disabled={
                        disabled || trip.required
                      }
                      onChange={() =>
                        toggleGlobalTrip(trip.id)
                      }
                    />{" "}
                    {trip.label}
                  </span>

                  <strong
                    style={{
                      color: COLORS.primary,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {trip.price.toLocaleString(
                      "da-DK"
                    )}{" "}
                    kr
                    {trip.required &&
                      " (obligatorisk)"}
                  </strong>
                </label>
              </div>
            );
          })}
        </section>
      </div>

      {!isMobile && (
        <div
          style={{
            width: 320,
            position: "sticky",
            top: 24,
            alignSelf: "flex-start",
            background: COLORS.soft,
            borderRadius: 18,
            padding: 20,
            height: "fit-content",
            boxSizing: "border-box",
          }}
        >
          <h2>Din pris</h2>

          <hr />

          <p>
            Ophold:{" "}
            {schoolPrice.toLocaleString("da-DK")} kr.
          </p>

          <p>
            Materialepris:{" "}
            {materialPrice.toLocaleString("da-DK")} kr.
          </p>

          <p>
            Hovedfagsrejse:{" "}
            {mainTripPrice.toLocaleString("da-DK")} kr.
          </p>

          <p>
            Fælles rejser:{" "}
            {globalTripsPrice.toLocaleString(
              "da-DK"
            )}{" "}
            kr.
          </p>

          <p>
            Indmeldelse:{" "}
            {ENROLLMENT_FEE.toLocaleString(
              "da-DK"
            )}{" "}
            kr.
          </p>

          <h1 style={{ color: COLORS.primary }}>
            {total.toLocaleString("da-DK")} kr.
          </h1>
        </div>
      )}

      {isMobile && (
        <>
<div
  onClick={() => setIsSheetOpen(true)}
  style={{
    position: "sticky",
    bottom: 16,
    marginTop: 24,
    background: COLORS.primary,
    color: "#fff",
    padding: 16,
    textAlign: "center",
    fontWeight: 700,
    zIndex: 999,
    borderRadius: 18,
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)",
    cursor: "pointer",
  }}
>
  {total.toLocaleString("da-DK")} kr ·
  Se detaljer
</div>

          {isSheetOpen && (
            <>
              <div
                onClick={() =>
                  setIsSheetOpen(false)
                }
                style={{
                  position: "fixed",
                  inset: 0,
                  background:
                    "rgba(0,0,0,0.4)",
                  zIndex: 1000,
                }}
              />

              <div
                style={{
                  position: "fixed",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "#fff",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                  zIndex: 1001,
                }}
              >
                <h2>Din pris</h2>

                <hr />

                <p>
                  Ophold:{" "}
                  {schoolPrice.toLocaleString(
                    "da-DK"
                  )}{" "}
                  kr.
                </p>

                <p>
                  Materialepris:{" "}
                  {materialPrice.toLocaleString(
                    "da-DK"
                  )}{" "}
                  kr.
                </p>

                <p>
                  Hovedfagsrejse:{" "}
                  {mainTripPrice.toLocaleString(
                    "da-DK"
                  )}{" "}
                  kr.
                </p>

                <p>
                  Fælles rejser:{" "}
                  {globalTripsPrice.toLocaleString(
                    "da-DK"
                  )}{" "}
                  kr.
                </p>

                <p>
                  Indmeldelse:{" "}
                  {ENROLLMENT_FEE.toLocaleString(
                    "da-DK"
                  )}{" "}
                  kr.
                </p>

                <h1
                  style={{
                    color: COLORS.primary,
                  }}
                >
                  {total.toLocaleString("da-DK")} kr.
                </h1>

                <button
                  onClick={() =>
                    setIsSheetOpen(false)
                  }
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: 14,
                    borderRadius: 12,
                    border: "none",
                    background: COLORS.primary,
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Luk
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}