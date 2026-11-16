export interface UserProfile {
  id: string;
  name: string;
  email?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput extends SignInInput {
  name: string;
  passwordConfirm: string;
}
