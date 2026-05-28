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
      { id: "bouldering-kjuge", label: "Klatrerejse til Kjugekull (Bouldering, 1. periode)", price: 3500 },
      { id: "friluft-norge", label: "Vandring i Norge (Friluftsliv, 1. periode)", price: 4000 },
      { id: "skibums", label: "Skibums", price: 20500 },
    ],
    globalTrips: [{ id: "south-africa", label: "Sydafrika", price: 15750 }],
  },
  {
    id: "efteraar-2026-13",
    label: "21. september - 20. december  ·  13 uger",
    weeks: 13,
    weeklyPrice: 2150,
    trips: [],
    globalTrips: [{ id: "south-africa", label: "Sydafrika", price: 15750 }],
  },
  {
    id: "foraar-2027-25",
    label: "24. januar - 27. juni  ·  25 uger",
    weeks: 25,
    weeklyPrice: 2200,
    trips: [
      { id: "friluft-norge", label: "Fjeldski i Norge (Friluftsliv, 1. periode)", price: 4500 },
    ],
    globalTrips: [
      {
        id: "catalonia",
        label: "Catalonien (obligatorisk)",
        price: 7600,
        required: true,
      },
      { id: "alpine", label: "Alpin skitur i Italien", price: 7500 },
      { id: "fontainebleau", label: "Klatretur til Fontainebleau i Frankrig", price: 4500 },
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
      { id: "fontainebleau", label: "Klatretur til Fontainebleau i Frankrig", price: 4500 },
    ],
  },
  {
    id: "efteraar-2027-18",
    label: "16. august - 19. december  ·  18 uger",
    weeks: 18,
    weeklyPrice: 2200,
    trips: [
      { id: "bouldering-kjuge", label: "Klatrerejse til Kjugekull (Bouldering, 1. periode)", price: 3500 },
      { id: "friluft-norge", label: "Vandring i Norge (Friluftsliv, 1. periode)", price: 4500 },
      { id: "skibums", label: "Skibums", price: 22000 },
    ],
    globalTrips: [{ id: "south-africa", label: "Sydafrika", price: 17000 }],
  },
  {
    id: "efteraar-2027-13",
    label: "20. september - 19. december  ·  13 uger",
    weeks: 13,
    weeklyPrice: 2200,
    trips: [],
    globalTrips: [{ id: "south-africa", label: "Sydafrika", price: 17000 }],
  },
];

export default function PriceCalculator() {
  const [selectedStayId, setSelectedStayId] = useState(DATA[0].id);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedSeason, setSelectedSeason] = useState("Efterår");
  const [selectedMainTrip, setSelectedMainTrip] = useState(null);
  const [selectedGlobalTrips, setSelectedGlobalTrips] = useState({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const selectedStay = DATA.find((s) => s.id === selectedStayId);

  const years = [...new Set(DATA.map((s) => s.label.match(/\d{4}/)[0]))];

  const seasonsForYear = [
    ...new Set(
      DATA.filter((s) => s.label.includes(selectedYear)).map((s) =>
        s.label.includes("juni") ? "Forår" : "Efterår"
      )
    ),
  ];

  const filteredStays = DATA.filter((s) => {
    const yearMatch = s.label.includes(selectedYear);
    const seasonMatch =
      selectedSeason === "Forår"
        ? s.label.includes("juni")
        : s.label.includes("december");

    return yearMatch && seasonMatch;
  });

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    setSelectedMainTrip(null);

    const defaults = {};
    selectedStay.globalTrips.forEach((t) => {
      defaults[t.id] = !!t.required;
    });

    setSelectedGlobalTrips(defaults);
  }, [selectedStayId]);

  const handleMainTripChange = (id) => {
    setSelectedMainTrip(id);

    if (id === "skibums") {
      setSelectedGlobalTrips((prev) => ({
        ...prev,
        "south-africa": false,
      }));
    }
  };

  const toggleGlobalTrip = (id) => {
    setSelectedGlobalTrips((prev) => {
      const next = { ...prev, [id]: !prev[id] };

      if (id === "south-africa" && next[id] && selectedMainTrip === "skibums") {
        setSelectedMainTrip(null);
      }

      return next;
    });
  };

  const schoolPrice = selectedStay.weeks * selectedStay.weeklyPrice;
  const materialPrice = selectedStay.weeks * MATERIAL_PRICE_PER_WEEK;
  const basePrice = schoolPrice + materialPrice;

  const mainTripPrice =
    selectedStay.trips.find((t) => t.id === selectedMainTrip)?.price || 0;

  const globalTripsPrice =
    selectedStay.globalTrips.reduce((sum, t) => {
      return (
  selectedGlobalTrips[t.id]
    ? sum + t.price
    : sum
);
    }, 0);

  const total =
    basePrice + mainTripPrice + globalTripsPrice + ENROLLMENT_FEE;

  return (
    <div>
      {/* UI indhold her (samme som din version) */}
    </div>
  );
}