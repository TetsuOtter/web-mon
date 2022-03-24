import { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { reducer } from './redux/reducer';
import { BrowserRouter, Location, Route, Routes } from 'react-router-dom';
import { Lines } from './pages/Lines';
import { Timetables } from './pages/Timetables';
import { WestMON } from './pages/WestMON';
import { ShowTimetable } from './pages/ShowTimetable';
import Header from './header';

const store = createStore(reducer);

interface _IDParams
{
  "line-id": string,
  "timetable-id": string,
  "station-id": string,
}
export type IDParams = Partial<_IDParams>;

export const LINE_PAGE_URL = "/lines";
export const TIMETABLE_SELECT_PAGE_URL = "/timetables";
export const SHOW_TIMETABLE_PAGE_URL = "/show-timetable";

export const WEST_MON_PAGE_ID = "westmon";

function getParamStr<T>(key: keyof T, value: T): string
{
  if (value[key] === undefined)
    return "";
  else
    return `${key}=${value[key]}`;
}
export function generateParams(params: IDParams)
{
  const line_id = getParamStr("line-id", params);
  const timetable_id = getParamStr("timetable-id", params);
  const station_id = getParamStr("station-id", params);

  let ret = "?";
  ret += line_id;
  if (timetable_id.length > 0)
    ret += (ret.length !== 1 ? "&" : "") + timetable_id;
  if (station_id.length > 0)
    ret += (ret.length !== 1 ? "&" : "") + station_id;

  return ret;
}

export function getIDParams(params: Location): IDParams
{
  const query = new URLSearchParams(params.search);
  return {
    "line-id": query.get("line-id") ?? undefined,
    "station-id": query.get("station-id") ?? undefined,
    "timetable-id": query.get("timetable-id") ?? undefined,
  };
}

render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <Routes>
          <Route
            path="/"
            element={<App />}
          />
          <Route
            path={`${LINE_PAGE_URL}`}
            element={<Lines />}
          />
          <Route
            path={`${TIMETABLE_SELECT_PAGE_URL}`}
            element={<Timetables />}
          />
          <Route
            path={`${SHOW_TIMETABLE_PAGE_URL}`}
            element={<ShowTimetable />}
          />
          <Route
            path={`/${WEST_MON_PAGE_ID}`}
            element={<WestMON />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
