export type User = {
  id: string;
  name: {
    first_name: string;
    last_name: string;
  };
  birthday: Date;
  code_account: string;
  phone_number?: string;
  email: string;
  username: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
};
