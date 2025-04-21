import { getRandomUUID } from 'jesusx21/uuid';

const constants = {
  sessions: {
    TOKEN_1: getRandomUUID(),
    TOKEN_2: getRandomUUID(),
    TOKEN_3: getRandomUUID(),
    TOKEN_4: getRandomUUID(),
    TOKEN_5: getRandomUUID(),
    TOKEN_6: getRandomUUID(),
    TOKEN_7: getRandomUUID(),
    TOKEN_8: getRandomUUID(),
    TOKEN_9: getRandomUUID(),
    TOKEN_10: getRandomUUID(),
    TOKEN_11: getRandomUUID(),
    TOKEN_12: getRandomUUID(),
    TOKEN_13: getRandomUUID(),
    TOKEN_14: getRandomUUID(),
    TOKEN_15: getRandomUUID()
  },

  users: {
    ALBUS_ID: getRandomUUID(),
    CEDRIC_ID: getRandomUUID(),
    HARRY_ID: getRandomUUID(),
    HERMIONE_ID: getRandomUUID(),
    NARCISA_ID: getRandomUUID(),
    NEWTON_ID: getRandomUUID()
  },

  watchHubs: {
    CHRISTMAS_ID: getRandomUUID(),
    HALLOWEEN_ID: getRandomUUID(),
    MCU_ID: getRandomUUID(),
    STAR_WARS_ID: getRandomUUID(),
    VALENTINE_ID: getRandomUUID()
  }
};

export default constants;
