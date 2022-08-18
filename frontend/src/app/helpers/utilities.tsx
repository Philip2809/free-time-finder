import axios from "axios";

export function checkAuthCookie(cookie: string) {
  return new Promise<boolean | string>((resolve) => {
    axios.get(`http://localhost:5000/check-cookie/${cookie}`).then(res => {
      if (/(\$\.sc\.person\.id)([ ]?=[ ]?)([0-9]+;)/.test(res.data)) resolve(res.data);
      else resolve(false);
    });
  });
}
