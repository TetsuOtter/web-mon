import { User } from "firebase/auth";
import { useSelector } from "react-redux";
import { TLineDocument } from "../firestore/DBCtrler.types";
import { State } from "../redux/reducer";

export const getCanEditThisLine = (user: User | null | string | undefined, data: TLineDocument | undefined): boolean => {
  const uid = (typeof user === "string") ? user : user?.uid;

  return (!!uid && !!data && (data.can_write.includes("") || data.can_write.includes(uid))) ?? false;
}

export const useCanEditThisLine = () => useSelector(v => (v as State).setSharedDataReducer.canEditThisLine);
