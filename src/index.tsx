import { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { reducer } from './redux/reducer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Lines } from './pages/Lines';
import { Timetables } from './pages/Timetables';
import { WestMON } from './pages/WestMON';

const store = createStore(reducer);

export const LINE_PAGE_URL = "/lines";
export const TIMETABLE_SELECT_PAGE_URL = "/timetables";
export const SHOW_TIMETABLE_PAGE_URL = "/show-timetable";

export const WEST_MON_PAGE_ID = "westmon";

export const LINE_ID_PARAM_NAME = "line_id";
export const TIMETABLE_ID_PARAM_NAME = "timetable_id";
export const STATION_ID_PARAM_NAME = "station_id";

render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
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
            path={`${TIMETABLE_SELECT_PAGE_URL}/:${LINE_ID_PARAM_NAME}`}
            element={<Timetables />}
          />
          <Route
            path={`${SHOW_TIMETABLE_PAGE_URL}/:${LINE_ID_PARAM_NAME}/:${TIMETABLE_ID_PARAM_NAME}/${WEST_MON_PAGE_ID}/:${STATION_ID_PARAM_NAME}`}
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
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
