export const InviteSendStatus = {
  Invited: 'invited',
  Suspended: 'suspended',
  Member: 'member',
}

export interface Invite {
  email: string,
  role: number
}
