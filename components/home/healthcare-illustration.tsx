'use client'

export function HealthcareIllustration() {
  return (
    <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
      <div className="relative">
        {/* Simple SVG illustration */}
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Doctor figure */}
          <circle cx="200" cy="120" r="40" fill="hsl(142 76% 36%)" opacity="0.2" />
          <circle cx="200" cy="120" r="30" fill="hsl(142 76% 36%)" />
          <rect x="170" y="150" width="60" height="80" rx="10" fill="hsl(142 76% 36%)" />
          
          {/* Stethoscope */}
          <path
            d="M 180 160 Q 160 160 160 180 Q 160 200 180 200"
            stroke="hsl(182 73% 41%)"
            strokeWidth="4"
            fill="none"
          />
          <circle cx="160" cy="180" r="8" fill="hsl(182 73% 41%)" />
          
          {/* Medical cross */}
          <rect x="290" y="100" width="10" height="40" rx="2" fill="hsl(0 84.2% 60.2%)" />
          <rect x="275" y="115" width="40" height="10" rx="2" fill="hsl(0 84.2% 60.2%)" />
          
          {/* Leaves decoration */}
          <ellipse cx="100" cy="80" rx="15" ry="25" fill="hsl(142 76% 36%)" opacity="0.3" className="animate-leaf-sway" />
          <ellipse cx="320" cy="220" rx="12" ry="20" fill="hsl(142 76% 36%)" opacity="0.3" className="animate-leaf-sway" style={{animationDelay: '0.5s'}} />
        </svg>
      </div>
    </div>
  )
}

