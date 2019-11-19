export const status = {
  IDLE: 'IDLE',
  TRANSFERRING: 'TRANSFERRING',
  TRANSFERRED: 'TRANSFERRED'
}

export const statusMapText = {
  [status.IDLE]: 'Available',
  [status.TRANSFERRING]: 'Transferring',
  [status.TRANSFERRED]: 'Transferred'
}

export const statusMapColor = {
  [status.IDLE]: 'green',
  [status.TRANSFERRING]: 'orange',
  [status.TRANSFERRED]: 'red'
}
