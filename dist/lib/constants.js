"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_STATUS_LABELS = exports.EVENT_STATUS = void 0;
exports.EVENT_STATUS = {
    ALL: 'all',
    EXPIRED: 'expired',
    REGISTRATION_CLOSED: 'registration_closed',
    FULL: 'full',
    DEADLINE_SOON: 'deadline_soon',
    ALMOST_FULL: 'almost_full',
    AVAILABLE: 'available',
};
exports.EVENT_STATUS_LABELS = {
    [exports.EVENT_STATUS.ALL]: '全部活動',
    [exports.EVENT_STATUS.EXPIRED]: '已結束',
    [exports.EVENT_STATUS.REGISTRATION_CLOSED]: '報名截止',
    [exports.EVENT_STATUS.FULL]: '名額已滿',
    [exports.EVENT_STATUS.DEADLINE_SOON]: '即將截止',
    [exports.EVENT_STATUS.ALMOST_FULL]: '即將額滿',
    [exports.EVENT_STATUS.AVAILABLE]: '開放報名',
};
