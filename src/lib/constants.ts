export const EVENT_STATUS = {
  ALL: 'all',
  EXPIRED: 'expired',
  REGISTRATION_CLOSED: 'registration_closed',
  FULL: 'full',
  DEADLINE_SOON: 'deadline_soon',
  ALMOST_FULL: 'almost_full',
  AVAILABLE: 'available',
} as const;

export const EVENT_STATUS_LABELS = {
  [EVENT_STATUS.ALL]: '全部活動',
  [EVENT_STATUS.EXPIRED]: '已結束',
  [EVENT_STATUS.REGISTRATION_CLOSED]: '報名截止',
  [EVENT_STATUS.FULL]: '名額已滿',
  [EVENT_STATUS.DEADLINE_SOON]: '即將截止',
  [EVENT_STATUS.ALMOST_FULL]: '即將額滿',
  [EVENT_STATUS.AVAILABLE]: '開放報名',
} as const;
