import { AuthenticationContext, adalFetch, withAdalLogin } from "react-adal";
/* import MyPage from './myPageComponent';
import Loading from './Loading';
import ErrorPage from './ErrorPage'; */
export const adalConfig = {
  tenant: "94ff8a7f-9b6f-4a30-b3ff-e2cc8f362139",
  clientId: "6408ee9a-e094-4ef9-be51-5c0d324360e5",
  endpoints: {
    api: "6408ee9a-e094-4ef9-be51-5c0d324360e5",
  },
  apiUrl: "https://backend-ciber-riesgos.com/",
  cacheLocation: "localStorage",
};
/* const MyProtectedPage = 
withAdalLoginApi(MyPage, () => <Loading />, (error) => <ErrorPage error={error}/>);

<Route 
   path="/onlyLoggedUsers"
   render={ ()=> <MyProtectedPage /> } 
/> */
export const authContext = new AuthenticationContext(adalConfig);
export const adalApiFetch = (fetch, url, options) =>
  adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);
export const withAdalLoginApi = withAdalLogin(
  authContext,
  adalConfig.endpoints.api
);
export const getToken = () => authContext.getCachedToken(adalConfig.clientId);
