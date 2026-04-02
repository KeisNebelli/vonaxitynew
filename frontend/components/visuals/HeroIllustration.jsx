export default function HeroIllustration() {
  return (
    <svg width="100%" viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', maxWidth:480 }}>
      {/* Background circle */}
      <circle cx="240" cy="180" r="160" fill="#EFF6FF" />
      <circle cx="240" cy="180" r="120" fill="#DBEAFE" opacity="0.5" />

      {/* House */}
      <rect x="160" y="200" width="160" height="100" rx="4" fill="#fff" stroke="#BFDBFE" strokeWidth="2" />
      <polygon points="150,200 240,140 330,200" fill="#2563EB" opacity="0.9" />
      <rect x="210" y="240" width="40" height="60" rx="4" fill="#BFDBFE" />
      <rect x="170" y="220" width="35" height="30" rx="3" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
      <rect x="275" y="220" width="35" height="30" rx="3" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />

      {/* Nurse figure */}
      <circle cx="320" cy="175" r="22" fill="#ECFDF5" stroke="#6EE7B7" strokeWidth="2" />
      <circle cx="320" cy="168" r="10" fill="#fff" stroke="#6EE7B7" strokeWidth="1.5" />
      <path d="M305 195 Q320 185 335 195 L338 230 H302 Z" fill="#059669" opacity="0.9" />
      {/* Nurse cross */}
      <rect x="316" y="200" width="8" height="20" rx="2" fill="#fff" />
      <rect x="310" y="206" width="20" height="8" rx="2" fill="#fff" />
      {/* Medical bag */}
      <rect x="334" y="210" width="22" height="18" rx="4" fill="#fff" stroke="#6EE7B7" strokeWidth="1.5" />
      <line x1="345" y1="214" x2="345" y2="224" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <line x1="340" y1="219" x2="350" y2="219" stroke="#059669" strokeWidth="2" strokeLinecap="round" />

      {/* Elderly person */}
      <circle cx="160" cy="195" r="18" fill="#FFF7ED" stroke="#FDE68A" strokeWidth="1.5" />
      <circle cx="160" cy="189" r="8" fill="#fff" stroke="#FDE68A" strokeWidth="1.5" />
      <path d="M148 212 Q160 202 172 212 L174 235 H146 Z" fill="#F59E0B" opacity="0.7" />
      {/* Walking stick */}
      <line x1="174" y1="218" x2="182" y2="248" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="178" y1="248" x2="186" y2="248" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />

      {/* Heart pulse line */}
      <path d="M100 120 L125 120 L135 100 L145 140 L155 120 L165 120 L175 110 L185 130 L195 120 L220 120" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />

      {/* Floating cards */}
      <rect x="60" y="150" width="80" height="44" rx="10" fill="#fff" stroke="#E5E7EB" strokeWidth="1.5" />
      <circle cx="78" cy="168" r="8" fill="#ECFDF5" />
      <rect x="91" y="162" width="36" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="91" y="171" width="24" height="4" rx="2" fill="#DBEAFE" />
      <text x="78" y="171" fontFamily="Inter,system-ui" fontSize="9" fontWeight="700" fill="#059669" textAnchor="middle">✓</text>

      <rect x="340" y="130" width="80" height="44" rx="10" fill="#fff" stroke="#E5E7EB" strokeWidth="1.5" />
      <circle cx="358" cy="148" r="8" fill="#EFF6FF" />
      <rect x="371" y="142" width="36" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="371" y="151" width="28" height="4" rx="2" fill="#DBEAFE" />
      <text x="358" y="151" fontFamily="Inter,system-ui" fontSize="8" fontWeight="700" fill="#2563EB" textAnchor="middle">BP</text>

      {/* Decorative dots */}
      <circle cx="80" cy="230" r="4" fill="#BFDBFE" />
      <circle cx="95" cy="248" r="3" fill="#6EE7B7" />
      <circle cx="380" cy="240" r="4" fill="#FDE68A" />
      <circle cx="395" cy="225" r="3" fill="#BFDBFE" />
    </svg>
  );
}
