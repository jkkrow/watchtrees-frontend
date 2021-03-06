import axios, { AxiosAdapter, AxiosError } from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import jwtDecode, { JwtPayload } from 'jwt-decode';

import { AppDispatch, AppState } from 'store';
import { authActions } from 'store/slices/auth-slice';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: { 'Cache-Control': 'no-cache' },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, {
    enabledByDefault: false,
  }),
});

export const api = (forceUpdate = true) => {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    axiosInstance.interceptors.request.use(async (req) => {
      const { refreshToken, accessToken } = getState().auth;

      if (!refreshToken || !accessToken) return req;

      const { exp } = jwtDecode<JwtPayload>(accessToken);
      const expiresIn = (exp as number) * 1000;

      if (expiresIn < Date.now()) {
        const { refreshToken } = getState().auth;

        const { data } = await axios.get('/users/access-token', {
          headers: { Authorization: 'Bearer ' + refreshToken },
        });

        dispatch(authActions.setAccessToken(data.accessToken));

        req.headers.Authorization = `Bearer ${data.accessToken}`;

        return req;
      }

      req.headers.Authorization = `Bearer ${accessToken}`;

      return req;
    });

    axiosInstance.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        let axiosError: AxiosError | undefined;

        if (err.response && err.response.data && err.response.data.message) {
          axiosError = err.response.data;
        }

        return Promise.reject(axiosError || err);
      }
    );

    axiosInstance.defaults.forceUpdate = forceUpdate;
    axiosInstance.defaults.cache = true;

    return axiosInstance;
  };
};
