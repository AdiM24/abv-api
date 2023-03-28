interface SendEmailDto {
  user_id: number;
  partner_id: number;
  receiverEmailAddress: string;
  attachments?: any
}