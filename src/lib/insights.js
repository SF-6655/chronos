export function calculateStreak(entries) {
  if (entries.length === 0) return 0

  const daysWithEntries = new Set(
    entries.map(e => new Date(e.created_at).toDateString())
  )

  let streak = 0
  let checkDate = new Date()

  // If no entry today, check if yesterday was tracked to keep streak alive until end of day
  if (!daysWithEntries.has(checkDate.toDateString())) {
    checkDate.setDate(checkDate.getDate() - 1)
    if (!daysWithEntries.has(checkDate.toDateString())) {
      return 0
    }
  }

  while (daysWithEntries.has(checkDate.toDateString())) {
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  return streak
}

export function groupEntriesByDay(entries) {
  const groups = {}

  entries.forEach(entry => {
    const dateKey = new Date(entry.created_at).toDateString()
    const groupKey = `${dateKey}__${entry.category}__${entry.subcategory}`

    if (!groups[groupKey]) {
      groups[groupKey] = {
        id: groupKey,
        category: entry.category,
        subcategory: entry.subcategory,
        date: entry.created_at,
        totalSeconds: 0,
        sessions: [],
      }
    }

    groups[groupKey].totalSeconds += entry.duration_seconds || 0
    groups[groupKey].sessions.push(entry)
  })

  return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getSmartInsight(entries) {
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const lastWeekStart = new Date(weekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)

  const thisWeekEntries = entries.filter(e => new Date(e.created_at) >= weekStart)
  const lastWeekEntries = entries.filter(e => {
    const d = new Date(e.created_at)
    return d >= lastWeekStart && d < weekStart
  })

  if (thisWeekEntries.length === 0) {
    return "Start your first session this week to see insights here."
  }

  const thisWeekByCategory = {}
  thisWeekEntries.forEach(e => {
    thisWeekByCategory[e.category] = (thisWeekByCategory[e.category] || 0) + e.duration_seconds
  })

  const lastWeekByCategory = {}
  lastWeekEntries.forEach(e => {
    lastWeekByCategory[e.category] = (lastWeekByCategory[e.category] || 0) + e.duration_seconds
  })

  const topCategory = Object.entries(thisWeekByCategory).sort((a, b) => b[1] - a[1])[0]
  if (!topCategory) return "Keep tracking to unlock weekly insights."

  const [catName, catSeconds] = topCategory
  const lastWeekSeconds = lastWeekByCategory[catName] || 0

  if (lastWeekSeconds === 0) {
    return `${catName} is your top category this week with ${(catSeconds / 3600).toFixed(1)}h tracked.`
  }

  const pctChange = Math.round(((catSeconds - lastWeekSeconds) / lastWeekSeconds) * 100)

  if (pctChange > 10) {
    return `You've spent ${pctChange}% more time on ${catName} this week compared to last week.`
  } else if (pctChange < -10) {
    return `You've spent ${Math.abs(pctChange)}% less time on ${catName} this week compared to last week.`
  } else {
    return `Your ${catName} time is steady compared to last week — ${(catSeconds / 3600).toFixed(1)}h tracked.`
  }
}

export function getDayAccountedFor(entries) {
  const today = new Date().toDateString()
  const todayEntries = entries.filter(e => new Date(e.created_at).toDateString() === today)
  const trackedSeconds = todayEntries.reduce((sum, e) => sum + (e.duration_seconds || 0), 0)
  const totalDaySeconds = 16 * 3600 // assume 16 waking hours
  const untrackedSeconds = Math.max(totalDaySeconds - trackedSeconds, 0)

  const categoryColors = {
    Study: '#7c6ef5', Work: '#60a5fa', Health: '#4ade80',
    Lifestyle: '#f59e0b', 'Side Project': '#f472b6', Social: '#34d399',
  }

  const byCategory = {}
  todayEntries.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.duration_seconds
  })

  const segments = Object.entries(byCategory).map(([cat, secs]) => ({
    name: cat,
    value: secs,
    color: categoryColors[cat] || '#7c6ef5',
  }))

  segments.push({ name: 'Untracked', value: untrackedSeconds, color: '#1a1a2e' })

  return { segments, trackedSeconds, totalDaySeconds }
}