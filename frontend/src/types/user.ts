export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export interface UserCreate {
  full_name: string;
  email: string;
  date_of_birth: string;
  gender: GenderEnum;
  password: string;
}

export interface UserResponse {
  _id: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  gender: GenderEnum;
  is_admin: boolean;
  created_at: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface RegisterFormData {
  full_name: string;
  email: string;
  date_of_birth: string;
  gender: GenderEnum;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  full_name?: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}