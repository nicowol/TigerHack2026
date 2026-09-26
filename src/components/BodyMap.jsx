const zones = [
  ['back', 'M171 111Q220 91 269 111L249 143Q220 132 191 143Z'],
  [
    'shoulders',
    'M140 143Q157 117 193 124L187 163Q158 174 139 158Z M300 143Q283 117 247 124L253 163Q282 174 301 158Z',
  ],
  ['chest', 'M164 163Q220 188 276 163L268 217Q220 239 172 217Z'],
  [
    'arms',
    'M139 170Q158 176 169 193L154 269Q143 289 127 274Z M301 170Q282 176 271 193L286 269Q297 289 313 274Z',
  ],
  [
    'forearms',
    'M126 280Q142 290 153 276L141 351Q133 371 115 354Z M314 280Q298 290 287 276L299 351Q307 371 325 354Z',
  ],
  ['core', 'M175 226Q220 244 265 226L269 293Q220 311 171 293Z'],
]
export default function BodyMap({ selected, onSelect }) {
  return (
    <div className="body-map-wrap">
      <svg
        className="body-map"
        viewBox="0 0 440 470"
        role="img"
        aria-label="Interactive upper-body muscle map"
      >
        <defs>
          <linearGradient id="bodyFill">
            <stop stopColor="#9ab8ad" stopOpacity=".22" />
            <stop offset="1" stopColor="#58736d" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <ellipse cx="220" cy="228" rx="172" ry="205" fill="#10b981" opacity=".035" />
        <ellipse className="body" cx="220" cy="62" rx="31" ry="38" />
        <path
          className="body"
          d="M203 98c-2 13-5 21-13 26-28 7-45 18-54 40-8 21-12 73-17 116l-8 70c-2 17 8 25 19 23 9-2 13-10 15-22l19-105 11 58c4 19 8 34 7 54l-5 76c-1 16 7 24 18 24 9 0 15-7 16-19l9-75 9 75c1 12 7 19 16 19 11 0 19-8 18-24l-5-76c-1-20 3-35 7-54l11-58 19 105c2 12 6 20 15 22 11 2 21-6 19-23l-8-70c-5-43-9-95-17-116-9-22-26-33-54-40-8-5-11-13-13-26Z"
        />
        {zones.map(([id, path]) => (
          <path
            key={id}
            className={`zone ${selected === id ? 'selected' : ''}`}
            d={path}
            role="button"
            tabIndex="0"
            aria-label={`Select ${id}`}
            onClick={() => onSelect(id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(id)}
          />
        ))}
      </svg>
      <span className="map-hint">Tap a highlighted muscle group</span>
    </div>
  )
}
