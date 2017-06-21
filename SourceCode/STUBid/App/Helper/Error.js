// Used via error
const error = (code) => {
  switch (code) {
    case 1000:
      return 'missingParameters';
    case 1001:
      return 'authenticationTokenIsNotValid';
    case 1002:
      return 'authenticationTokenHasBeenExpired';
    case 1010:
      return 'emailHasBeenTaken';
    case 1011:
      return 'phoneNumberHasBeenTaken';
    case 1012:
      return 'usernameHasBeenTaken';
    case 1013:
      return 'verificationCodeIsNotValid';
    case 1014:
      return 'registrationHasBeenExpired';
    case 1020:
      return 'wrongUsernameOrPassword';
    case 1021:
      return 'accountHasbeenBannedAtLevel1';
    case 1022:
      return 'accountHasBeenBannedAtLevel2';
    case 1030:
      return 'currentPasswordIsNotCorrect';
    case 1040:
      return 'emailNotFound';
    case 1050:
      return 'auctionClosed';
    case 1051:
      return 'someoneBiddedThatPrice';
    case 2000:
      return 'databaseConnectionError';
    case 2001:
      return 'databaseQueryError';
    case 2010:
      return 'canNotSendVerificationCodeViaSMS';
    case 2011:
      return 'canNotSendVerificationCodeViaEmail';
    case 2020:
      return 'formParsingFailed';
    default:
      return code;
  }
}

export default error;
