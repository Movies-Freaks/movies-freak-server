import DateUtils from 'jesusx21/dateUtils';
import Constants from './constants';

const sessionsFixture = [
  {
    token: Constants.TOKEN_1,
    expiresAt: DateUtils.getDateNDaysFromNow(2),
    isActive: true,
    userId: Constants.USER_1
  },
  {
    token: Constants.TOKEN_2,
    expiresAt: DateUtils.getDateNDaysAgo(2),
    isActive: false,
    userId: Constants.USER_2
  },
  {
    token: Constants.TOKEN_3,
    expiresAt: DateUtils.getDateNDaysFromNow(1),
    isActive: true,
    userId: Constants.USER_3
  },
  {
    token: Constants.TOKEN_4,
    expiresAt: DateUtils.getDateNDaysAgo(1),
    isActive: false,
    userId: Constants.USER_4
  },
  {
    token: Constants.TOKEN_5,
    expiresAt: DateUtils.getDateNDaysFromNow(1),
    isActive: true,
    userId: Constants.USER_5
  },
  {
    token: Constants.TOKEN_6,
    expiresAt: DateUtils.getDateNDaysAgo(1),
    isActive: false,
    userId: Constants.USER_1
  },
  {
    token: Constants.TOKEN_7,
    expiresAt: DateUtils.getDateNDaysFromNow(1),
    isActive: true,
    userId: Constants.USER_2
  },
  {
    token: Constants.TOKEN_8,
    expiresAt: DateUtils.getDateNDaysAgo(2),
    isActive: false,
    userId: Constants.USER_3
  },
  {
    token: Constants.TOKEN_9,
    expiresAt: DateUtils.getDateNDaysFromNow(2),
    isActive: true,
    userId: Constants.USER_4
  },
  {
    token: Constants.TOKEN_10,
    expiresAt: DateUtils.getDateNDaysAgo(2),
    isActive: false,
    userId: Constants.USER_5
  },
  {
    token: Constants.TOKEN_11,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: Constants.USER_1
  },
  {
    token: Constants.TOKEN_12,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: Constants.USER_2
  },
  {
    token: Constants.TOKEN_13,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: Constants.USER_3
  },
  {
    token: Constants.TOKEN_14,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: Constants.USER_4
  },
  {
    token: Constants.TOKEN_15,
    expiresAt: DateUtils.getDateNDaysAgo(3),
    isActive: false,
    userId: Constants.USER_5
  }
];

export default sessionsFixture;
