export type ShoppingListItemType = {
  id?: string
  name: string
  isCompleted?: boolean
  completedAt?: number
  lastUpdated?: number
  onDelete?: () => void
  onToggleComplete?: () => void
}
