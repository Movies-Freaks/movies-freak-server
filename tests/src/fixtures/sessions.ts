import DateUtils from 'jesusx21/dateUtils';

import constants from './constants';

const sessionsFixture = [
  {
    createdAt: DateUtils.getDateNDaysAgo(1),
    token: constants.sessions.TOKEN_1,
    expiresAt: DateUtils.getDateNDaysFromNow(2),
    isActive: true,
    userId: constants.users.HERMIONE_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(5),
    token: constants.sessions.TOKEN_2,
    expiresAt: DateUtils.getDateNDaysAgo(2),
    isActive: false,
    userId: constants.users.ALBUS_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(2),
    token: constants.sessions.TOKEN_3,
    expiresAt: DateUtils.getDateNDaysFromNow(1),
    isActive: true,
    userId: constants.users.CEDRIC_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(4),
    token: constants.sessions.TOKEN_4,
    expiresAt: DateUtils.getDateNDaysAgo(1),
    isActive: false,
    userId: constants.users.NEWTON_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(2),
    token: constants.sessions.TOKEN_5,
    expiresAt: DateUtils.getDateNDaysFromNow(1),
    isActive: true,
    userId: constants.users.NARCISA_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(4),
    token: constants.sessions.TOKEN_6,
    expiresAt: DateUtils.getDateNDaysAgo(1),
    isActive: false,
    userId: constants.users.HERMIONE_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(2),
    token: constants.sessions.TOKEN_7,
    expiresAt: DateUtils.getDateNDaysFromNow(1),
    isActive: true,
    userId: constants.users.ALBUS_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(5),
    token: constants.sessions.TOKEN_8,
    expiresAt: DateUtils.getDateNDaysAgo(2),
    isActive: false,
    userId: constants.users.CEDRIC_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(1),
    token: constants.sessions.TOKEN_9,
    expiresAt: DateUtils.getDateNDaysFromNow(2),
    isActive: true,
    userId: constants.users.NEWTON_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(1),
    token: constants.sessions.TOKEN_10,
    expiresAt: DateUtils.getDateNDaysAgo(2),
    isActive: false,
    userId: constants.users.NARCISA_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(6),
    token: constants.sessions.TOKEN_11,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: constants.users.HERMIONE_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(6),
    token: constants.sessions.TOKEN_12,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: constants.users.ALBUS_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(6),
    token: constants.sessions.TOKEN_13,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: constants.users.CEDRIC_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(6),
    token: constants.sessions.TOKEN_14,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: constants.users.NEWTON_ID
  },
  {
    createdAt: DateUtils.getDateNDaysAgo(6),
    token: constants.sessions.TOKEN_15,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: constants.users.NARCISA_ID
  }
];

export default sessionsFixture;
