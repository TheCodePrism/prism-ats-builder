'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Type, Palette, Type as FontIcon } from 'lucide-react'

export default function ThemeCustomizer() {
  const { data, updateSettings } = useResumeStore()

  const colors = [
    { name: 'Forge Blue', value: '#0A84FF' },
    { name: 'Hunter Green', value: '#30D158' },
    { name: 'Monarch Purple', value: '#BF5AF2' },
    { name: 'Crimson Edge', value: '#FF453A' },
    { name: 'Onyx', value: '#1C1C1E' },
  ]

  const fonts = [
    { name: 'Outfit', value: 'var(--font-outfit)' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Playfair', value: 'Playfair Display, serif' },
    { name: 'Mono', value: 'ui-monospace, monospace' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Primary Color
        </h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateSettings({ primaryColor: color.value })}
              className={`w-10 h-10 rounded-full border-4 transition-all ${data.settings.primaryColor === color.value ? 'border-primary' : 'border-transparent hover:scale-110'}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <FontIcon className="w-4 h-4" />
          Typography
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {fonts.map((font) => (
            <button
              key={font.name}
              onClick={() => updateSettings({ fontFamily: font.value })}
              className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${data.settings.fontFamily === font.value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/30'}`}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Type className="w-4 h-4" />
          Font Size ({data.settings.fontSize}px)
        </h3>
        <input
          type="range"
          min="10"
          max="16"
          step="0.5"
          value={data.settings.fontSize}
          onChange={(e) => updateSettings({ fontSize: parseFloat(e.target.value) })}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-2 uppercase font-bold tracking-widest">
          <span>Small</span>
          <span>Medium</span>
          <span>Large</span>
        </div>
      </div>
    </div>
  )
}
