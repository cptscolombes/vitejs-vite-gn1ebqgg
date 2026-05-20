// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  GeoJSON,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Home,
  Building2,
  X,
  ChevronRight,
  Activity,
  Filter,
  Clock,
  Calendar,
  CheckCircle,
  Users,
} from 'lucide-react';

// ============================================================
// Logo CPTS embarqué
// ============================================================
const LOGO_CPTS =
  'data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCADGAc4DASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAYHBAUIAgMB/8QAShAAAQMDAQQFBgoHBwQDAQAAAQACAwQFEQYHEiExE0FRYXEUIoGRobEIMjZCUnN0ssHRFRcjNVRykhY0Q1ViouEzU4LiJCU3k//EABwBAQACAwEBAQAAAAAAAAAAAAAFBgIEBwMBCP/EADkRAAEDAwAGBwgCAgIDAQAAAAEAAgMEBREGEiExQVETYXGRocHRFCIyNIGx4fBy8SMzQlIVJDZE/9oADAMBAAIRAxEAPwDjJEREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREUw2aaQOpq6SaqL47fT46RzeBe7qaD716wQPnkEcYySvCqqY6WIyynDQoei6Q/sfpfybyf9CUe5jHxPO9fPKqDadpFuma6Kajc99BU53N7iWOHNufcpOuss9JH0jiCOOOChrbpHS3CXoWgtdwzxUOREUOrAiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIi9RRySvDI2Oe48g0ZK2GnrTNeK8U8Z3GDjI/HBo/NWdarVQ2yER0sDWkc3kZc7xKlbdaZa33gcN5+ijK+6R0fukZdyVWfoq54z+j6nH1RWI9rmOLXtLXDmCMEK7Mla68WagukRZUQt3zykaMOBUrPoy4NzE/J61Gw6QguxIzA6lUSLY3+0VFnrTBN5zDxjkA4OC1yrEkbo3FjxghWNj2yNDmnIKLo3Z1axaNH0FNjEkjOml/mdx9gwFz3a4hPc6WAjIkmY0jty4BdSBoaA0cgMBWbRiEGR8p4bO/+lStNKgtijhHEk939ooTtrhbLoeSR3Ewzxub6Tj8VNlDdszg3QdSM4LpYgO/zlYrmAaOTPIqoWUkXCHH/YKhERFzRdmREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREVk7O6WOGwioDcSTPJce4cApIo/s/mEunI25GY3uaQOripAukWprRRx6vJc/uZcauTPNERFILRWu1HaortbX07gBI3zon9jlU00b4pXxSNLXscWuB6iFdSrnaLQClvIqmDzKpu8f5hwP4FVbSOiBYKho2jYfJWSwVhDjA7cdo81rtHtDtVWtp5Grj+8F0ueZXMemJeh1HbZfo1UZ/3BdOngSstF/8AXJ2hQ+m3+2LsPkvxVxt5rWx2CioeBfNPv+AaP+QrHVGba7m2t1aKSM5ZRRCM8fnHifwW/fpujo3D/tgKK0WpzNcGu4NBPl9yoKpHo3Rt51RN/wDCiEVK04fUycGNPZ3nuCbP9L1Gqb4ykZvMpo/PqJcfFb2eJ6l0lbaKmt1D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bq23nWeg5Y4pI5WUrw14hnaXROB48D1HwVw6E1LDrCxy1EtAYd13RSxvG8x3DqJ5hai2bTdI3Wjay5ONLIfjwzxb7c9xAIXq67TNJWqicLbJ5VKAdyGCItaT3nAAW3EWx7ek93kqxdGVNwGoaItmz8Q3d+7x+qqPaZaKeyayraGlwIMiRjR8wOGd30ZUaWdfrnU3m71NzqyDNUPLnAch2AdwCwVGPILiRuXRKRkkcDGynLgBk9eNqIiLFbCIiIiIiIiIiIi2MN6ucUXRtqn7uMDPEhYdVUT1MhkqJXSOPWSvkizdI9wwTsWDY2NOQNqIiLBZopVsw1DDp3Ugnq94Uk8ZhlIGd3JBDvQQoqi9YZnQyCRm8LwqadlTE6KTc4YXTlVfbNS243CW5Uopg3eD2yA73gBzKoPXuo36lv763dcynYOjgYTxDR1nvPNaDJxjPBfikrjeJa1oYRgfcqHtGj8NteZA7WceJ4BERFEKfREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREX//2Q==';

// ============================================================
// DONNÉES — 64 IDELs de Colombes
// ============================================================
const INFIRMIERS_DATA = [
  {
    id: 1,
    nom: 'Marie Magdelaine Fanny',
    adresse: '124 Avenue Stalingrad, 92700 Colombes',
    telephone: '0761042685',
    email: 'zut71@hotmail.fr',
    lieu_exercice: 'Cabinet',
    weekend: 'Oui, régulièrement',
    horaires: ['5h45-14h30'],
    delai_prise_en_charge: 'Immédiat',
    psychiatrie: 'Oui, sans restriction',
    quartiers: [
      'Quartier Centre',
      'Quartier Fossés-Jean',
      'Quartier Arc Sportif Stade',
      'Quartier Europe',
    ],
    specialites: [
      'Pansements / soins de plaies',
      'Injections (SC, IM)',
      'Perfusions à domicile',
      'Préparation et administration de médicaments / piluliers',
      'Soins palliatifs',
      'Soins post-opératoires',
      'Surveillance de patients chroniques',
      'Éducation thérapeutique',
      'Bilans de Soins Infirmiers (BSI)',
      'Soins de stomies / ablation fils',
    ],
    has_questionnaire: true,
    lat: 48.93331,
    lng: 2.26537,
  },
  {
    id: 2,
    nom: 'Bougault Justine',
    adresse: '124 AVENUE DE STALINGRAD, 92700 Colombes',
    telephone: '',
    email: 'bjustine92@hotmail.fr',
    lieu_exercice: 'Cabinet',
    weekend: 'Oui, régulièrement',
    horaires: [],
    delai_prise_en_charge: null,
    psychiatrie: 'Oui, sans restriction',
    quartiers: [],
    specialites: [
      'Pansements / soins de plaies',
      'Injections (SC, IM)',
      'Prélèvements sanguins',
      'Perfusions à domicile',
      'Soins palliatifs',
      'Soins post-opératoires',
      'Préparation et administration de médicaments / piluliers',
      'Surveillance de patients chroniques',
      'Éducation thérapeutique',
      'Bilans de Soins Infirmiers (BSI)',
    ],
    has_questionnaire: false,
    lat: 48.93331,
    lng: 2.26537,
  },
  {
    id: 3,
    nom: 'Charif Narimel',
    adresse: '124 Avenue de Stalingrad, 92700 Colombes',
    telephone: '0651090380',
    email: 'charifnarimel@gmail.com',
    lieu_exercice: 'Cabinet',
    weekend: 'Oui, régulièrement',
    horaires: ['5h-12h', '14h-17h'],
    delai_prise_en_charge: 'Sous 48h',
    psychiatrie: 'Oui, selon le profil du patient',
    quartiers: ['Quartier Fossés-Jean'],
    specialites: [
      'Pansements / soins de plaies',
      'Injections (SC, IM)',
      'Perfusions à domicile',
      'Soins palliatifs',
      'Soins post-opératoires',
      'Préparation et administration de médicaments / piluliers',
      'Surveillance de patients chroniques',
      'Bilans de Soins Infirmiers (BSI)',
    ],
    has_questionnaire: true,
    lat: 48.93331,
    lng: 2.26537,
  },
  {
    id: 4,
    nom: 'Comolet Anna',
    adresse: '163 avenue Henri Barbusse, 92700 Colombes',
    telephone: '06 26 21 44 95',
    email: 'Anna.comolet@live.fr',
    lieu_exercice: 'Cabinet',
    weekend: 'Oui, régulièrement',
    horaires: ['5h-12h'],
    delai_prise_en_charge: 'Immédiat',
    psychiatrie: 'Oui, sans restriction',
    quartiers: ['Quartier Basch'],
    specialites: [
      'Pansements / soins de plaies',
      'Injections (SC, IM)',
      'Perfusions à domicile',
      'Préparation et administration de médicaments / piluliers',
      'Soins palliatifs',
      'Soins post-opératoires',
      'Surveillance de patients chroniques',
      'Bilans de Soins Infirmiers (BSI)',
    ],
    has_questionnaire: true,
    lat: 48.91483,
    lng: 2.25294,
  },
  {
    id: 5,
    nom: 'Elot Catherine',
    adresse: '21 bis rue Julien Galle, 92700 Colombes',
    telephone: '0699012325',
    email: 'elot.catherine8@gmail.com',
    lieu_exercice: 'Domicile',
    weekend: 'Oui, ponctuellement',
    horaires: ['5h-12h', '18h-21h'],
    delai_prise_en_charge: 'Sous 48h',
    psychiatrie: 'Non, par manque de formation',
    quartiers: ['Quartier Centre'],
    specialites: [
      'Injections (SC, IM)',
      'Pansements / soins de plaies',
      'Préparation et administration de médicaments / piluliers',
      'Perfusions à domicile',
      'Soins palliatifs',
      'Bilans de Soins Infirmiers (BSI)',
      'Soins post-opératoires',
    ],
    has_questionnaire: true,
    lat: 48.92319,
    lng: 2.25895,
  },
  {
    id: 6,
    nom: 'Khelfi-Ouai Ouarda',
    adresse: '107 Avenue de Stalingrad, 92700 Colombes',
    telephone: '0623877618',
    email: 'Ide92700@gmail.com',
    lieu_exercice: 'Cabinet',
    weekend: 'Oui, ponctuellement',
    horaires: ['5h-12h', '12h-18h'],
    delai_prise_en_charge: 'Sous 48h',
    psychiatrie: 'Non, plus depuis une mauvaise expérience',
    quartiers: ['Quartier Fossés-Jean'],
    specialites: [
      'Pansements / soins de plaies',
      'Injections (SC, IM)',
      'Perfusions à domicile',
      'Préparation et administration de médicaments / piluliers',
      'Soins palliatifs',
      'Soins post-opératoires',
      'Surveillance de patients chroniques',
      'Éducation thérapeutique',
      'Bilans de Soins Infirmiers (BSI)',
      'Prélèvements sanguins',
    ],
    has_questionnaire: true,
    lat: 48.93108,
    lng: 2.26694,
  },
  {
    id: 7,
    nom: 'Touati Reda',
    adresse: '267b rue des gros grès, 92700 Colombes',
    telephone: '0147863159',
    email: 'drtreda@yahoo.fr',
    lieu_exercice: 'Cabinet',
    weekend: 'Oui, régulièrement',
    horaires: ['5h-12h', '12h-18h', '18h-21h'],
    delai_prise_en_charge: 'Immédiat',
    psychiatrie: 'Oui, selon le profil du patient',
    quartiers: ['Quartier Basch', 'Quartier Grèves, Petit-Colombes'],
    specialites: [
      'Pansements / soins de plaies',
      'Injections (SC, IM)',
      'Prélèvements sanguins',
      'Perfusions à domicile',
      'Préparation et administration de médicaments / piluliers',
      'Soins palliatifs',
      'Soins post-opératoires',
      'Surveillance de patients chroniques',
      'Éducation thérapeutique',
      'Bilans de Soins Infirmiers (BSI)',
    ],
    has_questionnaire: true,
    lat: 48.91227,
    lng: 2.2276,
  },
  {
    id: 8,
    nom: 'Bensalah Amor',
    adresse: '267 B rue des Gros Grés, 92700 Colombes',
    telephone: '06 64 44 50 38',
    email: 'amorbensalah1@gmail.com',
    lieu_exercice: 'Domicile',
    weekend: 'Oui, régulièrement',
    horaires: ['7H-13H / 16H30-19H30'],
    delai_prise_en_charge: 'Immédiat',
    psychiatrie: 'Oui, sans restriction',
    quartiers: [
      'Quartier Grèves, Petit-Colombes',
      'Quartier Basch',
      'Quartier Petite-Garenne',
    ],
    specialites: [
      'Pansements / soins de plaies',
      'Injections (SC, IM)',
      'Perfusions à domicile',
      'Préparation et administration de médicaments / piluliers',
      'Soins post-opératoires',
      'Surveillance de patients chroniques',
      'Bilans de Soins Infirmiers (BSI)',
      'PEC Diabète',
    ],
    has_questionnaire: true,
    lat: 48.91227,
    lng: 2.2276,
  },
  {
    id: 9,
    nom: 'Bruno Leana',
    adresse: '29 rue Félix Faure, 92700 Colombes',
    telephone: '06 70 51 48 41',
    email: 'leana.bruno@gmail.com',
    lieu_exercice: 'Cabinet',
    weekend: 'Oui, régulièrement',
    horaires: [],
    delai_prise_en_charge: 'Immédiat',
    psychiatrie: 'Oui, sans restriction',
    quartiers: [],
    specialites: [
      'Pansements / soins de plaies',
      'Injections (SC, IM)',
      'Prélèvements sanguins',
      'Perfusions à domicile',
      'Préparation et administration de médicaments / piluliers',
      'Soins palliatifs',
      'Soins post-opératoires',
      'Surveillance de patients chroniques',
      'Éducation thérapeutique',
      'Bilans de Soins Infirmiers (BSI)',
      'Dialyse péritonéale',
    ],
    has_questionnaire: true,
    lat: 48.91496,
    lng: 2.25553,
  },
  {
    id: 10,
    nom: 'Denouel Christine',
    adresse: '329 bis rue Gabriel Péri, 92700 Colombes',
    telephone: '0147846403',
    email: 'Inf.denlan@wanadoo.fr',
    lieu_exercice: 'Domicile',
    weekend: 'Oui, régulièrement',
    horaires: ['7h-12h et 17h-20h'],
    delai_prise_en_charge: 'Sous 48h',
    psychiatrie: 'Oui, selon le profil du patient',
    quartiers: ['Quartier Petite-Garenne', 'Quartier Grèves, Petit-Colombes'],
    specialites: [
      'Pansements / soins de plaies',
      'Injections (SC, IM)',
      'Préparation et administration de médicaments / piluliers',
      'Soins post-opératoires',
      'Bilans de Soins Infirmiers (BSI)',
      'Éducation thérapeutique',
      'Surveillance de patients chroniques',
    ],
    has_questionnaire: true,
    lat: 48.91784,
    lng: 2.23774,
  },
];

// ============================================================
// Groupement par coordonnées GPS exactes
// ============================================================
function buildGroups(data) {
  const map = {};
  data.forEach((inf) => {
    const key = `${inf.lat.toFixed(4)}_${inf.lng.toFixed(4)}`;
    if (!map[key]) map[key] = [];
    map[key].push(inf.id);
  });
  return map;
}

// Icône unique (goutte)
const createSingleIcon = (selected, hasQ) =>
  L.divIcon({
    className: '',
    html: `<div style="width:${selected ? 36 : 28}px;height:${
      selected ? 36 : 28
    }px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${
      selected ? '#1a4f9f' : hasQ ? '#00b388' : '#1e9cd8'
    };border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [selected ? 36 : 28, selected ? 36 : 28],
    iconAnchor: [selected ? 18 : 14, selected ? 36 : 28],
  });

// Icône groupe (cercle avec nombre)
const createGroupIcon = (count, active, hasAnyQ) =>
  L.divIcon({
    className: '',
    html: `<div style="width:${active ? 46 : 38}px;height:${
      active ? 46 : 38
    }px;border-radius:50%;background:${
      active ? '#1a4f9f' : hasAnyQ ? '#00b388' : '#1e9cd8'
    };border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.32);display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:${
      active ? 15 : 13
    }px;font-family:system-ui;transition:all .2s;">${count}</div>`,
    iconSize: [active ? 46 : 38, active ? 46 : 38],
    iconAnchor: [active ? 23 : 19, active ? 23 : 19],
  });

function MapFly({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 16, { duration: 0.7 });
  }, [target, map]);
  return null;
}

function psyStyle(psy) {
  if (!psy) return { bg: '#f1f5f9', color: '#64748b' };
  if (psy.toLowerCase().includes('sans restriction'))
    return { bg: '#dcfce7', color: '#15803d' };
  if (psy.toLowerCase().includes('selon le profil'))
    return { bg: '#fef9c3', color: '#854d0e' };
  if (psy.toLowerCase().includes('non'))
    return { bg: '#fee2e2', color: '#b91c1c' };
  return { bg: '#f1f5f9', color: '#64748b' };
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function App() {
  const [selected, setSelected] = useState(null);
  const [groupPanel, setGroupPanel] = useState(null); // { key, members, rep }
  const [activeTab, setActiveTab] = useState(0); // onglet actif dans groupe
  const [search, setSearch] = useState('');
  const [filterLieu, setFilterLieu] = useState('Tous');
  const [filterSpe, setFilterSpe] = useState('Toutes');
  const [filterQ, setFilterQ] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const allSpecialites = [
    'Toutes',
    ...new Set(
      INFIRMIERS_DATA.flatMap((i) => i.specialites).map((s) => s.trim())
    ),
  ].sort((a, b) => (a === 'Toutes' ? -1 : a.localeCompare(b)));

  const filtered = INFIRMIERS_DATA.filter((inf) => {
    const matchSearch = inf.nom.toLowerCase().includes(search.toLowerCase());
    const matchLieu = filterLieu === 'Tous' || inf.lieu_exercice === filterLieu;
    const matchSpe =
      filterSpe === 'Toutes' ||
      inf.specialites.map((s) => s.trim()).includes(filterSpe);
    const matchQ = !filterQ || inf.has_questionnaire;
    return matchSearch && matchLieu && matchSpe && matchQ;
  });

  const activeFilters =
    (filterLieu !== 'Tous' ? 1 : 0) +
    (filterSpe !== 'Toutes' ? 1 : 0) +
    (filterQ ? 1 : 0);

  const openGroup = (members, key, rep) => {
    setGroupPanel({ key, members, rep });
    setActiveTab(0);
    setSelected(null);
  };

  const closeAll = () => {
    setSelected(null);
    setGroupPanel(null);
  };

  // IDEL affiché dans le panneau détail
  const detailTarget =
    selected || (groupPanel ? groupPanel.members[activeTab] : null);
  const showDetail = !!detailTarget;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: "'Segoe UI',system-ui,sans-serif",
        background: '#f0f4f8',
        overflow: 'hidden',
      }}
    >
      {/* ── SIDEBAR ── */}
      <div
        style={{
          width: 340,
          minWidth: 280,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRight: '1px solid #e2e8f0',
          zIndex: 10,
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header avec logo */}
        <div
          style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg,#1a4f9f 0%,#1e9cd8 100%)',
            color: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 6,
            }}
          >
            <img
              src={LOGO_CPTS}
              alt="CPTS Colombes"
              style={{
                height: 44,
                objectFit: 'contain',
                mixBlendMode: 'screen',
              }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                Annuaire IDELs
              </div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>
                CPTS de Colombes
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 11,
              opacity: 0.9,
            }}
          >
            <span>
              {filtered.length} infirmier{filtered.length > 1 ? 's' : ''}{' '}
              affiché{filtered.length > 1 ? 's' : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#00b388',
                  display: 'inline-block',
                }}
              ></span>
              Questionnaire ✓
            </span>
          </div>
        </div>

        {/* Recherche + filtres */}
        <div style={{ padding: '12px 12px 0' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              placeholder="Rechercher un nom…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 10px 9px 32px',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                background: '#f8fafc',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              background: showFilters ? '#eff6ff' : 'none',
              border: `1px solid ${showFilters ? '#1e9cd8' : '#e2e8f0'}`,
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              color: showFilters ? '#1a4f9f' : '#64748b',
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Filter size={13} />
            Filtres
            {activeFilters > 0 && (
              <span
                style={{
                  background: '#1a4f9f',
                  color: 'white',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeFilters}
              </span>
            )}
          </button>
          {showFilters && (
            <div
              style={{
                marginTop: 8,
                padding: 10,
                background: '#f8fafc',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  Lieu
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Tous', 'Cabinet', 'Domicile'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setFilterLieu(v)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 6,
                        border: '1px solid',
                        borderColor: filterLieu === v ? '#1a4f9f' : '#e2e8f0',
                        background: filterLieu === v ? '#1a4f9f' : 'white',
                        color: filterLieu === v ? 'white' : '#475569',
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: filterLieu === v ? 600 : 400,
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  Spécialité
                </label>
                <select
                  value={filterSpe}
                  onChange={(e) => setFilterSpe(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#475569',
                    background: 'white',
                  }}
                >
                  {allSpecialites.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#475569',
                }}
              >
                <input
                  type="checkbox"
                  checked={filterQ}
                  onChange={(e) => setFilterQ(e.target.checked)}
                  style={{ width: 14, height: 14 }}
                />
                Questionnaire renseigné uniquement
              </label>
              {activeFilters > 0 && (
                <button
                  onClick={() => {
                    setFilterLieu('Tous');
                    setFilterSpe('Toutes');
                    setFilterQ(false);
                  }}
                  style={{
                    fontSize: 12,
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: 0,
                  }}
                >
                  Réinitialiser
                </button>
              )}
            </div>
          )}
        </div>

        {/* Liste */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: 13,
              }}
            >
              Aucun résultat
            </div>
          ) : (
            filtered.map((inf) => (
              <div
                key={inf.id}
                onClick={() => {
                  setSelected(inf);
                  setGroupPanel(null);
                }}
                style={{
                  padding: '10px 14px',
                  margin: '0 8px 3px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background:
                    selected?.id === inf.id ? '#eff6ff' : 'transparent',
                  border: `1.5px solid ${
                    selected?.id === inf.id ? '#1e9cd8' : 'transparent'
                  }`,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (selected?.id !== inf.id)
                    e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  if (selected?.id !== inf.id)
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 3,
                      }}
                    >
                      <div
                        style={{
                          width: 27,
                          height: 27,
                          borderRadius: '50%',
                          background:
                            selected?.id === inf.id
                              ? '#1a4f9f'
                              : inf.has_questionnaire
                              ? '#d1fae5'
                              : '#dbeafe',
                          color:
                            selected?.id === inf.id
                              ? 'white'
                              : inf.has_questionnaire
                              ? '#065f46'
                              : '#1a4f9f',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 10,
                          flexShrink: 0,
                        }}
                      >
                        {inf.nom
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 12.5,
                          color: '#1e293b',
                        }}
                      >
                        {inf.nom}
                      </span>
                      {inf.has_questionnaire && (
                        <CheckCircle
                          size={11}
                          style={{ color: '#00b388', flexShrink: 0 }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        marginBottom: 3,
                      }}
                    >
                      {inf.lieu_exercice === 'Cabinet' ? (
                        <Building2 size={11} style={{ color: '#00b388' }} />
                      ) : (
                        <Home size={11} style={{ color: '#f59e0b' }} />
                      )}
                      <span style={{ fontSize: 11, color: '#64748b' }}>
                        {inf.lieu_exercice}
                      </span>
                      {inf.delai_prise_en_charge && (
                        <>
                          <span style={{ color: '#cbd5e1' }}>·</span>
                          <Clock size={10} style={{ color: '#94a3b8' }} />
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>
                            {inf.delai_prise_en_charge}
                          </span>
                        </>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {inf.specialites.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          style={{
                            background: '#f0f9ff',
                            color: '#1a4f9f',
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 12,
                            border: '1px solid #bfdbfe',
                            fontWeight: 500,
                          }}
                        >
                          {s.trim()}
                        </span>
                      ))}
                      {inf.specialites.length > 2 && (
                        <span
                          style={{
                            fontSize: 10,
                            color: '#94a3b8',
                            padding: '2px 0',
                          }}
                        >
                          +{inf.specialites.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    style={{
                      color: selected?.id === inf.id ? '#1a4f9f' : '#cbd5e1',
                      marginLeft: 4,
                      flexShrink: 0,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: '#94a3b8',
              margin: 0,
              textAlign: 'center',
            }}
          >
            © CPTS de Colombes — Annuaire IDEL 2025
          </p>
        </div>
      </div>

      {/* ── CARTE ── */}
      <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
        <MapContainer
          center={[48.921, 2.252]}
          zoom={14}
          style={{ flex: 1, height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />

          {/* Masque gris hors Colombes */}
          <GeoJSON
            key="mask"
            style={{
              fillColor: '#94a3b8',
              fillOpacity: 0.38,
              color: '#1a4f9f',
              weight: 2.5,
              opacity: 1,
            }}
          />

          <MapFly target={detailTarget} />

          {/* Marqueurs */}
          {(() => {
            const groups = buildGroups(filtered);
            return Object.entries(groups).map(([key, ids]) => {
              const members = INFIRMIERS_DATA.filter((i) => ids.includes(i.id));
              const rep = members[0];
              const isActive =
                (selected && ids.includes(selected.id)) ||
                groupPanel?.key === key;
              const hasAnyQ = members.some((m) => m.has_questionnaire);
              return (
                <Marker
                  key={key}
                  position={[rep.lat, rep.lng]}
                  icon={
                    ids.length > 1
                      ? createGroupIcon(ids.length, isActive, hasAnyQ)
                      : createSingleIcon(isActive, rep.has_questionnaire)
                  }
                  eventHandlers={{
                    click: () => {
                      if (ids.length === 1) {
                        setSelected(rep);
                        setGroupPanel(null);
                      } else {
                        openGroup(members, key, rep);
                      }
                    },
                  }}
                >
                  <Popup offset={[0, -10]}>
                    <div
                      style={{
                        fontFamily: 'Segoe UI,sans-serif',
                        minWidth: 150,
                      }}
                    >
                      {ids.length > 1 ? (
                        <>
                          <strong style={{ color: '#1a4f9f', fontSize: 13 }}>
                            {ids.length} infirmiers
                          </strong>
                          <br />
                          <span style={{ fontSize: 11, color: '#64748b' }}>
                            {rep.adresse}
                          </span>
                        </>
                      ) : (
                        <>
                          <strong style={{ color: '#1a4f9f', fontSize: 13 }}>
                            {rep.nom}
                          </strong>
                          <br />
                          <span style={{ fontSize: 11, color: '#64748b' }}>
                            {rep.lieu_exercice}
                          </span>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            });
          })()}
        </MapContainer>

        {/* ── PANNEAU DÉTAIL (groupe ou individuel) ── */}
        {showDetail && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 310,
              background: 'white',
              borderRadius: 14,
              boxShadow: '0 4px 28px rgba(0,0,0,0.15)',
              zIndex: 1000,
              maxHeight: 'calc(100vh - 32px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideIn 0.2s ease',
            }}
          >
            <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* En-tête gradient */}
            <div
              style={{
                background: 'linear-gradient(135deg,#1a4f9f,#1e9cd8)',
                padding: '14px',
                color: 'white',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <button
                onClick={closeAll}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                <X size={13} />
              </button>
              {groupPanel ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <Users size={18} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {groupPanel.members.length} infirmiers
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.85 }}>
                        {groupPanel.rep.adresse}
                      </div>
                    </div>
                  </div>
                  {/* ONGLETS */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 4,
                      flexWrap: 'wrap',
                      marginTop: 8,
                    }}
                  >
                    {groupPanel.members.map((m, i) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveTab(i)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 20,
                          border: 'none',
                          fontSize: 10.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all .15s',
                          background:
                            activeTab === i ? 'white' : 'rgba(255,255,255,0.2)',
                          color: activeTab === i ? '#1a4f9f' : 'white',
                        }}
                      >
                        {m.nom.split(' ')[0]}
                        {m.has_questionnaire ? ' ✓' : ''}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    {detailTarget.nom
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {detailTarget.nom}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.85,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    {detailTarget.lieu_exercice === 'Cabinet' ? (
                      <Building2 size={11} />
                    ) : (
                      <Home size={11} />
                    )}
                    {detailTarget.lieu_exercice}
                    {detailTarget.has_questionnaire && (
                      <span
                        style={{
                          background: 'rgba(0,179,136,0.3)',
                          padding: '1px 6px',
                          borderRadius: 8,
                          fontSize: 10,
                          marginLeft: 4,
                        }}
                      >
                        Questionnaire ✓
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Corps */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '12px 14px' }}>
              {groupPanel && (
                <div
                  style={{
                    marginBottom: 10,
                    paddingBottom: 10,
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13.5,
                      color: '#1e293b',
                      marginBottom: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {detailTarget.nom}
                    {detailTarget.has_questionnaire && (
                      <CheckCircle size={12} style={{ color: '#00b388' }} />
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      color: '#64748b',
                    }}
                  >
                    {detailTarget.lieu_exercice === 'Cabinet' ? (
                      <Building2 size={11} style={{ color: '#00b388' }} />
                    ) : (
                      <Home size={11} style={{ color: '#f59e0b' }} />
                    )}
                    {detailTarget.lieu_exercice}
                  </div>
                </div>
              )}

              <IRow icon={<MapPin size={13} />} text={detailTarget.adresse} />
              {detailTarget.telephone && (
                <IRow
                  icon={<Phone size={13} />}
                  text={detailTarget.telephone}
                  href={`tel:${detailTarget.telephone.replace(/\s/g, '')}`}
                />
              )}
              {detailTarget.email && (
                <IRow
                  icon={<Mail size={13} />}
                  text={detailTarget.email}
                  href={`mailto:${detailTarget.email}`}
                />
              )}

              <ISec title="Infos pratiques">
                {detailTarget.delai_prise_en_charge && (
                  <IBadge
                    icon={<Clock size={11} />}
                    label="Délai"
                    value={detailTarget.delai_prise_en_charge}
                  />
                )}
                {detailTarget.weekend && (
                  <IBadge
                    icon={<Calendar size={11} />}
                    label="Week-end"
                    value={detailTarget.weekend}
                  />
                )}
                {detailTarget.horaires?.length > 0 && (
                  <IBadge
                    icon={<Clock size={11} />}
                    label="Horaires"
                    value={detailTarget.horaires.join(', ')}
                  />
                )}
              </ISec>

              <ISec title="Prise en charge psy">
                <span
                  style={{
                    ...psyStyle(detailTarget.psychiatrie),
                    fontSize: 11,
                    padding: '3px 9px',
                    borderRadius: 12,
                    fontWeight: 500,
                  }}
                >
                  {detailTarget.psychiatrie || 'Non renseigné'}
                </span>
              </ISec>

              {detailTarget.quartiers?.length > 0 && (
                <ISec title="Secteurs couverts">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {detailTarget.quartiers.map((q) => (
                      <span
                        key={q}
                        style={{
                          background: '#f0fdf4',
                          color: '#166534',
                          fontSize: 10,
                          padding: '2px 7px',
                          borderRadius: 12,
                          border: '1px solid #bbf7d0',
                          fontWeight: 500,
                        }}
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </ISec>
              )}

              <ISec title="Spécialités">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {detailTarget.specialites.map((s) => (
                    <span
                      key={s}
                      style={{
                        background: '#eff6ff',
                        color: '#1a4f9f',
                        fontSize: 10,
                        padding: '2px 7px',
                        borderRadius: 12,
                        border: '1px solid #bfdbfe',
                        fontWeight: 500,
                      }}
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </ISec>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Utilitaires ──
function IRow({ icon, text, href }) {
  const inner = (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 7,
      }}
    >
      <span style={{ color: '#1e9cd8', marginTop: 2, flexShrink: 0 }}>
        {icon}
      </span>
      <span
        style={{
          fontSize: 12.5,
          color: href ? '#1a4f9f' : '#475569',
          wordBreak: 'break-all',
          textDecoration: href ? 'underline' : 'none',
        }}
      >
        {text}
      </span>
    </div>
  );
  return href ? (
    <a href={href} style={{ textDecoration: 'none' }}>
      {inner}
    </a>
  ) : (
    inner
  );
}
function ISec({ title, children }) {
  return (
    <div
      style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #e2e8f0' }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: '0 0 6px',
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
function IBadge({ icon, label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: '#475569',
        marginBottom: 4,
      }}
    >
      <span style={{ color: '#94a3b8' }}>{icon}</span>
      <span style={{ color: '#94a3b8', minWidth: 52 }}>{label}</span>
      <span style={{ fontWeight: 500, color: '#1e293b' }}>{value}</span>
    </div>
  );
}
