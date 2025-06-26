export class GoogleLoginDto {
  idToken: string;
}

export class GoogleUserDto {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  emailVerified: boolean;
}
