export const jwtDecodeHeader = (token: string) => {
  return jwtDecode(token, 0);
}

export const jwtDecodeBody = (token: string) => {
  return jwtDecode(token, 1);
}

export const jwtDecodeSig = (token: string) => {
  return jwtDecode(token, 2);
}

export const jwtDecode = (token: string, part: number) => {
  var base64UrlSplit = token.split('.');
  if (base64UrlSplit.length < part) {
    throw new Error("JWT token has less parts than requested")
  }
  var base64 = base64UrlSplit[part].replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
