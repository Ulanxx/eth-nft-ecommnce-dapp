export class Exception {
  apiErrorCodeMessageMap = {
    '401': 'No permission',
    '400': 'Parameter error',
    '10001': 'Please install metamask',
    '10002': 'Please sign in your metamask',
    '30001': 'Public address is required',
    '30002': 'The address is not correct',
    '-32603': 'Metamask signature failed',
    '20000': 'Form validation fill',
    '20001': 'Min more larger than 0',
    '-1': 'Issuer public key existed',
    '-2': 'Issuer not exists',
    '-3': 'Owner not exists',
    // '-4': 'No billing for account other than brand role',
    // '-5': 'You are NOT a brand user',
    '-6': 'No enough balance in your account, please deposit.',
    '-7': 'No permission to mint token',
    '-8': 'No enough tokens to transfer',
    '-9': 'You are not a valid token owner',
    // '-10': 'Receiver\'s address is the same as the sender',
    '-11': 'Owner not exists',
    '-12': 'You are not an owner',
  }
}

export default new Exception()
