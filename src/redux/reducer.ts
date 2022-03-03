import { AnyAction, Reducer } from "redux";

export interface ActionWithPayload<TPayload> extends AnyAction
{
  type: string,
  payload: TPayload,
}

export const reducer: Reducer<any, any> = (state, action) =>
{
  return state;
}