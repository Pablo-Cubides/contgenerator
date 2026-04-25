export function getOptimalSchedule(platform: string) {
  const now = new Date();
  const schedule = new Date(now);

  switch (platform.toLowerCase()) {
    case 'twitter':
      schedule.setHours(9, 0, 0); // 9 AM
      break;
    case 'linkedin':
      schedule.setHours(8, 30, 0); // 8:30 AM
      break;
    case 'instagram':
      schedule.setHours(18, 0, 0); // 6 PM
      break;
    default:
      schedule.setHours(12, 0, 0); // Noon
  }

  // If time already passed today, set for tomorrow
  if (schedule < now) {
    schedule.setDate(schedule.getDate() + 1);
  }

  return schedule.toISOString();
}
