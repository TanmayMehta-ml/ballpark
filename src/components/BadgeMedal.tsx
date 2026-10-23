import { BookOpen, Calendar, Compass, Crosshair, Crown, EyeOff, Flame, GraduationCap, Library, Lock, Rocket, Target } from 'lucide-react'
import { GROUP_META, type Badge, type BadgeIcon } from '../lib/badges'

const ICONS: Record<BadgeIcon, typeof Flame> = {
  flame: Flame, crown: Crown, calendar: Calendar, book: BookOpen, library: Library, cap: GraduationCap,
  target: Target, crosshair: Crosshair, eye: EyeOff, compass: Compass, rocket: Rocket,
}

/** A round medal with a ribbon, tinted by badge group. Locked badges are greyed out. */
export function BadgeMedal({ badge, size = 64 }: { badge: Badge; size?: number }) {
  const Icon = ICONS[badge.icon]
  const color = GROUP_META[badge.group].color
  const showLabel = badge.group === 'month' || (badge.group === 'streak' && badge.label)
  return (
    <span className={`medal ${badge.earned ? 'on' : 'off'}`} style={{ width: size, height: size, ['--mc' as string]: color }}>
      <span className="medalRing">
        {showLabel ? (
          <span className="medalText">
            {badge.group === 'month' && <Icon size={size * 0.2} strokeWidth={2.4} />}
            <b style={{ fontSize: badge.group === 'month' ? size * 0.23 : badge.label!.length > 2 ? size * 0.26 : size * 0.32 }}>{badge.label}</b>
            {badge.group === 'streak' && <Icon size={size * 0.2} strokeWidth={2.4} />}
          </span>
        ) : (
          <Icon size={size * 0.46} strokeWidth={2.2} />
        )}
      </span>
      {!badge.earned && <span className="medalLock"><Lock size={size * 0.17} /></span>}
    </span>
  )
}
