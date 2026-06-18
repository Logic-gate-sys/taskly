import { intervalToDuration } from 'date-fns'

export type ShoppingListItemType = {
  id?: string
  name: string
  isCompleted?: boolean
  completedAt?: number
  lastUpdated?: number
  onDelete?: () => void
  onToggleComplete?: () => void
}

export type CountDownStatus = {
  isOverdue: boolean
  distance: ReturnType<typeof intervalToDuration>
}

export type PersistedCountdownState = {
  currentNotificationId: string | undefined
  completedAtTimestamps: number[]
}
export const countDownStorageKey = 'taskly-countdown-key'
